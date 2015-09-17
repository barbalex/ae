#arteigenschaften.ch, neu aufgebaut
 
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](https://github.com/feross/standard)
[![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/barbalex/gs/blob/master/license.md)
[![js-standard-style](https://david-dm.org/barbalex/ae.svg)](https://david-dm.org/barbalex/ae)

###[Arteigenschaften.ch](http://arteigenschaften.ch) wird mit folgenden Mitteln neu aufgebaut:

- Für die Applikation wird keine CouchApp mehr benutzt
  - ermöglicht die nachfolgenden Vorteile
- Alle Abhängigkeiten werden mit [npm](https://www.npmjs.com) verwaltet
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

###Unterschiede zur bisherigen Anwendung

- Neuste Technologie, stark verringerte Komplexität, viel bessere Unterhalt- und Erweiterbarkeit
- Der Server hat jetzt diese Aufgaben:
  - Zentraler Datenserver und Replikationsdrehscheibe
  - Schnittstellen zu EvAB und ALT (unverändert)
  - Anwendungsserver: Beim erstmaligen Besuch von erfassen.ch wird die Anwendung vom Server an den Browser übergeben. Danach liefert der Server nur noch Updates
- Die Anwendung ist (jetzt noch nicht ganz, dazu braucht es dann https) nach dem ersten Laden vom Server bzw. dem Internet unabhängig
- Daher funktioniert Einiges viel schneller: Daten müssen nach dem erstmaligen Laden nicht über das Internet geholt werden
- Anderes ist langsamer: 
  - Indizes müssen lokal aufgebaut werden - das kann den Browser recht stark belasten. Indizes werden für Im- und Exporte benötigt
  - Die Anwendung beansprucht recht viel Festplattenspeicher. Nach dem Laden aller Gruppen ca. 680 MB. Wenn man Indizes nutzt, werden daraus Gigabites
- Da viele Aufgaben, die bisher der Server übernahm, neu von der Anwendung wahrgenommen werden, reicht der kleinste verfügbare Server
- Die Möglichkeit, später einmal Taxonomien zu importieren, ist strukturell vorgespurt

###Aktueller Stand
####Man kann jetzt:

- Daten laden
- Daten anzeigen
- Daten suchen
- Falls man die Anwendung beim ersten Besuch direkt mit einem Art-Link öffnet [(Beispiel)](http://erfassen.ch/Moose/Musci%20Laubmoose/Buxbaumiaceae/Buxbaumia/Buxbaumia%20aphylla%20Hedw?id=6B7B1CC6-7505-4D79-8E24-F43E464EDB48), lädt sie die Art von der zentralen Datenbank, zeigt sie an und lädt anschliessend die entsprechende Gruppe nach (damit man nicht warten muss, bis die Gruppe geladen ist, bevor man die Art sieht)
- Bilder auf Google suchen
- Wikipedia Artikel suchen
- Eigenschaftensammlungen importieren
- Beziehungssammlungen importieren
- ...diese anschliessend mit der zentralen Datenbank (jetzt natürlich auf efassen.ch, nicht arteigenschaften.ch) replizieren.<br/>
  Es wäre ganz einfach, nach jedem Import automatisch zu replizieren. Aber so wie es jetzt ist, kann jemand auch einmal eigene Daten importieren, ohne sie mit arteigenschaften.ch zu teilen. Ich sehe das als möglichen Vorteil
- Daten von der zentralen Datenbank (jetzt erfassen.ch) replizieren (falls z.B. jemand Anderes neue Daten importiert hat).<br/>
  Ich könnte ganz einfach einstellen, dass die Anwendung bei jedem Start von der Zentralen Datenbank repliziert, falls der Benutzer bereits alle Gruppen geladen hat. Das wäre vermutlich sinnvoll
- Vor allem bei Importen gibt es bessere Informationen und Rückmeldungen
- Die Anwendung passt sich an den Handy-Bildschirm an - und läuft auf meinem zugegeben neuen Nexus recht schön (allerdings auf WLAN getestet)
- Jede Hierarchiestufe hat ihre eigene als Link nutzbare URL
- Links sind aussagekräftig (wenn auch nicht besonders lesbar, weil Leerzeichen in der URL von Browsern mit "%20" dargestellt werden)
- Wo möglich wird bei langsamen Vorgängen der Fortschritt angezeigt, z.B. beim Laden von Gruppen. Leider ist das nicht immer möglich, z.B. wenn Indizes gebaut werden

Die Anwendung ist auf [erfassen.ch](http://erfassen.ch) aufgeschaltet. Man kann hier üben, soviel man will. Test-Login: User "z@z.ch", Passwort "z".

####To Do

- Exportieren
- Organisationen und Benutzer
- Auf dem Internet Explorer zum Laufen bringen

Die Anwendung wird auf Google Chrome entwickelt. Auf Firefox und Edge ist sie erst rudimentär getestet. Auf dem Internet Explorer läuft sie noch nicht. Die verwendeten Technologien sollten ab IE9 funktionieren (mit ein paar Ausnahmen, die es aber heute schon gibt). Unsicher ist aber, ob der IE9 leistungsfähig genug ist.