# KI-Energie-Marktanalyse – TODO

## Initiale Marktanalyse-Webseite
- [x] Marktrecherche und Datenerhebung (PESTEL, SWOT, Porter's Five Forces)
- [x] Design-Konzept: Technischer Minimalismus mit Energie-Metaphern
- [x] Hero-Sektion mit Marktstatistiken (KPIs aus Datenbank)
- [x] PESTEL-Analyse-Sektion mit Hexagon-Kacheln und Radar-Diagramm
- [x] SWOT-Matrix mit 4 Quadranten und Strategieableitung
- [x] Porter's Five Forces mit Balkendiagramm und Detailansicht
- [x] Wettbewerbslandschaft mit 8 Hauptakteuren
- [x] Strategische Empfehlungen mit 3-Phasen-Ausblick
- [x] Responsive Design mit Sidebar-Navigation
- [x] Interaktive Recharts-Diagramme

## Full-Stack & Datenbank-Integration
- [x] Datenbankschema erstellt (8 Tabellen: market_stats, market_growth, use_cases, pestel_factors, swot_items, porter_forces, competitors, documents, strategic_recommendations)
- [x] Seed-Skript mit 94 Datensätzen erfolgreich ausgeführt
- [x] Express-Backend-Server auf Port 3001
- [x] REST-API: GET /api/market-data (alle Analysedaten aus DB)
- [x] REST-API: GET /api/documents (Dokumentenliste)
- [x] REST-API: POST /api/documents/upload (Datei-Upload zu S3)
- [x] REST-API: GET /api/documents/:id/download (Presigned Download-URL)
- [x] REST-API: DELETE /api/documents/:id (Dokument löschen)
- [x] S3-Speicher-Integration (storagePut, storageGet, storageDelete)
- [x] Vite-Proxy-Konfiguration für /api → Port 3001
- [x] DocumentManager-Komponente im Frontend
- [x] useMarketData-Hook für API-Datenabruf
- [x] Vitest-Tests (12 Tests, alle bestanden)
- [x] concurrently für parallelen Start von API + Vite

## Ausstehend / Zukünftige Erweiterungen
- [ ] Authentifizierung für Dokument-Upload (nur eingeloggte Nutzer)
- [ ] PDF-Export der Analyse
- [ ] Filterbare Wettbewerbsmatrix
- [ ] Quellenverweise als ausklappbares Literaturverzeichnis
- [ ] Admin-Panel für Datenverwaltung
