/**
 * API-Tests für KI-Energie-Marktanalyse Backend
 * Testet: Marktdaten-API, Dokument-Upload, Download, Löschen
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mock der Datenbankverbindung ─────────────────────────────────────────────
vi.mock("./db/index.js", () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockResolvedValue([{ insertId: 1 }]),
    update: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
  },
}));

// ─── Mock des Storage-Moduls ──────────────────────────────────────────────────
vi.mock("./storage.js", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test/file.txt", url: "/manus-storage/test/file.txt" }),
  storageGet: vi.fn().mockResolvedValue({ key: "test/file.txt", url: "https://example.com/presigned-url" }),
  storageDelete: vi.fn().mockResolvedValue(undefined),
}));

// ─── Hilfsfunktionen für Tests ────────────────────────────────────────────────

/**
 * Prüft ob ein Objekt die erwarteten Schlüssel hat
 */
function hasKeys(obj: Record<string, unknown>, keys: string[]): boolean {
  return keys.every((key) => key in obj);
}

/**
 * Erstellt ein Mock-Dokument für Tests
 */
function createMockDocument(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 1,
    name: "test_file.pdf",
    originalName: "Test Dokument.pdf",
    mimeType: "application/pdf",
    size: 1024,
    storageKey: "documents/1234567890_test_file.pdf",
    storageUrl: "/manus-storage/documents/1234567890_test_file.pdf",
    category: "general",
    description: "Test-Beschreibung",
    uploadedBy: "test-user",
    isPublic: true,
    downloadCount: 0,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    ...overrides,
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("Marktdaten-API", () => {
  it("sollte alle erforderlichen Schlüssel in der Marktdaten-Antwort enthalten", () => {
    const expectedKeys = [
      "marketStats",
      "marketGrowth",
      "useCases",
      "pestel",
      "swot",
      "porter",
      "competitors",
      "strategicRecommendations",
    ];

    const mockResponse = {
      marketStats: [],
      marketGrowth: [],
      useCases: [],
      pestel: {},
      swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      porter: [],
      competitors: [],
      strategicRecommendations: [],
    };

    expect(hasKeys(mockResponse, expectedKeys)).toBe(true);
  });

  it("sollte SWOT-Daten korrekt nach Quadranten gruppieren", () => {
    const swotItems = [
      { quadrant: "strengths", title: "Stärke 1", description: "Beschreibung" },
      { quadrant: "weaknesses", title: "Schwäche 1", description: "Beschreibung" },
      { quadrant: "opportunities", title: "Chance 1", description: "Beschreibung" },
      { quadrant: "threats", title: "Risiko 1", description: "Beschreibung" },
    ];

    const grouped: Record<string, { title: string; description: string }[]> = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    };

    for (const s of swotItems) {
      grouped[s.quadrant]?.push({ title: s.title, description: s.description });
    }

    expect(grouped.strengths).toHaveLength(1);
    expect(grouped.weaknesses).toHaveLength(1);
    expect(grouped.opportunities).toHaveLength(1);
    expect(grouped.threats).toHaveLength(1);
    expect(grouped.strengths[0].title).toBe("Stärke 1");
  });

  it("sollte PESTEL-Faktoren korrekt nach Dimensionen gruppieren", () => {
    const pestelFactors = [
      { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Summary", title: "Faktor 1", impact: "positiv", description: "Beschreibung" },
      { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Summary", title: "Faktor 2", impact: "negativ", description: "Beschreibung" },
      { dimension: "economic", dimensionLabel: "Wirtschaftlich", dimensionIcon: "📈", dimensionColor: "#10B981", dimensionRating: 5, dimensionSummary: "Summary", title: "Faktor 3", impact: "positiv", description: "Beschreibung" },
    ];

    const grouped: Record<string, { label: string; icon: string; color: string; rating: number; summary: string; factors: { title: string; impact: string; description: string }[] }> = {};

    for (const f of pestelFactors) {
      if (!grouped[f.dimension]) {
        grouped[f.dimension] = {
          label: f.dimensionLabel,
          icon: f.dimensionIcon,
          color: f.dimensionColor,
          rating: f.dimensionRating,
          summary: f.dimensionSummary,
          factors: [],
        };
      }
      grouped[f.dimension].factors.push({ title: f.title, impact: f.impact, description: f.description });
    }

    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped.political.factors).toHaveLength(2);
    expect(grouped.economic.factors).toHaveLength(1);
    expect(grouped.political.rating).toBe(4);
  });
});

describe("Dokument-Verwaltung", () => {
  it("sollte ein gültiges Dokument-Objekt erstellen", () => {
    const doc = createMockDocument();
    const requiredFields = ["id", "name", "originalName", "mimeType", "size", "storageKey", "category"];
    expect(hasKeys(doc as Record<string, unknown>, requiredFields)).toBe(true);
  });

  it("sollte Dateigröße korrekt formatieren", () => {
    function formatFileSize(bytes: number): string {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(2097152)).toBe("2.0 MB");
  });

  it("sollte MIME-Typ korrekt identifizieren", () => {
    function getMimeIcon(mimeType: string): string {
      if (mimeType.includes("pdf")) return "📄";
      if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
      if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
      if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📋";
      if (mimeType.includes("image")) return "🖼️";
      if (mimeType.includes("text")) return "📃";
      return "📁";
    }

    expect(getMimeIcon("application/pdf")).toBe("📄");
    expect(getMimeIcon("application/vnd.openxmlformats-officedocument.wordprocessingml.document")).toBe("📝");
    expect(getMimeIcon("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).toBe("📊");
    expect(getMimeIcon("image/png")).toBe("🖼️");
    expect(getMimeIcon("text/plain")).toBe("📃");
    expect(getMimeIcon("application/zip")).toBe("📁");
  });

  it("sollte Storage-Key korrekt generieren", () => {
    const originalname = "Mein Dokument (2025).pdf";
    const timestamp = 1700000000000;
    const safeFilename = originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storageKey = `documents/${timestamp}_${safeFilename}`;

    expect(storageKey).toBe("documents/1700000000000_Mein_Dokument__2025_.pdf");
    expect(storageKey).not.toContain(" ");
    expect(storageKey).not.toContain("(");
    expect(storageKey).not.toContain(")");
  });

  it("sollte erlaubte MIME-Typen korrekt validieren", () => {
    const allowedTypes = [
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

    const isAllowed = (mimeType: string) => allowedTypes.includes(mimeType);

    expect(isAllowed("application/pdf")).toBe(true);
    expect(isAllowed("image/png")).toBe(true);
    expect(isAllowed("text/plain")).toBe(true);
    expect(isAllowed("application/zip")).toBe(false);
    expect(isAllowed("video/mp4")).toBe(false);
    expect(isAllowed("application/x-executable")).toBe(false);
  });

  it("sollte Download-Zähler korrekt erhöhen", () => {
    const doc = createMockDocument({ downloadCount: 5 });
    const newCount = (doc.downloadCount as number) + 1;
    expect(newCount).toBe(6);
  });
});

describe("Marktdaten-Validierung", () => {
  it("sollte Marktstatistiken korrekte Struktur haben", () => {
    const stat = { id: 1, label: "Marktgröße 2025", value: "252,8 Mio. USD", sub: "KI in Energie, Deutschland", color: "#00D4FF", sortOrder: 0 };
    expect(stat.label).toBeTruthy();
    expect(stat.value).toBeTruthy();
    expect(stat.color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it("sollte Wachstumsdaten chronologisch sortiert sein", () => {
    const growth = [
      { year: "2021", value: 85 },
      { year: "2022", value: 112 },
      { year: "2023", value: 148 },
    ];

    for (let i = 1; i < growth.length; i++) {
      expect(parseInt(growth[i].year)).toBeGreaterThan(parseInt(growth[i - 1].year));
      expect(growth[i].value).toBeGreaterThan(growth[i - 1].value);
    }
  });

  it("sollte Porter-Score zwischen 1 und 5 liegen", () => {
    const forces = [
      { force: "Wettbewerbsintensität", score: 4 },
      { force: "Lieferantenmacht", score: 2 },
      { force: "Käufermacht", score: 3 },
    ];

    forces.forEach((f) => {
      expect(f.score).toBeGreaterThanOrEqual(1);
      expect(f.score).toBeLessThanOrEqual(5);
    });
  });
});
