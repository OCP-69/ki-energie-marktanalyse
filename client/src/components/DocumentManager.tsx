/**
 * DocumentManager – Datei-Upload und Verwaltung
 * Unterstützt: PDF, Word, Excel, PowerPoint, Bilder, Textdateien
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useDocuments,
  uploadDocument,
  downloadDocument,
  deleteDocument,
  formatFileSize,
  getMimeIcon,
  type Document,
} from "@/hooks/useMarketData";

const CATEGORIES = [
  { value: "all", label: "Alle Dokumente", icon: "📁" },
  { value: "general", label: "Allgemein", icon: "📂" },
  { value: "pestel", label: "PESTEL", icon: "🌐" },
  { value: "swot", label: "SWOT", icon: "⚡" },
  { value: "porter", label: "Porter's Forces", icon: "🏆" },
  { value: "strategy", label: "Strategie", icon: "🚀" },
];

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.webp";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("de-DE", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────
function UploadZone({
  onUpload,
  uploading,
}: {
  onUpload: (file: File, category: string, description: string) => Promise<void>;
  uploading: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [category, setCategory] = useState("general");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;
    await onUpload(selectedFile, category, description);
    setSelectedFile(null);
    setDescription("");
  };

  return (
    <div className="energy-card p-6 rounded-xl mb-6">
      <h3 className="text-base font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", color: "#E8EDF5" }}>
        📤 Dokument hochladen
      </h3>

      {/* Drop Zone */}
      <div
        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-4"
        style={{
          borderColor: dragOver ? "#00D4FF" : "#2A3550",
          background: dragOver ? "rgba(0,212,255,0.05)" : "rgba(255,255,255,0.02)",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        {selectedFile ? (
          <div>
            <div className="text-3xl mb-2">{getMimeIcon(selectedFile.type)}</div>
            <div className="text-sm font-semibold mb-1" style={{ color: "#00D4FF" }}>{selectedFile.name}</div>
            <div className="text-xs" style={{ color: "#8899BB" }}>{formatFileSize(selectedFile.size)}</div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">☁️</div>
            <div className="text-sm font-semibold mb-1" style={{ color: "#C8D4E8" }}>
              Datei hierher ziehen oder klicken
            </div>
            <div className="text-xs" style={{ color: "#556677" }}>
              PDF, Word, Excel, PowerPoint, Bilder, CSV · Max. 50 MB
            </div>
          </div>
        )}
      </div>

      {/* Category & Description */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#8899BB" }}>Kategorie</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#1A2235", border: "1px solid #2A3550", color: "#C8D4E8" }}>
            {CATEGORIES.filter(c => c.value !== "all").map(c => (
              <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#8899BB" }}>Beschreibung (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Kurze Beschreibung..."
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: "#1A2235", border: "1px solid #2A3550", color: "#C8D4E8" }}
          />
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedFile || uploading}
        className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
        style={{
          background: selectedFile && !uploading ? "linear-gradient(135deg, #00D4FF, #0088CC)" : "#2A3550",
          color: selectedFile && !uploading ? "#0D1421" : "#556677",
          cursor: selectedFile && !uploading ? "pointer" : "not-allowed",
        }}>
        {uploading ? "⏳ Wird hochgeladen..." : selectedFile ? "📤 Hochladen" : "Datei auswählen"}
      </button>
    </div>
  );
}

// ─── Document Card ────────────────────────────────────────────────────────────
function DocumentCard({ doc, onDelete }: { doc: Document; onDelete: (id: number) => void }) {
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    await downloadDocument(doc.id, doc.originalName);
    setDownloading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Dokument "${doc.originalName}" wirklich löschen?`)) return;
    setDeleting(true);
    const result = await deleteDocument(doc.id);
    if (result.success) {
      onDelete(doc.id);
    } else {
      alert(`Fehler: ${result.error}`);
      setDeleting(false);
    }
  };

  const catLabel = CATEGORIES.find(c => c.value === doc.category)?.label || doc.category || "Allgemein";
  const catIcon = CATEGORIES.find(c => c.value === doc.category)?.icon || "📂";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="energy-card rounded-xl p-4 flex items-start gap-4">
      {/* Icon */}
      <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
        {getMimeIcon(doc.mimeType)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-1">
          <div className="text-sm font-semibold truncate" style={{ color: "#E8EDF5" }}>
            {doc.originalName}
          </div>
        </div>
        {doc.description && (
          <div className="text-xs mb-1.5 truncate" style={{ color: "#8899BB" }}>{doc.description}</div>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: "#556677" }}>
          <span className="px-1.5 py-0.5 rounded" style={{ background: "rgba(0,212,255,0.08)", color: "#00D4FF" }}>
            {catIcon} {catLabel}
          </span>
          <span>{formatFileSize(doc.size)}</span>
          <span>·</span>
          <span>{formatDate(doc.createdAt)}</span>
          {(doc.downloadCount ?? 0) > 0 && (
            <>
              <span>·</span>
              <span>⬇️ {doc.downloadCount}×</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)" }}
          title="Herunterladen">
          {downloading ? "⏳" : "⬇️"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.2)" }}
          title="Löschen">
          {deleting ? "⏳" : "🗑️"}
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main DocumentManager ─────────────────────────────────────────────────────
export default function DocumentManager() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const { documents, loading, error, refetch } = useDocuments(activeCategory);

  const handleUpload = async (file: File, category: string, description: string) => {
    setUploading(true);
    setUploadMessage(null);

    const result = await uploadDocument(file, category, description);

    if (result.success) {
      setUploadMessage({ type: "success", text: `"${file.name}" erfolgreich hochgeladen!` });
      refetch();
    } else {
      setUploadMessage({ type: "error", text: `Fehler: ${result.error}` });
    }

    setUploading(false);
    setTimeout(() => setUploadMessage(null), 5000);
  };

  const handleDelete = (id: number) => {
    refetch();
  };

  return (
    <div>
      {/* Upload Zone */}
      <UploadZone onUpload={handleUpload} uploading={uploading} />

      {/* Upload Message */}
      <AnimatePresence>
        {uploadMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 px-4 py-3 rounded-lg text-sm font-semibold"
            style={{
              background: uploadMessage.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${uploadMessage.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              color: uploadMessage.type === "success" ? "#10B981" : "#EF4444",
            }}>
            {uploadMessage.type === "success" ? "✅" : "❌"} {uploadMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
            style={{
              background: activeCategory === cat.value ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.04)",
              color: activeCategory === cat.value ? "#00D4FF" : "#8899BB",
              border: `1px solid ${activeCategory === cat.value ? "rgba(0,212,255,0.3)" : "#2A3550"}`,
            }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Document List */}
      {loading ? (
        <div className="text-center py-12" style={{ color: "#556677" }}>
          <div className="text-3xl mb-3 animate-spin">⚙️</div>
          <div className="text-sm">Dokumente werden geladen...</div>
        </div>
      ) : error ? (
        <div className="text-center py-12" style={{ color: "#EF4444" }}>
          <div className="text-3xl mb-3">⚠️</div>
          <div className="text-sm">Fehler beim Laden: {error}</div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 energy-card rounded-xl" style={{ color: "#556677" }}>
          <div className="text-4xl mb-3">📭</div>
          <div className="text-sm font-semibold mb-1" style={{ color: "#8899BB" }}>Keine Dokumente vorhanden</div>
          <div className="text-xs">Laden Sie Ihre ersten Dokumente hoch</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs" style={{ color: "#556677" }}>
              {documents.length} Dokument{documents.length !== 1 ? "e" : ""}
            </span>
          </div>
          <AnimatePresence>
            {documents.map(doc => (
              <DocumentCard key={doc.id} doc={doc} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
