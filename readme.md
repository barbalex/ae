#[arteigenschaften.ch](http://arteigenschaften.ch), neu aufgebaut
 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/barbalex/gs/blob/master/license.md)
[![js-standard-style](https://david-dm.org/barbalex/ae.svg)](https://david-dm.org/barbalex/ae)

###Diese Technologien werden verwendet:

- Als Datenbank wird neu [PostgreSQL](https://www.postgresql.org) verwendet
  - die dynamische Datenstruktur, welche mit Hilfe von [JSON](https://de.wikipedia.org/wiki/JavaScript_Object_Notation) den Benutzern ermöglicht, eigene Datenstrukturen zu importieren, bleibt erhalten - genau dort wo nötig
  - alle übrigen Datenstrukturen sind relational und ermöglichen damit:
     - einfachere Verwaltung
     - einfachere Datenauswertung
     - bessere Datenintegrität
- Alle Abhängigkeiten werden mit [npm](https://www.npmjs.com) verwaltet
  - einfache Aktualisierung
  - zuverlässige Verwaltung benutzter Fremd-Software
  - zuverlässige und rasche Installation der Enwicklungsumgebung
  - einfache Aktualisierung der Server nach Anpassungen
- [ES6](https://github.com/lukehoban/es6features), die neue Version von [JavaScript](http://en.wikipedia.org/wiki/JavaScript)
  - fördert lesbaren, kurzen Code
- [eslint](http://eslint.org)
  - erzwingt einen konsequenten und lesbaren Programmierstil
  - reduziert Fehler
- [webpack](http://webpack.github.io) aktualisiert während der Entwicklung laufend die App im Browser
  - jede Änderung ist direkt sichtbar
  - raschere Enwicklung, weniger Fehler
- [Flux](http://facebook.github.io/flux) in der Form von [Redux](https://github.com/reactjs/redux)
  - vereinfacht die Architektur
  - senkt die Komplexität
  - beschleunigt Entwicklung und Unterhalt
- [React](https://facebook.github.io/react/index.html)
  - vereinfacht die Steuerung der Benutzeroberfläche
  - reduziert die Komplexität
- [surge](https://surge.sh) erzeugt für den produktiven App-Server statische Dateien
  - womit der App-Server einfach aufgebaut und zu installieren ist
- [hapi.js](http://hapijs.com) liefert auf dem Anwendungsserver die Applikation und auf dem Datenserver die Daten

###Funktionale Erweiterungen
Verglichen mit der aktuellen Anwendung:

- Jedes Objekt kann von beliebig vielen Taxonomien beschrieben werden, ähnlich wie bisher schon bei den Eigenschaften- und Beziehungssammlungen. Das ermöglicht diese z.T. noch nicht realisierten Features:
  - Jede neue Version einer Taxonomie kann wie bisher bei den Eigenschaften- und Beziehungssammlungen importiert werden, ohne dass die alte ersetzt werden muss
     - Damit bleiben alle Daten langfristig erhalten 
     - Anwender oder Anwendungen (welche die Daten über Schnittstellen verwenden), werden durch den Import neuer Daten(-strukturen) nicht beeinträchtigt 
  - Import von Taxonomien über die Benutzeroberfläche, wie heute bei Eigenschaften- und Beziehungssammlungen (noch nicht realisiert)
  - Der Benutzer kann wählen, nach welcher Taxonomie der Strukturbaum aufgebaut wird (noch nicht realisiert)
- Daten sind vor Veränderung geschützt. Ihre Anpassung wird durch Organisationen gesteuert, welche Benutzern entsprechende Rechte erteilen

###Aktueller Stand
####Man kann jetzt:

- Es besteht [ein Projekt](https://github.com/barbalex/ae_import), mit dem jederzeit die Daten aus der bisherigen in die neue Anwendung importiert werden können
- Die neue Anwendung ist noch im Aufbau