#arteigenschaften.ch, neu aufgebaut
 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/barbalex/gs/blob/master/license.md)
[![js-standard-style](https://david-dm.org/barbalex/ae.svg)](https://david-dm.org/barbalex/ae.svg)

Arteigenschaften.ch soll mit folgenden Mitteln neu aufgebaut werden:

- für die Applikation wird keine CouchApp mehr benutzt
  - ermöglicht die nachfolgenden Vorteile
- alle Abhängigkeiten werden mit [npm](https://www.npmjs.com) verwaltet
  - es ist einfacher, Abhängigkeiten zu aktualisieren
  - zuverlässigere und schnelle Installation der Enwicklungsumgebung
- [ES6](https://github.com/lukehoban/es6features), die künftige Version von [JavaScript](http://en.wikipedia.org/wiki/JavaScript)
  - fördert lesbaren, kurzen Code
- [standard](https://github.com/feross/standard)
  - erzwingt einen konsequenten und lesbaren Programmierstil
- [webpack](http://webpack.github.io) aktualisiert während der Entwicklung laufend die App im Browser
  - jede Änderung ist direkt sichtbar
  - raschere Enwicklung, weniger Fehler
- [Flux](http://facebook.github.io/flux)
  - vereinfacht die Architektur des Codes
  - senkt damit die Komplexität des codes
  - Entwicklung und Unterhalt werden beschleunigt
- [React](https://facebook.github.io/react/index.html)
  - vereinfacht die Steuerung der Benutzeroberfläche sehr stark
  - senkt die Komplexität des Codes stark
- [webpack](http://webpack.github.io) erzeugt für den produktiven App-Server statische Dateien...
  - womit der App-Server äusserst einfach aufgebaut und zu installieren ist
- ...die von [hapi.js](http://hapijs.com) an den Browser geliefert werden...
- ...der dann die App ohne weitere Hilfe des Servers ausführt. Es handelt sich daher um eine reine ["Native Web App"](https://blog.andyet.com/2015/01/22/native-web-apps)
- dazu werden die Daten mit Hilfe von [pouchdb](http://pouchdb.com) im Browser gespeichert
- Schnittstellen zu anderen Anwendungen werden wie bisher direkt durch die CouchApp gewährleistet. Ev. wird in einem zweiten Schritt ein unabhängiger api-Server erstellt, der alle Schnittstellen mit Hilfe von [hapi.js](http://hapijs.com) bereitstellt