# buzzn-reader
  der buzzn-reader besteht aus folgenden Hardware Teilen:

  - [Raspberry Pi3 / 39,90 € ](https://www.reichelt.de/?ARTICLE=164977&PROVID=2788&wt_mc=amc141526782519998&gclid=Cj0KEQjwrte4BRD-oYi3y5_AhZ4BEiQAzIFxn-gnfEK5rxzGnYoiAz3sbMUnDfI7VhtRcC68r_A2c6UaAuDO8P8HAQ)
  - [SanDisk microSD 8GB / 6,99 € ](http://www.amazon.de/SanDisk-Speicherkarte-SD-Adapter-Frustfreie-Verpackung/dp/B00MWXUKDK?ie=UTF8&psc=1&redirect=true&ref_=ox_sc_sfl_title_2&smid=A3JWKAKR8XB7XF)
  - [Raspberry Pi3 Gehäuse / 6,99 € ](http://www.amazon.de/Exclusives-Geh%C3%A4use-Raspberry-Pi-Version/dp/B00WQY2SN0/ref=sr_1_5?ie=UTF8&qid=1461085132&sr=8-5&keywords=Raspberry+Pi+Geh%C3%A4use)
  - [Raspberry Pi3 Netzteil / 11,99 € ](http://www.amazon.de/3000mAh-Netzteil-Raspberry-ausreichende-Leistungsreserve/dp/B01E75SB2C/ref=sr_1_11?ie=UTF8&qid=1461099559&sr=8-11&keywords=Raspberry+Pi3+netzteil)
  - [D0-Lesekopf / 25 € ](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf-usb-ausgang#stueckliste_und_preise)

##### buzzn-reader-app
  die buzzn-reader-app ist das gehirn des buzzn-readers besteht aus vier teilen.
  webGUI, serialport.js, kue.js und redis.

  - redis starten

  - npm start, startet die webGUI. dort läst sich der token eingeben und speichern. der token wird an das portal zur validierung gesendet und dann lokaler in redis speichern.

  - node serialport, startet das auslesen der SMLs. alle 2 sekunden kommt ein SML von dem smartmeter dieser wird dann in der redis gespeichert

  - node kue, startet den background worker dieser empfängt/verarbeitet die SMLs die von serialport.js kommen. jede sml wird geparst und mittels des access_token an das portal gesendet.


## Development Pi Setup
  - [Raspberry Pi3 OS Ubuntu MATE](https://ubuntu-mate.org/raspberry-pi/)
  install node with nvm https://github.com/creationix/nvm
  install redis
  npm install nodemon -g
  npm install pm2 -g
  npm install

## webGUI
    nodemon npm start
    und browser http://localhost:3000 aufruffen.


## kue
    pm2 start kue.js -i 4
    kue-ui ist hier zu sehen http://localhost:3000/kue


## build docker image
    docker build -t buzzn-reader .
    docker run -it  -p 80:3000 --rm --name web buzzn-reader


## infos
  http://www.edi-energy.de/files2%5COBIS-Kennzahlen-System%202.2a_20130401.pdf
