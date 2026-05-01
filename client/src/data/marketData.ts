// KI-Beratungsmarkt Energiewirtschaft Deutschland – Marktdaten 2025
// Quellen: Grand View Research, Fraunhofer IPK, EY, Bundesnetzagentur, BDEW

export const marketStats = [
  { label: "Marktgröße 2025", value: "252,8 Mio. USD", sub: "KI in Energie, Deutschland", color: "#00D4FF" },
  { label: "Prognose 2033", value: "1,1 Mrd. USD", sub: "CAGR 20,6% p.a.", color: "#10B981" },
  { label: "Kostensenkung", value: "bis 56%", sub: "Stadtwerke bis 2035 (Fraunhofer IPK)", color: "#F59E0B" },
  { label: "Marktteilnehmer", value: "~1.900+", sub: "EVU, Stadtwerke, Netzbetreiber", color: "#8B5CF6" },
];

export const marketGrowthData = [
  { year: "2021", value: 85 },
  { year: "2022", value: 112 },
  { year: "2023", value: 148 },
  { year: "2024", value: 198 },
  { year: "2025", value: 253 },
  { year: "2026", value: 325 },
  { year: "2027", value: 415 },
  { year: "2028", value: 530 },
  { year: "2029", value: 665 },
  { year: "2030", value: 820 },
  { year: "2031", value: 920 },
  { year: "2032", value: 1020 },
  { year: "2033", value: 1106 },
];

export const useCaseData = [
  { name: "Netzplanung & Smart Grid", value: 28, color: "#00D4FF" },
  { name: "Predictive Maintenance", value: 22, color: "#10B981" },
  { name: "Lastprognose & Handel", value: 18, color: "#F59E0B" },
  { name: "Kundenservice & CRM", value: 15, color: "#8B5CF6" },
  { name: "Erneuerbare Integration", value: 12, color: "#06B6D4" },
  { name: "Prozessautomatisierung", value: 5, color: "#6366F1" },
];

export const pestelData = {
  political: {
    label: "Politisch",
    icon: "🏛️",
    color: "#EF4444",
    rating: 4,
    summary: "Starker politischer Rückenwind durch Energiewende-Ziele und nationale KI-Strategie",
    factors: [
      {
        title: "Nationale KI-Strategie 2020",
        impact: "positiv",
        description: "Die Bundesregierung hat Deutschland und Europa als führenden KI-Standort positioniert. Investitionsziel von 5 Mrd. EUR bis 2025 schafft Nachfrage nach KI-Beratungsleistungen.",
      },
      {
        title: "Energiewende-Gesetzgebung",
        impact: "positiv",
        description: "Ziel: 80% Erneuerbare Energien bis 2030. Dieser Transformationsdruck zwingt EVU und Netzbetreiber zur KI-gestützten Flexibilitätssteuerung und Netzoptimierung.",
      },
      {
        title: "EU AI Act (2024)",
        impact: "gemischt",
        description: "Hochrisiko-Klassifizierung für KI in kritischer Infrastruktur (KRITIS) erhöht Compliance-Aufwand, schafft aber gleichzeitig Beratungsbedarf für Implementierung und Zertifizierung.",
      },
      {
        title: "KI-Aufsichtsgesetz (KI-MIG, Feb. 2026)",
        impact: "gemischt",
        description: "Nationale Umsetzung der EU-KI-Verordnung mit schlanker Aufsichtsstruktur. Energiesektor als KRITIS unterliegt erhöhter Regulierungsintensität.",
      },
      {
        title: "Digitalisierungsgesetz Energiewende (DigiG)",
        impact: "positiv",
        description: "Gesetzlicher Rahmen für die Digitalisierung der Energieinfrastruktur. Smart Meter Rollout (53 Mio. Zähler bis 2032) generiert massive Datenmengen als KI-Grundlage.",
      },
    ],
  },
  economic: {
    label: "Wirtschaftlich",
    icon: "📈",
    color: "#10B981",
    rating: 5,
    summary: "Enormes Marktpotenzial durch Kostendruck, Energiepreisvolatilität und Digitalisierungsinvestitionen",
    factors: [
      {
        title: "Marktgröße & Wachstum",
        impact: "positiv",
        description: "KI in Energie Deutschland: USD 252,8 Mio. (2025) → USD 1.106,2 Mio. (2033), CAGR 20,6%. Der globale KI-Beratungsmarkt wächst auf über USD 100 Mrd. bis 2030.",
      },
      {
        title: "Kostensenkungspotenzial",
        impact: "positiv",
        description: "Fraunhofer IPK-Studie (2025): Stadtwerke können bis 2035 Betriebskosten um bis zu 56% senken. ROI-Argument ist überzeugend für Investitionsentscheidungen.",
      },
      {
        title: "Energiepreisvolatilität",
        impact: "positiv",
        description: "Hohe Energiepreisschwankungen seit 2021/22 erhöhen Nachfrage nach KI-gestützten Prognose- und Optimierungstools. Jede Verbesserung der Prognosegenauigkeit hat direkten wirtschaftlichen Wert.",
      },
      {
        title: "Investitionsbudgets EVU",
        impact: "gemischt",
        description: "Große EVU (E.ON, RWE, EnBW) investieren Milliarden in Digitalisierung. Stadtwerke haben begrenztere Budgets, suchen aber nach skalierbaren SaaS-Lösungen.",
      },
      {
        title: "Netzausbau-Investitionen",
        impact: "positiv",
        description: "Bundesnetzagentur: 600 Mrd. EUR Netzinvestitionen bis 2045. Jedes Netzausbauprojekt erfordert KI-gestützte Planung, Simulation und Betriebsoptimierung.",
      },
    ],
  },
  social: {
    label: "Sozial",
    icon: "👥",
    color: "#F59E0B",
    rating: 3,
    summary: "Fachkräftemangel als Treiber, aber Akzeptanzprobleme und Datenschutzbedenken als Bremse",
    factors: [
      {
        title: "Fachkräftemangel",
        impact: "positiv",
        description: "Akuter Mangel an Ingenieuren, Netztechnikern und IT-Spezialisten in der Energiebranche. KI wird zunehmend als Lösung zur Kompensation des Personalmangels betrachtet.",
      },
      {
        title: "Demografischer Wandel",
        impact: "positiv",
        description: "Wissenstransfer von erfahrenen Mitarbeitern in KI-Systeme wird zur strategischen Priorität. Viele Experten gehen in den nächsten 10 Jahren in Rente.",
      },
      {
        title: "Akzeptanz & Change Management",
        impact: "negativ",
        description: "Mitarbeiter und Betriebsräte stehen KI-Systemen skeptisch gegenüber. Umfangreiche Change-Management-Beratung ist notwendig, erhöht aber auch den Beratungsbedarf.",
      },
      {
        title: "Datenschutzbewusstsein",
        impact: "gemischt",
        description: "Hohes Datenschutzbewusstsein in Deutschland (DSGVO-Kultur) erhöht Compliance-Anforderungen, schafft aber Nachfrage nach datenschutzkonformen KI-Lösungen.",
      },
      {
        title: "Nachhaltigkeitsdruck",
        impact: "positiv",
        description: "Gesellschaftlicher Druck zur Dekarbonisierung treibt Investitionen in KI-gestützte Energieeffizienz und Erneuerbare-Energien-Integration.",
      },
    ],
  },
  technological: {
    label: "Technologisch",
    icon: "⚙️",
    color: "#00D4FF",
    rating: 5,
    summary: "Rasante technologische Entwicklung schafft neue Möglichkeiten, aber auch Komplexität",
    factors: [
      {
        title: "Generative KI & LLMs",
        impact: "positiv",
        description: "GPT-4-Klasse-Modelle ermöglichen neue Anwendungen: automatisierte Berichterstellung, Kundenservice-Bots, Code-Generierung für Energiemanagementsysteme. Deutsche Telekom bietet Enterprise-GPT für Stadtwerke.",
      },
      {
        title: "Edge Computing & IoT",
        impact: "positiv",
        description: "Millionen Smart Meter, Sensoren und dezentrale Erzeuger generieren Echtzeit-Daten. Edge-KI ermöglicht lokale Verarbeitung ohne Latenz – kritisch für Netzsteuerung.",
      },
      {
        title: "Legacy IT-Systeme",
        impact: "negativ",
        description: "Viele EVU betreiben SCADA- und ERP-Systeme aus den 1990er-2000er Jahren. Integration moderner KI-Lösungen in Legacy-Infrastruktur ist komplex und kostenintensiv.",
      },
      {
        title: "Cloud-Infrastruktur",
        impact: "positiv",
        description: "Wachsende Cloud-Akzeptanz (AWS, Azure, Google Cloud) in der Energiebranche senkt Einstiegshürden für KI-Implementierungen. Sovereign Cloud-Lösungen adressieren Datenschutzbedenken.",
      },
      {
        title: "Digital Twins",
        impact: "positiv",
        description: "Digitale Zwillinge von Netzinfrastruktur ermöglichen KI-gestützte Simulation und Optimierung. Siemens, ABB und SAP bieten entsprechende Plattformen an.",
      },
    ],
  },
  environmental: {
    label: "Ökologisch",
    icon: "🌱",
    color: "#06B6D4",
    rating: 4,
    summary: "Klimaziele als primärer Treiber, aber KI-eigener Energiebedarf als wachsende Herausforderung",
    factors: [
      {
        title: "Klimaneutralität 2045",
        impact: "positiv",
        description: "Deutschlands Ziel der Klimaneutralität bis 2045 erfordert fundamentale Transformation des Energiesystems. KI ist unverzichtbar für die Steuerung des komplexen, dezentralen Energiesystems.",
      },
      {
        title: "Erneuerbare Energien Integration",
        impact: "positiv",
        description: "Volatile EE-Einspeisung (Wind, Solar) erfordert KI-gestützte Prognosen und Flexibilitätsmanagement. Ohne KI ist das Ziel von 80% EE bis 2030 kaum erreichbar.",
      },
      {
        title: "KI-Energieverbrauch",
        impact: "negativ",
        description: "KI-Systeme selbst sind energieintensiv: IEA erwartet 60% höheren Energiebedarf durch KI bis 2028. Rechenzentren-Boom belastet Netze und konterkariert Klimaziele.",
      },
      {
        title: "Circular Economy",
        impact: "positiv",
        description: "KI optimiert Ressourceneinsatz und Abfallvermeidung in der Energieinfrastruktur. Predictive Maintenance verlängert Lebensdauer von Anlagen und reduziert Ressourcenverbrauch.",
      },
      {
        title: "EU-Taxonomie",
        impact: "positiv",
        description: "Nachhaltigkeitsberichterstattung nach EU-Taxonomie erfordert Datenanalyse-Kapazitäten. KI-gestützte ESG-Reporting-Tools sind stark nachgefragt.",
      },
    ],
  },
  legal: {
    label: "Rechtlich",
    icon: "⚖️",
    color: "#8B5CF6",
    rating: 3,
    summary: "Komplexes Regulierungsumfeld schafft Compliance-Bedarf, aber auch Rechtsunsicherheit",
    factors: [
      {
        title: "EU AI Act – Hochrisiko-Anforderungen",
        impact: "gemischt",
        description: "KI in KRITIS-Infrastruktur gilt als Hochrisiko-System. Anforderungen: Transparenz, Dokumentation, Konformitätsbewertung, Registrierung. Erhöht Implementierungskosten, schafft aber Beratungsnachfrage.",
      },
      {
        title: "IT-Sicherheitsgesetz 2.0 & NIS2",
        impact: "negativ",
        description: "Strenge Cybersecurity-Anforderungen für KRITIS-Betreiber. KI-Systeme müssen gegen Angriffe abgesichert sein. Erhöht Komplexität und Kosten der KI-Implementierung.",
      },
      {
        title: "DSGVO & Datenschutz",
        impact: "gemischt",
        description: "Strenge Datenschutzanforderungen für Kundendaten (Smart Meter, Verbrauchsprofile). Erfordert Privacy-by-Design-Ansätze, die Beratungsleistungen verteuern.",
      },
      {
        title: "Energierecht (EnWG)",
        impact: "gemischt",
        description: "Regulierungsrahmen der Bundesnetzagentur für Netzbetreiber schränkt Handlungsspielraum ein. Anreizregulierung (ARegV) beeinflusst Investitionsbereitschaft in KI.",
      },
      {
        title: "Haftungsfragen bei KI-Entscheidungen",
        impact: "negativ",
        description: "Ungeklärte Haftungsfragen bei autonomen KI-Entscheidungen im Netzbetrieb bremsen Adoption. Rechtliche Beratung wird zum integralen Bestandteil von KI-Projekten.",
      },
    ],
  },
};

export const swotData = {
  strengths: [
    {
      title: "Starkes Technologie-Ökosystem",
      description: "Deutschland verfügt über ein dichtes Netz aus Forschungseinrichtungen (Fraunhofer, Helmholtz), Technologieunternehmen (Siemens, SAP, Bosch) und spezialisierten KI-Startups.",
    },
    {
      title: "Hohe Datenverfügbarkeit",
      description: "Smart Meter Rollout, SCADA-Systeme und IoT-Sensoren generieren umfangreiche Energiedaten. Deutschland ist Vorreiter bei der Digitalisierung der Netzinfrastruktur.",
    },
    {
      title: "Regulatorische Expertise",
      description: "Tiefes Verständnis des komplexen deutschen Energierechts (EnWG, EEG, KWKG) ist ein Wettbewerbsvorteil gegenüber internationalen Anbietern ohne lokale Expertise.",
    },
    {
      title: "Etablierte Beratungsbranche",
      description: "Deutschland ist Heimat führender Beratungsunternehmen mit starker Energiesektorpräsenz. Der Beratungsmarkt wächst auf über 40 Mrd. EUR (2024).",
    },
    {
      title: "Industrielle KI-Kompetenz",
      description: "Starke Tradition in Industrie 4.0 und Automatisierung schafft übertragbare KI-Kompetenz für den Energiesektor. Siemens, ABB und andere haben jahrelange Erfahrung.",
    },
    {
      title: "Politischer Rückenwind",
      description: "Nationale KI-Strategie und Energiewende-Gesetzgebung schaffen klaren politischen Auftrag und Investitionsrahmen für KI in der Energiewirtschaft.",
    },
  ],
  weaknesses: [
    {
      title: "Fachkräftemangel",
      description: "Akuter Mangel an KI-Ingenieuren mit Energiesektorverständnis. Die Kombination aus Energiewirtschafts-Know-how und KI-Kompetenz ist selten und teuer.",
    },
    {
      title: "Legacy IT-Infrastruktur",
      description: "Viele EVU und Stadtwerke betreiben veraltete IT-Systeme (SAP R/3, proprietäre SCADA). Integration moderner KI-Lösungen ist aufwändig und kostenintensiv.",
    },
    {
      title: "Fragmentierter Markt",
      description: "Über 900 Netzbetreiber und ~1.000 Stadtwerke mit heterogenen IT-Landschaften erschweren skalierbare Standardlösungen. Hoher Individualisierungsaufwand pro Kunde.",
    },
    {
      title: "Risikoaversion",
      description: "Energieversorger als KRITIS-Betreiber sind traditionell risikoavers. Neue KI-Technologien werden langsam adoptiert, besonders bei kritischen Netzbetriebsfunktionen.",
    },
    {
      title: "Datenschutz-Komplexität",
      description: "Strenge DSGVO-Anforderungen und Datenschutzkultur in Deutschland erhöhen Implementierungsaufwand und -kosten für KI-Projekte mit Kundendaten.",
    },
    {
      title: "Fehlende KI-Governance",
      description: "Viele Unternehmen haben noch keine KI-Governance-Strukturen etabliert. Fehlende Roadmaps, Verantwortlichkeiten und Erfolgsmessungen verzögern Projekte.",
    },
  ],
  opportunities: [
    {
      title: "Energiewende als Katalysator",
      description: "80% EE-Ziel bis 2030 macht KI-gestützte Netzsteuerung unverzichtbar. Jedes neue Wind- und Solarpark-Projekt schafft Bedarf nach KI-Prognose- und Optimierungstools.",
    },
    {
      title: "Smart Meter Rollout",
      description: "53 Millionen Smart Meter bis 2032 generieren granulare Verbrauchsdaten. Neue Geschäftsmodelle auf Basis dieser Daten erfordern umfangreiche KI-Beratung.",
    },
    {
      title: "E-Mobilität & Wärmepumpen",
      description: "15 Mio. E-Autos und 6 Mio. Wärmepumpen bis 2030 schaffen massive neue Lastspitzen. KI-gestütztes Demand-Response-Management wird zur Pflicht.",
    },
    {
      title: "Wasserstoffwirtschaft",
      description: "Aufbau einer nationalen Wasserstoffinfrastruktur erfordert KI-gestützte Planung, Betriebsoptimierung und Sicherheitsüberwachung – ein völlig neues Beratungsfeld.",
    },
    {
      title: "Stadtwerke-Konsolidierung",
      description: "Kooperationen zwischen Stadtwerken für gemeinsame KI-Plattformen schaffen Skalierungseffekte. Beratungsunternehmen können als Plattform-Intermediäre agieren.",
    },
    {
      title: "Generative KI für Prozessautomatisierung",
      description: "LLM-basierte Automatisierung von Backoffice-Prozessen (Abrechnung, Kundenservice, Compliance-Reporting) bietet schnellen ROI und niedrige Einstiegshürden.",
    },
  ],
  threats: [
    {
      title: "Internationale Tech-Giganten",
      description: "Google, Microsoft, Amazon und IBM dringen mit eigenen KI-Energielösungen in den Markt ein. Ihre Ressourcen und Daten-Ökosysteme sind schwer zu konkurrieren.",
    },
    {
      title: "Regulatorische Unsicherheit",
      description: "Häufige Änderungen im Energierecht und unklare KI-Regulierung (EU AI Act Umsetzung) schaffen Investitionszurückhaltung bei Kunden.",
    },
    {
      title: "Cybersecurity-Risiken",
      description: "KI-Systeme in KRITIS-Infrastruktur sind attraktive Angriffsziele. Sicherheitsvorfälle könnten das Vertrauen in KI-Lösungen nachhaltig beschädigen.",
    },
    {
      title: "Preisdruck durch Standardisierung",
      description: "Zunehmende Standardisierung von KI-Lösungen (SaaS-Modelle) drückt Margen für individuelle Beratungsleistungen. Commoditisierung bestimmter Use Cases.",
    },
    {
      title: "Inhouse-KI-Kompetenz",
      description: "Große EVU (E.ON, RWE, EnBW) bauen eigene KI-Abteilungen auf und reduzieren externe Beratungsabhängigkeit. Verlust von Schlüsselkunden an Inhouse-Teams.",
    },
    {
      title: "Wirtschaftliche Rezession",
      description: "Wirtschaftliche Abschwächung in Deutschland (2023-2024) führt zu Budgetkürzungen bei Digitalisierungsprojekten. KI-Beratung gilt oft noch als optionales Investment.",
    },
  ],
};

export const porterData = [
  {
    force: "Bedrohung durch neue Marktteilnehmer",
    level: "Mittel",
    score: 3,
    color: "#F59E0B",
    icon: "🚪",
    description: "Die Eintrittsbarrieren sind moderat. Einerseits erfordern tiefes Energiesektorwissen und regulatorische Expertise hohe Investitionen. Andererseits senken Cloud-Plattformen und Open-Source-KI-Tools die technologischen Hürden erheblich.",
    factors: [
      { name: "Energiesektorexpertise erforderlich", impact: "hoch", direction: "barrier" },
      { name: "Regulatorisches Know-how (EnWG, KRITIS)", impact: "hoch", direction: "barrier" },
      { name: "Cloud-Technologie senkt Einstiegshürden", impact: "mittel", direction: "enabler" },
      { name: "KI-Startups mit Nischenfokus", impact: "mittel", direction: "enabler" },
      { name: "Kapitalbedarf für Zertifizierungen", impact: "mittel", direction: "barrier" },
    ],
  },
  {
    force: "Verhandlungsmacht der Lieferanten",
    level: "Mittel-Hoch",
    score: 4,
    color: "#EF4444",
    icon: "🔧",
    description: "KI-Talente mit Energiesektorverständnis sind extrem knapp. Technologieplattformen (Microsoft Azure, AWS, Google Cloud) haben erhebliche Marktmacht. Spezialisierte Datenprovider für Energiemarktdaten sind oligopolistisch.",
    factors: [
      { name: "Knappheit an KI-Energieexperten", impact: "sehr hoch", direction: "barrier" },
      { name: "Abhängigkeit von Cloud-Hyperscalern", impact: "hoch", direction: "barrier" },
      { name: "Proprietäre Energiemarktdaten", impact: "mittel", direction: "barrier" },
      { name: "Open-Source-Alternativen vorhanden", impact: "mittel", direction: "enabler" },
      { name: "Wachsende Talentpipeline (Unis)", impact: "niedrig", direction: "enabler" },
    ],
  },
  {
    force: "Verhandlungsmacht der Kunden",
    level: "Mittel",
    score: 3,
    color: "#F59E0B",
    icon: "🏢",
    description: "Große EVU haben erhebliche Verhandlungsmacht durch Volumen und Alternativoptionen (Inhouse, internationale Anbieter). Kleine Stadtwerke haben weniger Macht, aber auch weniger Budget – was Preisverhandlungen begrenzt.",
    factors: [
      { name: "Große EVU mit Inhouse-Alternativen", impact: "hoch", direction: "barrier" },
      { name: "Hohe Wechselkosten nach Implementierung", impact: "hoch", direction: "enabler" },
      { name: "Informationsasymmetrie zugunsten Berater", impact: "mittel", direction: "enabler" },
      { name: "Stadtwerke-Kooperationen erhöhen Macht", impact: "mittel", direction: "barrier" },
      { name: "Öffentliche Ausschreibungspflicht", impact: "mittel", direction: "barrier" },
    ],
  },
  {
    force: "Bedrohung durch Substitute",
    level: "Mittel",
    score: 3,
    color: "#F59E0B",
    icon: "🔄",
    description: "Traditionelle Unternehmensberatung ohne KI-Fokus verliert an Relevanz, ist aber noch ein Substitut. Standardsoftware (SAP IS-U, Oracle Utilities) mit integrierten KI-Modulen substituiert Teile der Beratungsleistung.",
    factors: [
      { name: "SAP/Oracle KI-Module als Substitute", impact: "hoch", direction: "barrier" },
      { name: "Traditionelle Beratung ohne KI", impact: "mittel", direction: "barrier" },
      { name: "Inhouse-Entwicklung durch EVU", impact: "mittel", direction: "barrier" },
      { name: "Einzigartigkeit maßgeschneiderter KI", impact: "hoch", direction: "enabler" },
      { name: "Komplexität verhindert vollständige Substitution", impact: "mittel", direction: "enabler" },
    ],
  },
  {
    force: "Wettbewerbsintensität",
    level: "Hoch",
    score: 5,
    color: "#EF4444",
    icon: "⚔️",
    description: "Der Markt ist intensiv umkämpft: Internationale Großberatungen (Accenture, McKinsey, BCG), IT-Dienstleister (IBM, Capgemini, SAP), spezialisierte Energieberater und aufstrebende KI-Startups konkurrieren um dieselben Kunden.",
    factors: [
      { name: "Accenture, McKinsey, BCG als Hauptkonkurrenten", impact: "sehr hoch", direction: "barrier" },
      { name: "IBM, Capgemini, SAP IT-Dienstleistungen", impact: "hoch", direction: "barrier" },
      { name: "Spezialisierte Energie-KI-Startups", impact: "mittel", direction: "barrier" },
      { name: "Differenzierung durch Branchenexpertise möglich", impact: "hoch", direction: "enabler" },
      { name: "Wachsender Markt reduziert Verdrängungswettbewerb", impact: "mittel", direction: "enabler" },
    ],
  },
];

export const competitorData = [
  { name: "Accenture", type: "Großberatung", focus: "End-to-End KI", strength: 95, color: "#A855F7" },
  { name: "McKinsey/QuantumBlack", type: "Strategieberatung", focus: "KI-Strategie", strength: 88, color: "#6366F1" },
  { name: "IBM", type: "IT-Dienstleister", focus: "Watson Energy", strength: 82, color: "#0EA5E9" },
  { name: "Capgemini Invent", type: "IT-Beratung", focus: "Digital Energy", strength: 78, color: "#10B981" },
  { name: "Siemens Energy", type: "Technologieanbieter", focus: "Grid KI", strength: 85, color: "#F59E0B" },
  { name: "SAP", type: "Softwareanbieter", focus: "IS-U KI-Module", strength: 75, color: "#EF4444" },
  { name: "Envelio", type: "Startup", focus: "Netzplanung KI", strength: 60, color: "#00D4FF" },
  { name: "gridX", type: "Startup", focus: "Energiemanagement", strength: 55, color: "#06B6D4" },
];

export const radarData = [
  { subject: "Marktgröße", A: 85, fullMark: 100 },
  { subject: "Wachstum", A: 95, fullMark: 100 },
  { subject: "Profitabilität", A: 70, fullMark: 100 },
  { subject: "Wettbewerb", A: 60, fullMark: 100 },
  { subject: "Eintrittsbarrieren", A: 65, fullMark: 100 },
  { subject: "Regulierung", A: 55, fullMark: 100 },
];

export const strategicRecommendations = [
  {
    priority: "Hoch",
    timeframe: "0-12 Monate",
    title: "Quick-Win Use Cases fokussieren",
    description: "Generative KI für Kundenservice und Prozessautomatisierung bieten schnellen ROI und niedrige Implementierungsrisiken. Ideal als Einstieg für Stadtwerke und mittlere EVU.",
    color: "#10B981",
    icon: "🎯",
  },
  {
    priority: "Hoch",
    timeframe: "6-18 Monate",
    title: "Regulatorische Expertise aufbauen",
    description: "EU AI Act Compliance und KRITIS-Anforderungen werden zum Pflichtbestandteil jedes KI-Projekts. Frühzeitige Positionierung als Compliance-Partner schafft Wettbewerbsvorteil.",
    color: "#00D4FF",
    icon: "⚖️",
  },
  {
    priority: "Mittel",
    timeframe: "12-24 Monate",
    title: "Stadtwerke-Kooperationsmodelle entwickeln",
    description: "Shared-KI-Plattformen für Stadtwerke-Verbünde ermöglichen Skalierung trotz kleiner Einzelbudgets. Genossenschaftliche Modelle oder Konsortien als Zielstruktur.",
    color: "#F59E0B",
    icon: "🤝",
  },
  {
    priority: "Mittel",
    timeframe: "18-36 Monate",
    title: "Netzplanung & Smart Grid als Kernkompetenz",
    description: "Der Netzausbau (600 Mrd. EUR bis 2045) ist das größte Einzelsegment. KI-gestützte Netzplanung, digitale Zwillinge und Predictive Maintenance bieten nachhaltiges Wachstum.",
    color: "#8B5CF6",
    icon: "🔌",
  },
];
