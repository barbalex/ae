#arteigenschaften.ch, neu aufgebaut

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/barbalex/gs/blob/master/license.md)

Arteigenschaften.ch soll mit folgenden Mitteln neu aufgebaut werden:

- keine CouchApp mehr
- Abhängigkeiten werden mit [npm](https://www.npmjs.com) verwaltet
- [ES6](https://github.com/lukehoban/es6features), die künftige Version von [JavaScript](http://en.wikipedia.org/wiki/JavaScript), fördert lesbaren, kurzen Code
- [standard](https://github.com/feross/standard) erzwingt einen konsequenten und lesbaren Programmierstil
- [webpack](http://webpack.github.io) aktualisiert während der Entwicklung laufend die App im Browser - jede Änderung ist direkt sichtbar
- mit [Flux](http://facebook.github.io/flux) wird die Architektur des Codes stark vereinfacht
- [React](https://facebook.github.io/react/index.html) vereinfacht die Steuerung der Benutzeroberfläche und baut sie effizient auf
- mit [webpack](http://webpack.github.io) werden für den produktiven Webserver statische Dateien erzeugt...
- ...die von [hapi.js](http://hapijs.com) an den Browser geliefert werden...
- ...der dann die App ohne weitere Hilfe des Servers ausführt. Es handelt sich daher um eine reine ["Native Web App"](https://blog.andyet.com/2015/01/22/native-web-apps)
