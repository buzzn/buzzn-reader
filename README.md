[![Stories in Ready](https://badge.waffle.io/buzzn/d0-reader.png?label=ready&title=Ready)](https://waffle.io/buzzn/d0-reader)
[ ![Codeship Status for buzzn/d0-reader](https://codeship.io/projects/16833330-f9ad-0133-be69-0e6ed700efb9/status)](https://codeship.io/projects/151300)


# D0 Reader
  many smartmeters have an  D0 interface (IrDA) this can be read with the d0reader and sent to the buzzn platform.
  the d0-reader consists of following Hardware parts.

  - [Raspberry Pi3 / 37,50 € ](https://www.reichelt.de/RASPBERRY-PI-3/3/index.html?&ACTION=3&LA=446&ARTICLE=164977&artnr=RASPBERRY+PI+3&SEARCH=pi3)
  - [Raspberry Pi3 PSU / 11,50 € ](https://www.reichelt.de/Ladegeraete-fuer-USB-Geraete/NT-MUSB-25-SW/3/index.html?&ACTION=3&LA=517&ARTICLE=167078&GROUPID=5158)
  - [Raspberry Pi3 Case / 9,90 € ](https://www.amazon.de/offizielles-Geh%C3%A4use-Raspberry-Pi-himbeer/dp/B01CESAU4G/ref=sr_1_2?ie=UTF8&qid=1468406281&sr=8-2&keywords=Geh%C3%A4use+Raspberry+Pi3)
  - [SanDisk microSD 16GB / 7,99 € ](http://www.amazon.de/SanDisk-Android-microSDHC-Speicherkarte-SD-Adapter/dp/B013UDL5V6/ref=pd_sim_147_7?ie=UTF8&dpID=41yP-zBY53L&dpSrc=sims&preST=_AC_UL160_SR160%2C160_&refRID=0BJQVE54N5Z7GB6JEBXN)
  - [D0-Head / 25 € ](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf-usb-ausgang#stueckliste_und_preise)
  - [Optional Easymeter Adapter / 3€](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf_easymeter-adapter)

##### d0-reader app
  the d0-reader consists of following Software parts.

  - [redis](http://redis.io/). Key-value database for storing settings and queuing jobs.
  - web. [Express](https://github.com/expressjs/express) webinterface for change settings. like access_token and hostname.
  - [kue](https://github.com/Automattic/kue). background worker for sending readings.
  - [serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport). reads incoming SMLs from the usb d0-head and send it to kue.


## Create D0ReaderOS
  - Download, unzip and Flash [Hypriot OS](https://downloads.hypriot.com/hypriotos-rpi-v0.8.0.img.zip)
  - open SDCard on your Workstation and open device-init.yaml
  - change hostname to d0reader
  - comment out docker(line 3 to 6)
  - if you want to use WLAN set wifi interfaces.
  - save and put SDCard into RaspberryPi
  - start and log into RaspberryPi via ssh pirate@d0reader.local (password is hypriot)
  - git clone https://github.com/buzzn/d0-reader.git
  - cd d0-reader
  - docker-compose build base
  - docker-compose up
  - continue with step 'Development' or 'Release'

## Development
  - Fork the repository on Github
  - Create a named feature branch (like add_component_x)
  - pull branch and Write you change
  - Write tests for your change (if applicable)
  - Run the tests, ensuring they all pass
  - Submit a Pull Request using Github

## Release
  - Insert SD Card to Clone/Release
  - diskutil list | Locate SD Card
  - diskutil unmountDisk /dev/disk3 | Unmount the SD Card
  - sudo dd if=/dev/disk3 of=./images/d0-reader-v1.img | Create Image from SD Card
  - To see progress while it is running just type control-t
  - zip and upload image to aws s3
  - continue with step 'Production'

## Production
  - Download and Flash [D0ReaderOS](http://buzzn.s3.amazonaws.com/d0-reader-v1.img.zip)
  - Connect to RaspberryPi ethernet, D0-head, SD Card and Power.
  - copy access_token from https://app.buzzn.net/access_tokens to http://d0reader.local and click save.

## Flash SDCard
  - diskutil list | Locate SD Card
  - diskutil unmountDisk /dev/disk3 | Unmount the SD Card
  - sudo dd bs=1m if=~/Downloads/pi-image.img of=/dev/rdisk3 | Burn Image on SDCard
  - To see progress while it is running just type control-t

## Troubleshooting on RasPI
  - Does the RasPI start properly? ...
  - Is the IR measuring Head well connected?
  - TBD
  - ...

## Extra Infos
  - [microSD Card Benchmarks](http://www.pidramble.com/wiki/benchmarks/microsd-cards)
