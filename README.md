# ICG Projekt von Gruppe 01
<!-- Ein Bild der Anwendung muss im Ordner ./img relativ zu dieser Datei liegen -->

<img src="img/projektPic.jpg" width="75%">

Dieses Repository beinhaltet das Projekt des Kurses  "Interaktive Computergraphik" von < Katrin Stötter, Lias Rieder und Lina Seyfried >. 

# Projekt Struktur
<!-- Ihr könnt die Projektstruktur beliebig beschreiben. Hier einfach mit dem Unix Programm `tree`  -->

```
.
├── README.md
├── dist
│   ├── index.html
│   ├── src
│   └── textures <-- Texturen
├── ...
├── img <-- Dokumentation
│   └── screenshot.png
├── obj <-- OBJ Dateien
├── src
│   ├───AlteBoilerPlatesUebungen
│   ├───Camera
│   ├───Geometry
│   │   ├───RasterGeometry
│   │   └───RayGeometry
│   ├───mathOperations
│   ├───Nodes
│   ├───RayTracing
│   ├───Shaders
│   ├───Visitors
│   ├───glsl.d.ts
│   ├───index.ts
│   └───scenegraph.ts 
├── test 
├── tests
└── ...

```

Das Projekt ist in mehreren Ordner thematisch aufgeteilt. 
`dist` beinhaltet Ressourcen die im Browser direkt verwendet werden.
Unter `src` sind alle Quelldateien zusammengefasst, welche durch `webgl` transpiliert werden.
Hierbei haben wir die Pakete entsprechend ihren Funktionen strukturiert:
- `AlteBoilerPlatesUebungen` enthält die Boilerplates der verangegangenen Übungen
- `Camera` enthält die verwendeten Kameras
- `Geometry` enthält die Grometrie_Objekte aufgeteilt in `RasterGeometry` und `RayGeometry`
- `mathOperations` enthält die verwendeten mathematischen Operationen
- `Nodes` enthält die verwendeten Nodes
- `RayTracing` enthält die für das Raytracing relevante Klassen
- `Shaders` enthält die verwendeten Shader
- `Visitor` enthält die verwendeten Visitor
- `scenegraph` enthält den Szenengraph

# Installation

Wechseln Sie mit einer Konsole in das Verzeichnis dieser Datei und füren Sie 

```
npm install
```
aus.
### Ausführung
Geben Sie anschließend 
```bash
npm start
```
eingeben und rufen die Website des Servers über to `0.0.0.0:<port>` bzw. `localhost:<port>` im Browser aufrufen. Der Port ist hierbei aus der Ausgabe der Konsole zu ersetzen.



# How-To

Im folgenden wird erklärt wie die Anwendung zu bedienen ist:

## Geisterfahrer

- Pfeiltasten zur Navigation des Geisterfahrers
- +/- zur Vergrößerung/Verkleinerung des Geisterfahrers

## Kamerafahrt
- "w", "a", "s", "d", "x" und "y" um die Kamera zu bewegen

## Animationsknoten 
- "1" um die Animationen zu starten/stoppen

## transilvanian TicTacToe
- Klicke auf die Kacheln um die Markierung zu setzen
- "Reset"-Button für das zurücksetzen des Spiels

## spooky Sphere 
- Klicke auf die Sphere für ein spooky Suprise!



<!-- replace  "- [ ]" with "- [X]" when you tackled the topic -->
| Nummer | Punkte | Beschreibung                                                     | bearbeitet               | Verantwortliche/r                | Bewertung |
| ------ | ------ | ---------------------------------------------------------------- | ------------------------ | -------------------------------- | --------- |
| M1     | 5      | Szenengraph                                                      | <ul><li>- [X] </li></ul> | Lina                             |           |
| M2     | 10     | Rasteriser & Ray Tracer                                          | <ul><li>- [X] </li></ul> | Katrin, Lisa                     |           |
| M3     | 3      | min. drei eingebundene Objekte                                   | <ul><li>- [X] </li></ul> | Lisa                             |           |
| M4     | 8      | min. drei verschiedene Animationsknoten                          | <ul><li>- [X] </li></ul> | Lisa                             |           |
| M5     | 4      | texturierte Objekte                                              | <ul><li>- [X] </li></ul> | Katrin, Lina                     |           |
| M6     | 5      | mathematische Bibliothek                                         | <ul><li>- [X] </li></ul> | Katrin, Lina, Lisa               |           |
| M7     | 4      | Phong WebGL Shader (Rasterisier)                                 | <ul><li>- [X] </li></ul> | Katrin                           |           |
| M8     | 2      | 3D-Anwendungsfenster                                             | <ul><li>- [X] </li></ul> | Lina, Katrin                     |           |
| M9     | 4      | Taskleiste                                                       | <ul><li>- [X] </li></ul> | Lina, Katrin                     |           |
| M10    | 5      | Mausklick mit Manipulation                                       | <ul><li>- [X] </li></ul> | Lina                             |           |
|        |        |                                                                  |                          |                                  |           |
| O1     | 7      | weitere Texturen zur beeinflussung der Beleuchtung / Transparenz | <ul><li>- [ ] </li></ul> |                                  |           |
| O2     | 3      | Videos und Text als Textur                                       | <ul><li>- [X] </li></ul> | Lina                             |           |
| O3     | 8      | Laden von 3D Modellen                                            | <ul><li>- [ ] </li></ul> |                                  |           |
| O4     | 4      | mehrere Lichtquellen                                             | <ul><li>- [X] </li></ul> | Katrin                           |           |
| O5     | 6      | Lupeneffekt                                                      | <ul><li>- [ ] </li></ul> |                                  |           |
| O6     | 4      | Animation bei Klick                                              | <ul><li>- [X] </li></ul> | Lina                             |           |
| O7     | 8      | Kamera Knoten                                                    | <ul><li>- [X] </li></ul> | Lisa                             |           |
| O8     | 5      | Beschleunigung des Raytracing                                    | <ul><li>- [X] </li></ul> | Lina                             |           |
| O9     | 8      | Laden & Speichern                                                | <ul><li>- [X] </li></ul> | Katrin                           |           |
| O10    | 7      | Raytracing aller Dreiecksnetze                                   | <ul><li>- [X] </li></ul> | Katrin                           |           |
| O11    | 10     | Dynamische Texturen                                              | <ul><li>- [ ] </li></ul> |                                  |           |
| O12    | 5      | Anwendung in den 3D Anwendungsfenstern                           | <ul><li>- [X] </li></ul> | Katrin                           |           |


## Link zum Wiki:
https://gitlab2.informatik.uni-wuerzburg.de/hci/teaching/courses/interactive-computer-graphics/student-material/22ss/group-01/-/wikis/home



### Kompatibilität
Das Projekt wurde mit folgenden Konfigurationen getestet:
<!-- Nur die Konfigurationen angeben die ihr wirklich getestet habt. Eine gängige Kombination ist hier schon ausreichend-->
- Windows 11 Build Version <10.0.22000 Build 22000> mit
  - Firefox Version <104.0.2 (64-Bit)>

- Windows 10 Home <21H1> mit
  - Chrome Version <104.0.5112.102> 
<!--
- Manjaro Build Version <> mit
  - Firefox Version <>
  - Chrome Version <> 
  - Opera Version <>
  - Chromium Version <>
  - node js Version <> 
- macOs Build Version <> mit
  - Firefox Version <>
  - Chrome Version <> 
  - Safari Version <>
  - Chromium Version <>
  - node js Version <>
-->
