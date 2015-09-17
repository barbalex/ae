#arteigenschaften.ch, neu aufgebaut
 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/barbalex/gs/blob/master/license.md)
[![js-standard-style](https://david-dm.org/barbalex/ae.svg)](https://david-dm.org/barbalex/ae)

Arteigenschaften.ch wird mit folgenden Mitteln neu aufgebaut:

- für die Applikation wird keine CouchApp mehr benutzt
  - ermöglicht die nachfolgenden Vorteile
- alle Abhängigkeiten werden mit [npm](https://www.npmjs.com) verwaltet
  - einfachere Aktualisierung
  - zuverlässige und schnelle Installation der Enwicklungsumgebung
- [ES6](https://github.com/lukehoban/es6features), die künftige Version von [JavaScript](http://en.wikipedia.org/wiki/JavaScript)
  - fördert lesbaren, kurzen Code
- [standard](https://github.com/feross/standard)
  - erzwingt einen konsequenten und lesbaren Programmierstil
- [webpack](http://webpack.github.io) aktualisiert während der Entwicklung laufend die App im Browser
  - jede Änderung ist direkt sichtbar
  - raschere Enwicklung, weniger Fehler
- [Flux](http://facebook.github.io/flux)
  - vereinfacht die Architektur
  - senkt damit die Komplexität
  - beschleunigt Entwicklung und Unterhalt
- [React](https://facebook.github.io/react/index.html)
  - vereinfacht die Steuerung der Benutzeroberfläche
  - reduziert die Komplexität
- [surge](https://surge.sh) erzeugt für den produktiven App-Server statische Dateien
  - womit der App-Server äusserst einfach aufgebaut und zu installieren ist
- [hapi.js](http://hapijs.com) liefert die Applikation an den Browser...
- ...der sie dann ohne weitere Hilfe des Servers ausführt. Es handelt sich daher um eine reine ["Native Web App"](https://blog.andyet.com/2015/01/22/native-web-apps)
- Die Daten werden mit Hilfe von [pouchdb](http://pouchdb.com) im Browser gespeichert
- Schnittstellen zu anderen Anwendungen werden wie bisher direkt durch die CouchApp gewährleistet. Ev. wird in einem zweiten Schritt ein unabhängiger api-Server erstellt, der sie mit Hilfe von [hapi.js](http://hapijs.com) bereitstellt
