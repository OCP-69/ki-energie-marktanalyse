/**
 * KI-Energie-Marktanalyse – Express Backend
 * API-Routen: /api/market-data, /api/documents, /api/upload
 */

import express from "express";
import { createServer } from "http";
import multer from "multer";
import { db } from "./db/index.js";
import {
  competitors,
  documents,
  marketGrowth,
  marketStats,
  pestelFactors,
  porterForces,
  strategicRecommendations,
  swotItems,
  useCases,
} from "./db/schema.js";
import { storageDelete, storageGet, storagePut } from "./storage.js";
import { asc, desc, eq } from "drizzle-orm";

// Multer: Dateien im Speicher halten (Buffer)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/csv",
      "image/png",
      "image/jpeg",
      "image/webp",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Dateityp nicht erlaubt: ${file.mimetype}`));
    }
  },
});

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ── CORS für Dev ──────────────────────────────────────────────────────────
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.sendStatus(200);
    next();
  });

  // ── Health Check ──────────────────────────────────────────────────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // ── Marktdaten: Alle Daten auf einmal ─────────────────────────────────────
  app.get("/api/market-data", async (_req, res) => {
    try {
      const [stats, growth, cases, pestel, swot, porter, comps, recs] = await Promise.all([
        db.select().from(marketStats).orderBy(asc(marketStats.sortOrder)),
        db.select().from(marketGrowth).orderBy(asc(marketGrowth.year)),
        db.select().from(useCases).orderBy(asc(useCases.sortOrder)),
        db.select().from(pestelFactors).orderBy(asc(pestelFactors.sortOrder)),
        db.select().from(swotItems).orderBy(asc(swotItems.sortOrder)),
        db.select().from(porterForces).orderBy(asc(porterForces.sortOrder)),
        db.select().from(competitors).orderBy(asc(competitors.sortOrder)),
        db.select().from(strategicRecommendations).orderBy(asc(strategicRecommendations.sortOrder)),
      ]);

      // PESTEL nach Dimensionen gruppieren
      const pestelGrouped: Record<string, { label: string; icon: string; color: string; rating: number; summary: string; factors: { title: string; impact: string; description: string }[] }> = {};
      for (const f of pestel) {
        if (!pestelGrouped[f.dimension]) {
          pestelGrouped[f.dimension] = {
            label: f.dimensionLabel,
            icon: f.dimensionIcon,
            color: f.dimensionColor,
            rating: f.dimensionRating,
            summary: f.dimensionSummary,
            factors: [],
          };
        }
        pestelGrouped[f.dimension].factors.push({
          title: f.title,
          impact: f.impact,
          description: f.description,
        });
      }

      // SWOT nach Quadranten gruppieren
      const swotGrouped: Record<string, { title: string; description: string }[]> = {
        strengths: [], weaknesses: [], opportunities: [], threats: [],
      };
      for (const s of swot) {
        swotGrouped[s.quadrant]?.push({ title: s.title, description: s.description });
      }

      res.json({
        marketStats: stats,
        marketGrowth: growth,
        useCases: cases,
        pestel: pestelGrouped,
        swot: swotGrouped,
        porter: porter.map((p) => ({ ...p, factors: p.factors as { name: string; impact: string; direction: string }[] })),
        competitors: comps,
        strategicRecommendations: recs,
      });
    } catch (err) {
      console.error("market-data error:", err);
      res.status(500).json({ error: "Datenbankfehler beim Laden der Marktdaten" });
    }
  });

  // ── Dokumente: Liste ──────────────────────────────────────────────────────
  app.get("/api/documents", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      let query = db.select().from(documents).orderBy(desc(documents.createdAt));
      if (category && category !== "all") {
        const docs = await db.select().from(documents).where(eq(documents.category, category)).orderBy(desc(documents.createdAt));
        return res.json(docs);
      }
      const docs = await query;
      res.json(docs);
    } catch (err) {
      console.error("documents list error:", err);
      res.status(500).json({ error: "Fehler beim Laden der Dokumente" });
    }
  });

  // ── Dokumente: Upload ─────────────────────────────────────────────────────
  app.post("/api/documents/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Keine Datei hochgeladen" });
      }

      const { originalname, mimetype, size, buffer } = req.file;
      const category = (req.body.category as string) || "general";
      const description = (req.body.description as string) || "";
      const uploadedBy = (req.body.uploadedBy as string) || "anonymous";

      // Eindeutiger Storage-Key
      const timestamp = Date.now();
      const safeFilename = originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storageKey = `documents/${timestamp}_${safeFilename}`;

      // In S3 hochladen
      const { url: storageUrl } = await storagePut(storageKey, buffer, mimetype);

      // Metadaten in DB speichern
      const [result] = await db.insert(documents).values({
        name: safeFilename,
        originalName: originalname,
        mimeType: mimetype,
        size,
        storageKey,
        storageUrl,
        category,
        description,
        uploadedBy,
        isPublic: true,
        downloadCount: 0,
      });

      const insertId = (result as { insertId: number }).insertId;
      const [doc] = await db.select().from(documents).where(eq(documents.id, insertId));

      res.status(201).json({
        success: true,
        document: doc,
        message: `Datei "${originalname}" erfolgreich hochgeladen`,
      });
    } catch (err) {
      console.error("upload error:", err);
      res.status(500).json({ error: String(err) });
    }
  });

  // ── Dokumente: Download-URL ───────────────────────────────────────────────
  app.get("/api/documents/:id/download", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [doc] = await db.select().from(documents).where(eq(documents.id, id));

      if (!doc) {
        return res.status(404).json({ error: "Dokument nicht gefunden" });
      }

      // Download-Zähler erhöhen
      await db.update(documents)
        .set({ downloadCount: (doc.downloadCount || 0) + 1 })
        .where(eq(documents.id, id));

      // Presigned URL generieren
      const { url } = await storageGet(doc.storageKey, 3600);
      res.json({ url, filename: doc.originalName });
    } catch (err) {
      console.error("download error:", err);
      res.status(500).json({ error: "Fehler beim Generieren der Download-URL" });
    }
  });

  // ── Dokumente: Löschen ────────────────────────────────────────────────────
  app.delete("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const [doc] = await db.select().from(documents).where(eq(documents.id, id));

      if (!doc) {
        return res.status(404).json({ error: "Dokument nicht gefunden" });
      }

      // Aus S3 löschen
      try {
        await storageDelete(doc.storageKey);
      } catch (storageErr) {
        console.warn("S3 delete warning:", storageErr);
      }

      // Aus DB löschen
      await db.delete(documents).where(eq(documents.id, id));

      res.json({ success: true, message: `Dokument "${doc.originalName}" gelöscht` });
    } catch (err) {
      console.error("delete error:", err);
      res.status(500).json({ error: "Fehler beim Löschen des Dokuments" });
    }
  });

  // ── Catch-all für nicht gefundene API-Routen ─────────────────────────────
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ error: "API-Route nicht gefunden" });
  });

  const port = process.env.API_PORT || 3001;
  server.listen(port, () => {
    console.log(`🚀 Server läuft auf http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
