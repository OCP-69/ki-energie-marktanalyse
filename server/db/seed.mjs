/**
 * Seed-Skript – Alle Marktanalysedaten in die Datenbank einspeichern
 * Ausführen: DATABASE_URL=... node server/db/seed.mjs
 */

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  mysqlTable, int, varchar, text, timestamp, json, boolean
} from "drizzle-orm/mysql-core";

const pool = await mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: true },
  connectionLimit: 5,
});

const db = drizzle(pool);

// ─── Schema (inline, um Import-Probleme zu vermeiden) ────────────────────────
const marketStats = mysqlTable("market_stats", {
  id: int("id").primaryKey().autoincrement(),
  label: varchar("label", { length: 100 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  sub: varchar("sub", { length: 200 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

const marketGrowth = mysqlTable("market_growth", {
  id: int("id").primaryKey().autoincrement(),
  year: varchar("year", { length: 10 }).notNull(),
  value: int("value").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

const useCases = mysqlTable("use_cases", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 200 }).notNull(),
  value: int("value").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

const pestelFactors = mysqlTable("pestel_factors", {
  id: int("id").primaryKey().autoincrement(),
  dimension: varchar("dimension", { length: 20 }).notNull(),
  dimensionLabel: varchar("dimension_label", { length: 50 }).notNull(),
  dimensionIcon: varchar("dimension_icon", { length: 10 }).notNull(),
  dimensionColor: varchar("dimension_color", { length: 20 }).notNull(),
  dimensionRating: int("dimension_rating").notNull(),
  dimensionSummary: text("dimension_summary").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  impact: varchar("impact", { length: 20 }).notNull(),
  description: text("description").notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

const swotItems = mysqlTable("swot_items", {
  id: int("id").primaryKey().autoincrement(),
  quadrant: varchar("quadrant", { length: 20 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

const porterForces = mysqlTable("porter_forces", {
  id: int("id").primaryKey().autoincrement(),
  forceName: varchar("force", { length: 200 }).notNull(),
  level: varchar("level", { length: 50 }).notNull(),
  score: int("score").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  description: text("description").notNull(),
  factors: json("factors").notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

const competitors = mysqlTable("competitors", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(),
  focus: varchar("focus", { length: 200 }).notNull(),
  strength: int("strength").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

const strategicRecommendations = mysqlTable("strategic_recommendations", {
  id: int("id").primaryKey().autoincrement(),
  priority: varchar("priority", { length: 20 }).notNull(),
  timeframe: varchar("timeframe", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  icon: varchar("icon", { length: 10 }).notNull(),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Daten ────────────────────────────────────────────────────────────────────
const marketStatsData = [
  { label: "Marktgröße 2025", value: "252,8 Mio. USD", sub: "KI in Energie, Deutschland", color: "#00D4FF", sortOrder: 1 },
  { label: "Prognose 2033", value: "1,1 Mrd. USD", sub: "CAGR 20,6% p.a.", color: "#10B981", sortOrder: 2 },
  { label: "Kostensenkung", value: "bis 56%", sub: "Stadtwerke bis 2035 (Fraunhofer IPK)", color: "#F59E0B", sortOrder: 3 },
  { label: "Marktteilnehmer", value: "~1.900+", sub: "EVU, Stadtwerke, Netzbetreiber", color: "#8B5CF6", sortOrder: 4 },
];

const marketGrowthData = [
  { year: "2021", value: 85 }, { year: "2022", value: 112 }, { year: "2023", value: 148 },
  { year: "2024", value: 198 }, { year: "2025", value: 253 }, { year: "2026", value: 325 },
  { year: "2027", value: 415 }, { year: "2028", value: 530 }, { year: "2029", value: 665 },
  { year: "2030", value: 820 }, { year: "2031", value: 920 }, { year: "2032", value: 1020 },
  { year: "2033", value: 1106 },
];

const useCasesData = [
  { name: "Netzplanung & Smart Grid", value: 28, color: "#00D4FF", sortOrder: 1 },
  { name: "Predictive Maintenance", value: 22, color: "#10B981", sortOrder: 2 },
  { name: "Lastprognose & Handel", value: 18, color: "#F59E0B", sortOrder: 3 },
  { name: "Kundenservice & CRM", value: 15, color: "#8B5CF6", sortOrder: 4 },
  { name: "Erneuerbare Integration", value: 12, color: "#06B6D4", sortOrder: 5 },
  { name: "Prozessautomatisierung", value: 5, color: "#6366F1", sortOrder: 6 },
];

const pestelData = [
  { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Starker politischer Rückenwind durch Energiewende-Ziele und nationale KI-Strategie", title: "Nationale KI-Strategie 2020", impact: "positiv", description: "Die Bundesregierung hat Deutschland und Europa als führenden KI-Standort positioniert. Investitionsziel von 5 Mrd. EUR bis 2025 schafft Nachfrage nach KI-Beratungsleistungen.", sortOrder: 1 },
  { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Starker politischer Rückenwind durch Energiewende-Ziele und nationale KI-Strategie", title: "Energiewende-Gesetzgebung", impact: "positiv", description: "Ziel: 80% Erneuerbare Energien bis 2030. Dieser Transformationsdruck zwingt EVU und Netzbetreiber zur KI-gestützten Flexibilitätssteuerung und Netzoptimierung.", sortOrder: 2 },
  { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Starker politischer Rückenwind durch Energiewende-Ziele und nationale KI-Strategie", title: "EU AI Act (2024)", impact: "gemischt", description: "Hochrisiko-Klassifizierung für KI in kritischer Infrastruktur (KRITIS) erhöht Compliance-Aufwand, schafft aber gleichzeitig Beratungsbedarf für Implementierung und Zertifizierung.", sortOrder: 3 },
  { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Starker politischer Rückenwind durch Energiewende-Ziele und nationale KI-Strategie", title: "KI-Aufsichtsgesetz (KI-MIG, Feb. 2026)", impact: "gemischt", description: "Nationale Umsetzung der EU-KI-Verordnung mit schlanker Aufsichtsstruktur. Energiesektor als KRITIS unterliegt erhöhter Regulierungsintensität.", sortOrder: 4 },
  { dimension: "political", dimensionLabel: "Politisch", dimensionIcon: "🏛️", dimensionColor: "#EF4444", dimensionRating: 4, dimensionSummary: "Starker politischer Rückenwind durch Energiewende-Ziele und nationale KI-Strategie", title: "Digitalisierungsgesetz Energiewende (DigiG)", impact: "positiv", description: "Gesetzlicher Rahmen für die Digitalisierung der Energieinfrastruktur. Smart Meter Rollout (53 Mio. Zähler bis 2032) generiert massive Datenmengen als KI-Grundlage.", sortOrder: 5 },
  { dimension: "economic", dimensionLabel: "Wirtschaftlich", dimensionIcon: "📈", dimensionColor: "#10B981", dimensionRating: 5, dimensionSummary: "Enormes Marktpotenzial durch Kostendruck, Energiepreisvolatilität und Digitalisierungsinvestitionen", title: "Marktgröße & Wachstum", impact: "positiv", description: "KI in Energie Deutschland: USD 252,8 Mio. (2025) → USD 1.106,2 Mio. (2033), CAGR 20,6%. Der globale KI-Beratungsmarkt wächst auf über USD 100 Mrd. bis 2030.", sortOrder: 1 },
  { dimension: "economic", dimensionLabel: "Wirtschaftlich", dimensionIcon: "📈", dimensionColor: "#10B981", dimensionRating: 5, dimensionSummary: "Enormes Marktpotenzial durch Kostendruck, Energiepreisvolatilität und Digitalisierungsinvestitionen", title: "Kostensenkungspotenzial", impact: "positiv", description: "Fraunhofer IPK-Studie (2025): Stadtwerke können bis 2035 Betriebskosten um bis zu 56% senken. ROI-Argument ist überzeugend für Investitionsentscheidungen.", sortOrder: 2 },
  { dimension: "economic", dimensionLabel: "Wirtschaftlich", dimensionIcon: "📈", dimensionColor: "#10B981", dimensionRating: 5, dimensionSummary: "Enormes Marktpotenzial durch Kostendruck, Energiepreisvolatilität und Digitalisierungsinvestitionen", title: "Energiepreisvolatilität", impact: "positiv", description: "Hohe Energiepreisschwankungen seit 2021/22 erhöhen Nachfrage nach KI-gestützten Prognose- und Optimierungstools. Jede Verbesserung der Prognosegenauigkeit hat direkten wirtschaftlichen Wert.", sortOrder: 3 },
  { dimension: "economic", dimensionLabel: "Wirtschaftlich", dimensionIcon: "📈", dimensionColor: "#10B981", dimensionRating: 5, dimensionSummary: "Enormes Marktpotenzial durch Kostendruck, Energiepreisvolatilität und Digitalisierungsinvestitionen", title: "Investitionsbudgets EVU", impact: "gemischt", description: "Große EVU (E.ON, RWE, EnBW) investieren Milliarden in Digitalisierung. Stadtwerke haben begrenztere Budgets, suchen aber nach skalierbaren SaaS-Lösungen.", sortOrder: 4 },
  { dimension: "economic", dimensionLabel: "Wirtschaftlich", dimensionIcon: "📈", dimensionColor: "#10B981", dimensionRating: 5, dimensionSummary: "Enormes Marktpotenzial durch Kostendruck, Energiepreisvolatilität und Digitalisierungsinvestitionen", title: "Netzausbau-Investitionen", impact: "positiv", description: "Bundesnetzagentur: 600 Mrd. EUR Netzinvestitionen bis 2045. Jedes Netzausbauprojekt erfordert KI-gestützte Planung, Simulation und Betriebsoptimierung.", sortOrder: 5 },
  { dimension: "social", dimensionLabel: "Sozial", dimensionIcon: "👥", dimensionColor: "#F59E0B", dimensionRating: 3, dimensionSummary: "Fachkräftemangel als Treiber, aber Akzeptanzprobleme und Datenschutzbedenken als Bremse", title: "Fachkräftemangel", impact: "positiv", description: "Akuter Mangel an Ingenieuren, Netztechnikern und IT-Spezialisten in der Energiebranche. KI wird zunehmend als Lösung zur Kompensation des Personalmangels betrachtet.", sortOrder: 1 },
  { dimension: "social", dimensionLabel: "Sozial", dimensionIcon: "👥", dimensionColor: "#F59E0B", dimensionRating: 3, dimensionSummary: "Fachkräftemangel als Treiber, aber Akzeptanzprobleme und Datenschutzbedenken als Bremse", title: "Demografischer Wandel", impact: "positiv", description: "Wissenstransfer von erfahrenen Mitarbeitern in KI-Systeme wird zur strategischen Priorität. Viele Experten gehen in den nächsten 10 Jahren in Rente.", sortOrder: 2 },
  { dimension: "social", dimensionLabel: "Sozial", dimensionIcon: "👥", dimensionColor: "#F59E0B", dimensionRating: 3, dimensionSummary: "Fachkräftemangel als Treiber, aber Akzeptanzprobleme und Datenschutzbedenken als Bremse", title: "Akzeptanz & Change Management", impact: "negativ", description: "Mitarbeiter und Betriebsräte stehen KI-Systemen skeptisch gegenüber. Umfangreiche Change-Management-Beratung ist notwendig, erhöht aber auch den Beratungsbedarf.", sortOrder: 3 },
  { dimension: "social", dimensionLabel: "Sozial", dimensionIcon: "👥", dimensionColor: "#F59E0B", dimensionRating: 3, dimensionSummary: "Fachkräftemangel als Treiber, aber Akzeptanzprobleme und Datenschutzbedenken als Bremse", title: "Datenschutzbewusstsein", impact: "gemischt", description: "Hohes Datenschutzbewusstsein in Deutschland (DSGVO-Kultur) erhöht Compliance-Anforderungen, schafft aber Nachfrage nach datenschutzkonformen KI-Lösungen.", sortOrder: 4 },
  { dimension: "social", dimensionLabel: "Sozial", dimensionIcon: "👥", dimensionColor: "#F59E0B", dimensionRating: 3, dimensionSummary: "Fachkräftemangel als Treiber, aber Akzeptanzprobleme und Datenschutzbedenken als Bremse", title: "Nachhaltigkeitsdruck", impact: "positiv", description: "Gesellschaftlicher Druck zur Dekarbonisierung treibt Investitionen in KI-gestützte Energieeffizienz und Erneuerbare-Energien-Integration.", sortOrder: 5 },
  { dimension: "technological", dimensionLabel: "Technologisch", dimensionIcon: "⚙️", dimensionColor: "#00D4FF", dimensionRating: 5, dimensionSummary: "Rasante technologische Entwicklung schafft neue Möglichkeiten, aber auch Komplexität", title: "Generative KI & LLMs", impact: "positiv", description: "GPT-4-Klasse-Modelle ermöglichen neue Anwendungen: automatisierte Berichterstellung, Kundenservice-Bots, Code-Generierung für Energiemanagementsysteme.", sortOrder: 1 },
  { dimension: "technological", dimensionLabel: "Technologisch", dimensionIcon: "⚙️", dimensionColor: "#00D4FF", dimensionRating: 5, dimensionSummary: "Rasante technologische Entwicklung schafft neue Möglichkeiten, aber auch Komplexität", title: "Edge Computing & IoT", impact: "positiv", description: "Millionen Smart Meter, Sensoren und dezentrale Erzeuger generieren Echtzeit-Daten. Edge-KI ermöglicht lokale Verarbeitung ohne Latenz – kritisch für Netzsteuerung.", sortOrder: 2 },
  { dimension: "technological", dimensionLabel: "Technologisch", dimensionIcon: "⚙️", dimensionColor: "#00D4FF", dimensionRating: 5, dimensionSummary: "Rasante technologische Entwicklung schafft neue Möglichkeiten, aber auch Komplexität", title: "Legacy IT-Systeme", impact: "negativ", description: "Viele EVU betreiben SCADA- und ERP-Systeme aus den 1990er-2000er Jahren. Integration moderner KI-Lösungen in Legacy-Infrastruktur ist komplex und kostenintensiv.", sortOrder: 3 },
  { dimension: "technological", dimensionLabel: "Technologisch", dimensionIcon: "⚙️", dimensionColor: "#00D4FF", dimensionRating: 5, dimensionSummary: "Rasante technologische Entwicklung schafft neue Möglichkeiten, aber auch Komplexität", title: "Cloud-Infrastruktur", impact: "positiv", description: "Wachsende Cloud-Akzeptanz (AWS, Azure, Google Cloud) in der Energiebranche senkt Einstiegshürden für KI-Implementierungen. Sovereign Cloud-Lösungen adressieren Datenschutzbedenken.", sortOrder: 4 },
  { dimension: "technological", dimensionLabel: "Technologisch", dimensionIcon: "⚙️", dimensionColor: "#00D4FF", dimensionRating: 5, dimensionSummary: "Rasante technologische Entwicklung schafft neue Möglichkeiten, aber auch Komplexität", title: "Digital Twins", impact: "positiv", description: "Digitale Zwillinge von Netzinfrastruktur ermöglichen KI-gestützte Simulation und Optimierung. Siemens, ABB und SAP bieten entsprechende Plattformen an.", sortOrder: 5 },
  { dimension: "environmental", dimensionLabel: "Ökologisch", dimensionIcon: "🌱", dimensionColor: "#06B6D4", dimensionRating: 4, dimensionSummary: "Klimaziele als primärer Treiber, aber KI-eigener Energiebedarf als wachsende Herausforderung", title: "Klimaneutralität 2045", impact: "positiv", description: "Deutschlands Ziel der Klimaneutralität bis 2045 erfordert fundamentale Transformation des Energiesystems. KI ist unverzichtbar für die Steuerung des komplexen, dezentralen Energiesystems.", sortOrder: 1 },
  { dimension: "environmental", dimensionLabel: "Ökologisch", dimensionIcon: "🌱", dimensionColor: "#06B6D4", dimensionRating: 4, dimensionSummary: "Klimaziele als primärer Treiber, aber KI-eigener Energiebedarf als wachsende Herausforderung", title: "Erneuerbare Energien Integration", impact: "positiv", description: "Volatile EE-Einspeisung (Wind, Solar) erfordert KI-gestützte Prognosen und Flexibilitätsmanagement. Ohne KI ist das Ziel von 80% EE bis 2030 kaum erreichbar.", sortOrder: 2 },
  { dimension: "environmental", dimensionLabel: "Ökologisch", dimensionIcon: "🌱", dimensionColor: "#06B6D4", dimensionRating: 4, dimensionSummary: "Klimaziele als primärer Treiber, aber KI-eigener Energiebedarf als wachsende Herausforderung", title: "KI-Energieverbrauch", impact: "negativ", description: "KI-Systeme selbst sind energieintensiv: IEA erwartet 60% höheren Energiebedarf durch KI bis 2028. Rechenzentren-Boom belastet Netze und konterkariert Klimaziele.", sortOrder: 3 },
  { dimension: "environmental", dimensionLabel: "Ökologisch", dimensionIcon: "🌱", dimensionColor: "#06B6D4", dimensionRating: 4, dimensionSummary: "Klimaziele als primärer Treiber, aber KI-eigener Energiebedarf als wachsende Herausforderung", title: "Circular Economy", impact: "positiv", description: "KI optimiert Ressourceneinsatz und Abfallvermeidung in der Energieinfrastruktur. Predictive Maintenance verlängert Lebensdauer von Anlagen und reduziert Ressourcenverbrauch.", sortOrder: 4 },
  { dimension: "environmental", dimensionLabel: "Ökologisch", dimensionIcon: "🌱", dimensionColor: "#06B6D4", dimensionRating: 4, dimensionSummary: "Klimaziele als primärer Treiber, aber KI-eigener Energiebedarf als wachsende Herausforderung", title: "EU-Taxonomie", impact: "positiv", description: "Nachhaltigkeitsberichterstattung nach EU-Taxonomie erfordert Datenanalyse-Kapazitäten. KI-gestützte ESG-Reporting-Tools sind stark nachgefragt.", sortOrder: 5 },
  { dimension: "legal", dimensionLabel: "Rechtlich", dimensionIcon: "⚖️", dimensionColor: "#8B5CF6", dimensionRating: 3, dimensionSummary: "Komplexes Regulierungsumfeld schafft Compliance-Bedarf, aber auch Rechtsunsicherheit", title: "EU AI Act – Hochrisiko-Anforderungen", impact: "gemischt", description: "KI in KRITIS-Infrastruktur gilt als Hochrisiko-System. Anforderungen: Transparenz, Dokumentation, Konformitätsbewertung, Registrierung. Erhöht Implementierungskosten, schafft aber Beratungsnachfrage.", sortOrder: 1 },
  { dimension: "legal", dimensionLabel: "Rechtlich", dimensionIcon: "⚖️", dimensionColor: "#8B5CF6", dimensionRating: 3, dimensionSummary: "Komplexes Regulierungsumfeld schafft Compliance-Bedarf, aber auch Rechtsunsicherheit", title: "IT-Sicherheitsgesetz 2.0 & NIS2", impact: "negativ", description: "Strenge Cybersecurity-Anforderungen für KRITIS-Betreiber. KI-Systeme müssen gegen Angriffe abgesichert sein. Erhöht Komplexität und Kosten der KI-Implementierung.", sortOrder: 2 },
  { dimension: "legal", dimensionLabel: "Rechtlich", dimensionIcon: "⚖️", dimensionColor: "#8B5CF6", dimensionRating: 3, dimensionSummary: "Komplexes Regulierungsumfeld schafft Compliance-Bedarf, aber auch Rechtsunsicherheit", title: "DSGVO & Datenschutz", impact: "gemischt", description: "Strenge Datenschutzanforderungen für Kundendaten (Smart Meter, Verbrauchsprofile). Erfordert Privacy-by-Design-Ansätze, die Beratungsleistungen verteuern.", sortOrder: 3 },
  { dimension: "legal", dimensionLabel: "Rechtlich", dimensionIcon: "⚖️", dimensionColor: "#8B5CF6", dimensionRating: 3, dimensionSummary: "Komplexes Regulierungsumfeld schafft Compliance-Bedarf, aber auch Rechtsunsicherheit", title: "Energierecht (EnWG)", impact: "gemischt", description: "Regulierungsrahmen der Bundesnetzagentur für Netzbetreiber schränkt Handlungsspielraum ein. Anreizregulierung (ARegV) beeinflusst Investitionsbereitschaft in KI.", sortOrder: 4 },
  { dimension: "legal", dimensionLabel: "Rechtlich", dimensionIcon: "⚖️", dimensionColor: "#8B5CF6", dimensionRating: 3, dimensionSummary: "Komplexes Regulierungsumfeld schafft Compliance-Bedarf, aber auch Rechtsunsicherheit", title: "Haftungsfragen bei KI-Entscheidungen", impact: "negativ", description: "Ungeklärte Haftungsfragen bei autonomen KI-Entscheidungen im Netzbetrieb bremsen Adoption. Rechtliche Beratung wird zum integralen Bestandteil von KI-Projekten.", sortOrder: 5 },
];

const swotData = [
  { quadrant: "strengths", title: "Starkes Technologie-Ökosystem", description: "Deutschland verfügt über ein dichtes Netz aus Forschungseinrichtungen (Fraunhofer, Helmholtz), Technologieunternehmen (Siemens, SAP, Bosch) und spezialisierten KI-Startups.", sortOrder: 1 },
  { quadrant: "strengths", title: "Hohe Datenverfügbarkeit", description: "Smart Meter Rollout, SCADA-Systeme und IoT-Sensoren generieren umfangreiche Energiedaten. Deutschland ist Vorreiter bei der Digitalisierung der Netzinfrastruktur.", sortOrder: 2 },
  { quadrant: "strengths", title: "Regulatorische Expertise", description: "Tiefes Verständnis des komplexen deutschen Energierechts (EnWG, EEG, KWKG) ist ein Wettbewerbsvorteil gegenüber internationalen Anbietern ohne lokale Expertise.", sortOrder: 3 },
  { quadrant: "strengths", title: "Etablierte Beratungsbranche", description: "Deutschland ist Heimat führender Beratungsunternehmen mit starker Energiesektorpräsenz. Der Beratungsmarkt wächst auf über 40 Mrd. EUR (2024).", sortOrder: 4 },
  { quadrant: "strengths", title: "Industrielle KI-Kompetenz", description: "Starke Tradition in Industrie 4.0 und Automatisierung schafft übertragbare KI-Kompetenz für den Energiesektor. Siemens, ABB und andere haben jahrelange Erfahrung.", sortOrder: 5 },
  { quadrant: "strengths", title: "Politischer Rückenwind", description: "Nationale KI-Strategie und Energiewende-Gesetzgebung schaffen klaren politischen Auftrag und Investitionsrahmen für KI in der Energiewirtschaft.", sortOrder: 6 },
  { quadrant: "weaknesses", title: "Fachkräftemangel", description: "Akuter Mangel an KI-Ingenieuren mit Energiesektorverständnis. Die Kombination aus Energiewirtschafts-Know-how und KI-Kompetenz ist selten und teuer.", sortOrder: 1 },
  { quadrant: "weaknesses", title: "Legacy IT-Infrastruktur", description: "Viele EVU und Stadtwerke betreiben veraltete IT-Systeme (SAP R/3, proprietäre SCADA). Integration moderner KI-Lösungen ist aufwändig und kostenintensiv.", sortOrder: 2 },
  { quadrant: "weaknesses", title: "Fragmentierter Markt", description: "Über 900 Netzbetreiber und ~1.000 Stadtwerke mit heterogenen IT-Landschaften erschweren skalierbare Standardlösungen. Hoher Individualisierungsaufwand pro Kunde.", sortOrder: 3 },
  { quadrant: "weaknesses", title: "Risikoaversion", description: "Energieversorger als KRITIS-Betreiber sind traditionell risikoavers. Neue KI-Technologien werden langsam adoptiert, besonders bei kritischen Netzbetriebsfunktionen.", sortOrder: 4 },
  { quadrant: "weaknesses", title: "Datenschutz-Komplexität", description: "Strenge DSGVO-Anforderungen und Datenschutzkultur in Deutschland erhöhen Implementierungsaufwand und -kosten für KI-Projekte mit Kundendaten.", sortOrder: 5 },
  { quadrant: "weaknesses", title: "Fehlende KI-Governance", description: "Viele Unternehmen haben noch keine KI-Governance-Strukturen etabliert. Fehlende Roadmaps, Verantwortlichkeiten und Erfolgsmessungen verzögern Projekte.", sortOrder: 6 },
  { quadrant: "opportunities", title: "Energiewende als Katalysator", description: "80% EE-Ziel bis 2030 macht KI-gestützte Netzsteuerung unverzichtbar. Jedes neue Wind- und Solarpark-Projekt schafft Bedarf nach KI-Prognose- und Optimierungstools.", sortOrder: 1 },
  { quadrant: "opportunities", title: "Smart Meter Rollout", description: "53 Millionen Smart Meter bis 2032 generieren granulare Verbrauchsdaten. Neue Geschäftsmodelle auf Basis dieser Daten erfordern umfangreiche KI-Beratung.", sortOrder: 2 },
  { quadrant: "opportunities", title: "E-Mobilität & Wärmepumpen", description: "15 Mio. E-Autos und 6 Mio. Wärmepumpen bis 2030 schaffen massive neue Lastspitzen. KI-gestütztes Demand-Response-Management wird zur Pflicht.", sortOrder: 3 },
  { quadrant: "opportunities", title: "Wasserstoffwirtschaft", description: "Aufbau einer nationalen Wasserstoffinfrastruktur erfordert KI-gestützte Planung, Betriebsoptimierung und Sicherheitsüberwachung – ein völlig neues Beratungsfeld.", sortOrder: 4 },
  { quadrant: "opportunities", title: "Stadtwerke-Konsolidierung", description: "Kooperationen zwischen Stadtwerken für gemeinsame KI-Plattformen schaffen Skalierungseffekte. Beratungsunternehmen können als Plattform-Intermediäre agieren.", sortOrder: 5 },
  { quadrant: "opportunities", title: "Generative KI für Prozessautomatisierung", description: "LLM-basierte Automatisierung von Backoffice-Prozessen (Abrechnung, Kundenservice, Compliance-Reporting) bietet schnellen ROI und niedrige Einstiegshürden.", sortOrder: 6 },
  { quadrant: "threats", title: "Internationale Tech-Giganten", description: "Google, Microsoft, Amazon und IBM dringen mit eigenen KI-Energielösungen in den Markt ein. Ihre Ressourcen und Daten-Ökosysteme sind schwer zu konkurrieren.", sortOrder: 1 },
  { quadrant: "threats", title: "Regulatorische Unsicherheit", description: "Häufige Änderungen im Energierecht und unklare KI-Regulierung (EU AI Act Umsetzung) schaffen Investitionszurückhaltung bei Kunden.", sortOrder: 2 },
  { quadrant: "threats", title: "Cybersecurity-Risiken", description: "KI-Systeme in KRITIS-Infrastruktur sind attraktive Angriffsziele. Sicherheitsvorfälle könnten das Vertrauen in KI-Lösungen nachhaltig beschädigen.", sortOrder: 3 },
  { quadrant: "threats", title: "Preisdruck durch Standardisierung", description: "Zunehmende Standardisierung von KI-Lösungen (SaaS-Modelle) drückt Margen für individuelle Beratungsleistungen. Commoditisierung bestimmter Use Cases.", sortOrder: 4 },
  { quadrant: "threats", title: "Inhouse-KI-Kompetenz", description: "Große EVU (E.ON, RWE, EnBW) bauen eigene KI-Abteilungen auf und reduzieren externe Beratungsabhängigkeit. Verlust von Schlüsselkunden an Inhouse-Teams.", sortOrder: 5 },
  { quadrant: "threats", title: "Wirtschaftliche Rezession", description: "Wirtschaftliche Abschwächung in Deutschland (2023-2024) führt zu Budgetkürzungen bei Digitalisierungsprojekten. KI-Beratung gilt oft noch als optionales Investment.", sortOrder: 6 },
];

const porterData = [
  { forceName: "Bedrohung durch neue Marktteilnehmer", level: "Mittel", score: 3, color: "#F59E0B", icon: "🚪", description: "Die Eintrittsbarrieren sind moderat. Einerseits erfordern tiefes Energiesektorwissen und regulatorische Expertise hohe Investitionen. Andererseits senken Cloud-Plattformen und Open-Source-KI-Tools die technologischen Hürden erheblich.", factors: [{ name: "Energiesektorexpertise erforderlich", impact: "hoch", direction: "barrier" }, { name: "Regulatorisches Know-how (EnWG, KRITIS)", impact: "hoch", direction: "barrier" }, { name: "Cloud-Technologie senkt Einstiegshürden", impact: "mittel", direction: "enabler" }, { name: "KI-Startups mit Nischenfokus", impact: "mittel", direction: "enabler" }, { name: "Kapitalbedarf für Zertifizierungen", impact: "mittel", direction: "barrier" }], sortOrder: 1 },
  { forceName: "Verhandlungsmacht der Lieferanten", level: "Mittel-Hoch", score: 4, color: "#EF4444", icon: "🔧", description: "KI-Talente mit Energiesektorverständnis sind extrem knapp. Technologieplattformen (Microsoft Azure, AWS, Google Cloud) haben erhebliche Marktmacht. Spezialisierte Datenprovider für Energiemarktdaten sind oligopolistisch.", factors: [{ name: "Knappheit an KI-Energieexperten", impact: "sehr hoch", direction: "barrier" }, { name: "Abhängigkeit von Cloud-Hyperscalern", impact: "hoch", direction: "barrier" }, { name: "Proprietäre Energiemarktdaten", impact: "mittel", direction: "barrier" }, { name: "Open-Source-Alternativen vorhanden", impact: "mittel", direction: "enabler" }, { name: "Wachsende Talentpipeline (Unis)", impact: "niedrig", direction: "enabler" }], sortOrder: 2 },
  { forceName: "Verhandlungsmacht der Kunden", level: "Mittel", score: 3, color: "#F59E0B", icon: "🏢", description: "Große EVU haben erhebliche Verhandlungsmacht durch Volumen und Alternativoptionen (Inhouse, internationale Anbieter). Kleine Stadtwerke haben weniger Macht, aber auch weniger Budget – was Preisverhandlungen begrenzt.", factors: [{ name: "Große EVU mit Inhouse-Alternativen", impact: "hoch", direction: "barrier" }, { name: "Hohe Wechselkosten nach Implementierung", impact: "hoch", direction: "enabler" }, { name: "Informationsasymmetrie zugunsten Berater", impact: "mittel", direction: "enabler" }, { name: "Stadtwerke-Kooperationen erhöhen Macht", impact: "mittel", direction: "barrier" }, { name: "Öffentliche Ausschreibungspflicht", impact: "mittel", direction: "barrier" }], sortOrder: 3 },
  { forceName: "Bedrohung durch Substitute", level: "Mittel", score: 3, color: "#F59E0B", icon: "🔄", description: "Traditionelle Unternehmensberatung ohne KI-Fokus verliert an Relevanz, ist aber noch ein Substitut. Standardsoftware (SAP IS-U, Oracle Utilities) mit integrierten KI-Modulen substituiert Teile der Beratungsleistung.", factors: [{ name: "SAP/Oracle KI-Module als Substitute", impact: "hoch", direction: "barrier" }, { name: "Traditionelle Beratung ohne KI", impact: "mittel", direction: "barrier" }, { name: "Inhouse-Entwicklung durch EVU", impact: "mittel", direction: "barrier" }, { name: "Einzigartigkeit maßgeschneiderter KI", impact: "hoch", direction: "enabler" }, { name: "Komplexität verhindert vollständige Substitution", impact: "mittel", direction: "enabler" }], sortOrder: 4 },
  { forceName: "Wettbewerbsintensität", level: "Hoch", score: 5, color: "#EF4444", icon: "⚔️", description: "Der Markt ist intensiv umkämpft: Internationale Großberatungen (Accenture, McKinsey, BCG), IT-Dienstleister (IBM, Capgemini, SAP), spezialisierte Energieberater und aufstrebende KI-Startups konkurrieren um dieselben Kunden.", factors: [{ name: "Accenture, McKinsey, BCG als Hauptkonkurrenten", impact: "sehr hoch", direction: "barrier" }, { name: "IBM, Capgemini, SAP IT-Dienstleistungen", impact: "hoch", direction: "barrier" }, { name: "Spezialisierte Energie-KI-Startups", impact: "mittel", direction: "barrier" }, { name: "Differenzierung durch Branchenexpertise möglich", impact: "hoch", direction: "enabler" }, { name: "Wachsender Markt reduziert Verdrängungswettbewerb", impact: "mittel", direction: "enabler" }], sortOrder: 5 },
];

const competitorsData = [
  { name: "Accenture", type: "Großberatung", focus: "End-to-End KI", strength: 95, color: "#A855F7", sortOrder: 1 },
  { name: "McKinsey/QuantumBlack", type: "Strategieberatung", focus: "KI-Strategie", strength: 88, color: "#6366F1", sortOrder: 2 },
  { name: "IBM", type: "IT-Dienstleister", focus: "Watson Energy", strength: 82, color: "#0EA5E9", sortOrder: 3 },
  { name: "Capgemini Invent", type: "IT-Beratung", focus: "Digital Energy", strength: 78, color: "#10B981", sortOrder: 4 },
  { name: "Siemens Energy", type: "Technologieanbieter", focus: "Grid KI", strength: 85, color: "#F59E0B", sortOrder: 5 },
  { name: "SAP", type: "Softwareanbieter", focus: "IS-U KI-Module", strength: 75, color: "#EF4444", sortOrder: 6 },
  { name: "Envelio", type: "Startup", focus: "Netzplanung KI", strength: 60, color: "#00D4FF", sortOrder: 7 },
  { name: "gridX", type: "Startup", focus: "Energiemanagement", strength: 55, color: "#06B6D4", sortOrder: 8 },
];

const recommendationsData = [
  { priority: "Hoch", timeframe: "0-12 Monate", title: "Quick-Win Use Cases fokussieren", description: "Generative KI für Kundenservice und Prozessautomatisierung bieten schnellen ROI und niedrige Implementierungsrisiken. Ideal als Einstieg für Stadtwerke und mittlere EVU.", color: "#10B981", icon: "🎯", sortOrder: 1 },
  { priority: "Hoch", timeframe: "6-18 Monate", title: "Regulatorische Expertise aufbauen", description: "EU AI Act Compliance und KRITIS-Anforderungen werden zum Pflichtbestandteil jedes KI-Projekts. Frühzeitige Positionierung als Compliance-Partner schafft Wettbewerbsvorteil.", color: "#00D4FF", icon: "⚖️", sortOrder: 2 },
  { priority: "Mittel", timeframe: "12-24 Monate", title: "Stadtwerke-Kooperationsmodelle entwickeln", description: "Shared-KI-Plattformen für Stadtwerke-Verbünde ermöglichen Skalierung trotz kleiner Einzelbudgets. Genossenschaftliche Modelle oder Konsortien als Zielstruktur.", color: "#F59E0B", icon: "🤝", sortOrder: 3 },
  { priority: "Mittel", timeframe: "18-36 Monate", title: "Netzplanung & Smart Grid als Kernkompetenz", description: "Der Netzausbau (600 Mrd. EUR bis 2045) ist das größte Einzelsegment. KI-gestützte Netzplanung, digitale Zwillinge und Predictive Maintenance bieten nachhaltiges Wachstum.", color: "#8B5CF6", icon: "🔌", sortOrder: 4 },
];

// ─── Seed ausführen ───────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Starte Datenbank-Seed...");
  try {
    await db.delete(strategicRecommendations);
    await db.delete(competitors);
    await db.delete(porterForces);
    await db.delete(swotItems);
    await db.delete(pestelFactors);
    await db.delete(useCases);
    await db.delete(marketGrowth);
    await db.delete(marketStats);
    console.log("✅ Tabellen geleert");

    await db.insert(marketStats).values(marketStatsData);
    console.log(`✅ ${marketStatsData.length} Marktstatistiken gespeichert`);

    await db.insert(marketGrowth).values(marketGrowthData);
    console.log(`✅ ${marketGrowthData.length} Marktentwicklungspunkte gespeichert`);

    await db.insert(useCases).values(useCasesData);
    console.log(`✅ ${useCasesData.length} Use Cases gespeichert`);

    await db.insert(pestelFactors).values(pestelData);
    console.log(`✅ ${pestelData.length} PESTEL-Faktoren gespeichert`);

    await db.insert(swotItems).values(swotData);
    console.log(`✅ ${swotData.length} SWOT-Einträge gespeichert`);

    await db.insert(porterForces).values(porterData);
    console.log(`✅ ${porterData.length} Porter-Kräfte gespeichert`);

    await db.insert(competitors).values(competitorsData);
    console.log(`✅ ${competitorsData.length} Wettbewerber gespeichert`);

    await db.insert(strategicRecommendations).values(recommendationsData);
    console.log(`✅ ${recommendationsData.length} Strategische Empfehlungen gespeichert`);

    console.log("\n🎉 Seed erfolgreich abgeschlossen!");
  } catch (err) {
    console.error("❌ Seed-Fehler:", err);
    throw err;
  } finally {
    await pool.end();
  }
}

seed();
