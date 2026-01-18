# Pädagogischer Warenkorb

Ein Browser-Tool (Bookmarklet/Sidebar) für die strukturierte Unterrichtsplanung mit Inhalten von [WirLernenOnline](https://www.wirlernenonline.de).

## Features

- **Ablaufmuster wählen**: Frontalunterricht, Problemorientiertes Lernen, Stationenlernen, etc.
- **Phasen-Platzhalter**: Für jede Unterrichtsphase ein Bereich zum Befüllen
- **Drag & Drop**: Inhalte von WLO direkt in Phasen ziehen
- **Automatische Suche**: WLO-API Integration für Inhaltsvorschläge
- **Binnendifferenzierung**: Anpassungen für verschiedene Lernbedarfe
- **PDF-Export**: Unterrichtsentwurf als druckbares PDF

## Installation

### Bookmarklet
Ziehe den folgenden Link in deine Lesezeichen-Leiste:

```
[Pädagogischer Warenkorb] (siehe bookmarklet.js)
```

### Lokale Entwicklung
```bash
# Statischen Server starten
npx serve .
```

## Nutzung

1. Öffne https://suche.wirlernenonline.de
2. Klicke auf das Bookmarklet
3. Wähle ein Ablaufmuster
4. Suche Inhalte und ziehe sie in die Phasen
5. Exportiere als PDF

## Projektstruktur

```
warenkorb/
├── index.html          # Standalone-Version zum Testen
├── sidebar.js          # Haupt-Sidebar-Logik
├── sidebar.css         # Styling
├── patterns.js         # Ablaufmuster-Definitionen
├── wlo-api.js          # WLO API Integration
├── pdf-export.js       # PDF-Generierung
├── bookmarklet.js      # Bookmarklet-Code
└── README.md
```

## Konzept-Erweiterungen

- **KI-Unterstützung**: Automatische Phasen-Zuordnung basierend auf Lernzielen
- **Kollaboration**: Gemeinsames Planen im Team
- **Vorlagen-Bibliothek**: Fertige Unterrichtsentwürfe teilen
- **Lernpfad-Export**: Integration mit Lernpfad-Editoren
- **Kompetenz-Mapping**: Zuordnung zu Bildungsstandards
