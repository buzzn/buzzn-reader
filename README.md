# buzzn-reader
  der buzzn-reader ist ein aus Hard und Software basierendes Auslesemodul für elektronische Zähler. viele elektronische Zähler besitzen eine optische Datenschnittstelle diese kann mit dem buzzn-reader ausgelesen und an die buzzn-Plattform gesendet werden.
  Die Inhalte der Nachrichten, die über die optische Schnittstelle versendet werden sind in der sogenannten Smart Meter Language (SML) verfasst. Der buzzn-reader besteht aus folgenden Hardwareteilen. (Entwickelt wird aktuell noch auf dem Raspberry Pi2)

  - [Raspberry Pi3 / 39,90 € ](https://www.reichelt.de/?ARTICLE=164977&PROVID=2788&wt_mc=amc141526782519998&gclid=Cj0KEQjwrte4BRD-oYi3y5_AhZ4BEiQAzIFxn-gnfEK5rxzGnYoiAz3sbMUnDfI7VhtRcC68r_A2c6UaAuDO8P8HAQ)
  - [Raspberry Pi3 Netzteil / 11,50 € ](https://www.reichelt.de/Ladegeraete-fuer-USB-Geraete/NT-MUSB-25-SW/3/index.html?&ACTION=3&LA=3&ARTICLE=167078&GROUPID=5158)
  - [Raspberry Pi3 Gehäuse / 11,99 € ](http://www.amazon.de/Geh%C3%A4use-f%C3%BCr-Raspberry-offizieles-K%C3%BChlk%C3%B6rper/dp/B01CP11RPS/ref=sr_1_4?ie=UTF8&qid=1461138604&sr=8-4&keywords=Official+Raspberry+Pi+Case)
  - [SanDisk microSD 8GB / 6,99 € ](http://www.amazon.de/SanDisk-Speicherkarte-SD-Adapter-Frustfreie-Verpackung/dp/B00MWXUKDK?ie=UTF8&psc=1&redirect=true&ref_=ox_sc_sfl_title_2&smid=A3JWKAKR8XB7XF)
  - [D0-Lesekopf / 25 € ](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf-usb-ausgang#stueckliste_und_preise)
  - [optional Easymeter Adapter / 3€] (http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf_easymeter-adapter)

##### buzzn-reader-app
  die buzzn-reader-app ist das Gehirn des buzzn-readers und besteht aus mehreren Teilen. webGUI, serialport.js, kue.js und redis.

  - /etc/init.d/redis-server start, startet den redis server zur Zwischenspeicherung der SML Nachrichten (kurz SMLs)

  - npm start, startet die webGUI. Dort läst sich der token eingeben und speichern. der token wird an die Plattform zur Validierung gesendet und dann lokaler in redis speichern.

  - node serialport, startet das Auslesen der SMLs. alle 2 Sekunden kommt eine SML von dem Zähler. Diese wird dann an kue gesendet und in der redis zwischengespeichert.

  - node kue, startet den background worker dieser empfängt/verarbeitet die SMLs die von serialport.js kommen. Jede SML wird geparst und mittels des access_token an die Plattform gesendet.


## Development
  - [Raspberry Pi3 OS Ubuntu MATE](https://ubuntu-mate.org/raspberry-pi/)
  - install node with nvm https://github.com/creationix/nvm
  - install redis
  - npm install nodemon -g
  - npm install pm2 -g
  - npm install

#### webGUI
    nodemon npm start
    und browser http://localhost:3000 aufrufen.

#### kue.js
    node kue
    kue-ui ist hier zu sehen http://localhost:3000/kue

#### serialport.js
    node serialport

## Deployment via docker
    docker build -t buzzn-reader .
    docker run -it  -p 80:3000 --rm --name web buzzn-reader

## infos
  http://www.edi-energy.de/files2%5COBIS-Kennzahlen-System%202.2a_20130401.pdf
