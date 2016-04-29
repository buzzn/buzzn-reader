# buzzn-reader
  der buzzn-reader ist ein aus Hard und Software basierendes Auslesemodul für elektronische Zähler. viele elektronische Zähler besitzen eine optische Datenschnittstelle diese kann mit dem buzzn-reader ausgelesen und an die buzzn-Plattform gesendet werden.
  Die Inhalte der Nachrichten, die über die optische Schnittstelle versendet werden sind in der sogenannten Smart Meter Language (SML) verfasst. Der buzzn-reader besteht aus folgenden Hardwareteilen. (Entwickelt wird aktuell noch auf dem Raspberry Pi2)

  - [Raspberry Pi2 / 37,50 € ](https://www.reichelt.de/RASPBERRY-PI-2-B/3/index.html?&ACTION=3&LA=446&ARTICLE=152728&artnr=RASPBERRY+PI+2+B&SEARCH=Raspberry+Pi+2)
  - [Raspberry Pi2 Netzteil / 9,99 € ](http://www.amazon.de/Rydges-High-Quality-Netzteil-Ladeger%C3%A4t-Raspberry/dp/B00GM0305Y/ref=sr_1_5?ie=UTF8&qid=1461920420&sr=8-5&keywords=Raspberry+Pi2+Netzteil)
  - [Raspberry Pi2 Gehäuse / 7,54 € ](http://www.amazon.de/OneNineDesign-Raspberry-bel%C3%BCftet-europ%C3%A4ische-Fertigung/dp/B00W7S1BFG/ref=sr_1_1?ie=UTF8&qid=1461921764&sr=8-1&keywords=Geh%C3%A4use+Raspberry+Pi2)
  - [SanDisk microSD 16GB / 6 € ](http://www.amazon.de/SanDisk-Android-microSDHC-Speicherkarte-SD-Adapter/dp/B013UDL5V6/ref=pd_sim_147_7?ie=UTF8&dpID=41yP-zBY53L&dpSrc=sims&preST=_AC_UL160_SR160%2C160_&refRID=0BJQVE54N5Z7GB6JEBXN)
  - [D0-Lesekopf / 25 € ](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf-usb-ausgang#stueckliste_und_preise)
  - [Optional Easymeter Adapter / 3€](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf_easymeter-adapter)

##### buzzn-reader-app
  die buzzn-reader-app ist das Gehirn des buzzn-readers und besteht aus mehreren Teilen. webGUI, serialport.js, kue.js und redis.

  - /etc/init.d/redis-server start, startet den redis server zur Zwischenspeicherung der SML Nachrichten (kurz SMLs)

  - npm start, startet die webGUI. Dort läst sich der token eingeben und speichern. der token wird an die Plattform zur Validierung gesendet und dann lokaler in redis speichern.

  - node serialport, startet das Auslesen der SMLs. alle 2 Sekunden kommt eine SML von dem Zähler. Diese wird dann an kue gesendet und in der redis zwischengespeichert.

  - node kue, startet den background worker dieser empfängt/verarbeitet die SMLs die von serialport.js kommen. Jede SML wird geparst und mittels des access_token an die Plattform gesendet.


## Development
  - [Raspberry Pi2 OS Ubuntu MATE](https://ubuntu-mate.org/raspberry-pi/)
  - [install node with nvm](https://github.com/creationix/nvm)
  - Ein guter Editor unter Raspian ist Bluefish
  - install redis
  - install nvm
  - npm install nodemon -g
  - npm install pm2 -g
  - npm install
  - nodemon npm start
  - node kue
  - node serialport
  - browser http://localhost:3000 aufrufen

## Production
    download BuzznReaderOS Image
    [Image auf die SD Card Brennen](https://www.raspberrypi.org/documentation/installation/installing-images/README.md)
