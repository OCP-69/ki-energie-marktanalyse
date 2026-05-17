/**
 * React-Hooks für die Backend-API
 * Lädt Marktdaten und Dokumente aus der Datenbank
 */

import { useState, useEffect, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MarketStat {
  id: number;
  label: string;
  value: string;
  sub: string;
  color: string;
}

export interface MarketGrowthPoint {
  id: number;
  year: string;
  value: number;
}

export interface UseCase {
  id: number;
  name: string;
  value: number;
  color: string;
}

export interface PestelDimension {
  label: string;
  icon: string;
  color: string;
  rating: number;
  summary: string;
  factors: { title: string; impact: string; description: string }[];
}

export interface SwotData {
  strengths: { title: string; description: string }[];
  weaknesses: { title: string; description: string }[];
  opportunities: { title: string; description: string }[];
  threats: { title: string; description: string }[];
}

export interface PorterForce {
  id: number;
  force: string;
  level: string;
  score: number;
  color: string;
  icon: string;
  description: string;
  factors: { name: string; impact: string; direction: string }[];
}

export interface Competitor {
  id: number;
  name: string;
  type: string;
  focus: string;
  strength: number;
  color: string;
}

export interface StrategicRecommendation {
  id: number;
  priority: string;
  timeframe: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

export interface MarketData {
  marketStats: MarketStat[];
  marketGrowth: MarketGrowthPoint[];
  useCases: UseCase[];
  pestel: Record<string, PestelDimension>;
  swot: SwotData;
  porter: PorterForce[];
  competitors: Competitor[];
  strategicRecommendations: StrategicRecommendation[];
}

export interface Document {
  id: number;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  storageKey: string;
  storageUrl: string | null;
  category: string | null;
  description: string | null;
  uploadedBy: string | null;
  isPublic: boolean | null;
  downloadCount: number | null;
  createdAt: string;
}

// ─── useMarketData ────────────────────────────────────────────────────────────
export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/market-data")
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: MarketData) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("useMarketData error:", err);
        setError(String(err));
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

// ─── useDocuments ─────────────────────────────────────────────────────────────
export function useDocuments(category?: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(() => {
    setLoading(true);
    const url = category && category !== "all"
      ? `/api/documents?category=${encodeURIComponent(category)}`
      : "/api/documents";

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: Document[]) => {
        setDocuments(d);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [category]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return { documents, loading, error, refetch: fetchDocuments };
}

// ─── uploadDocument ───────────────────────────────────────────────────────────
export async function uploadDocument(
  file: File,
  category: string = "general",
  description: string = "",
  uploadedBy: string = "anonymous"
): Promise<{ success: boolean; document?: Document; error?: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("uploadedBy", uploadedBy);

  try {
    const resp = await fetch("/api/documents/upload", {
      method: "POST",
      body: formData,
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { success: false, error: data.error || `HTTP ${resp.status}` };
    }

    return { success: true, document: data.document };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ─── downloadDocument ─────────────────────────────────────────────────────────
export async function downloadDocument(id: number, filename: string): Promise<void> {
  try {
    const resp = await fetch(`/api/documents/${id}/download`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { url } = await resp.json();
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.target = "_blank";
    a.click();
  } catch (err) {
    console.error("Download error:", err);
    alert(`Download fehlgeschlagen: ${err}`);
  }
}

// ─── deleteDocument ───────────────────────────────────────────────────────────
export async function deleteDocument(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    const resp = await fetch(`/api/documents/${id}`, { method: "DELETE" });
    const data = await resp.json();
    if (!resp.ok) return { success: false, error: data.error };
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

// ─── formatFileSize ───────────────────────────────────────────────────────────
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── getMimeIcon ──────────────────────────────────────────────────────────────
export function getMimeIcon(mimeType: string): string {
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  if (mimeType.includes("powerpoint") || mimeType.includes("presentation")) return "📋";
  if (mimeType.includes("image")) return "🖼️";
  if (mimeType.includes("text")) return "📃";
  return "📁";
}
