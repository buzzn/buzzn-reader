[![Stories in Ready](https://badge.waffle.io/buzzn/d0-reader.png?label=ready&title=Ready)](https://waffle.io/buzzn/d0-reader)
[![Codeship Status for buzzn/d0-reader](https://codeship.com/projects/16833330-f9ad-0133-be69-0e6ed700efb9/status)](https://codeship.com/projects/151300)


# D0 Reader
  many electricity meters have an  D0 interface (IrDA) this can be read with the d0reader and sent to the buzzn platform.
  The d0-reader consists of following hardware parts.

  - [Raspberry Pi3 / 37,50 € ](https://www.reichelt.de/RASPBERRY-PI-3/3/index.html?&ACTION=3&LA=446&ARTICLE=164977&artnr=RASPBERRY+PI+3&SEARCH=pi3)
  - [Raspberry Pi3 PSU / 11,50 € ](https://www.reichelt.de/Ladegeraete-fuer-USB-Geraete/NT-MUSB-25-SW/3/index.html?&ACTION=3&LA=517&ARTICLE=167078&GROUPID=5158)
  - [Raspberry Pi3 Case / 9,90 € ](https://www.amazon.de/dp/B01CESAU4G)
  - [SanDisk microSD 16GB / 7,99 € ](http://www.amazon.de/dp/B013UDL5V6)
  - [D0-Head / 25 € ](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf-usb-ausgang#stueckliste_und_preise)
  - [Optional Easymeter Adapter / 3€](http://wiki.volkszaehler.org/hardware/controllers/ir-schreib-lesekopf_easymeter-adapter)

##### d0-reader app
  The d0-reader consists of following Software parts.

  - [redis](http://redis.io/). Key-value database for storing settings and queuing jobs.
  - web. [Express](https://github.com/expressjs/express) webinterface for change settings. like access_token and hostname.
  - [kue](https://github.com/Automattic/kue). background worker for sending readings.
  - [serialport](https://github.com/EmergingTechnologyAdvisors/node-serialport). reads incoming SMLs from the usb d0-head and send it to kue.

## Development on your Workstation
  - Fork the repository on Github
  - Create a named feature branch (like add_component_x)
  - git checkout add_component_x
  - Write you changes
  - Write tests for your changes
  - Run the tests, ensuring they all pass
  - Submit a Pull Request using Github

## debugging on RaspberryPi
  - docker stop $(docker ps -a -q) | Stop all running Container
  - docker rm $(docker ps -a -q) | Remove all Container
  - docker rmi $(docker images -a -q) | Remove all Images
  - docker volume rm $(docker volume ls) | Remove all volumes
  - docker-compose up --build | rebuild images and start containers

## Release
  - Download, unzip and Flash [Hypriot OS](https://downloads.hypriot.com/hypriotos-rpi-v1.0.0.img.zip)
  - open SDCard on your Workstation and open device-init.yaml
  - change hostname to d0reader
  - if you want to use WLAN set wifi interfaces.
  - save and put SDCard into RaspberryPi
  - start and log into RaspberryPi via ssh pirate@d0reader.local (password is hypriot)
  - git clone https://github.com/buzzn/d0-reader.git
  - cd d0-reader
  - docker-compose up -d | StartUp all container as daemons
  - logout and move SDCard from RaspberryPi to your Workstation  
  - diskutil list | Locate SD Card
  - diskutil unmountDisk /dev/disk3 | Unmount the SD Card
  - sudo dd if=/dev/disk3 of=./images/d0-reader-v1.img | Create Image from SD Card
  - To see progress while it is running just type control-t
  - zip and upload image to aws s3
  - continue with step 'Production'

## Production
  - Download and Flash [D0ReaderOS](http://buzzn.s3.amazonaws.com/d0-reader-v1.img.zip)
  - Connect to RaspberryPi ethernet, D0-head, SD Card and Power.
  - open http://d0reader.local and login.

## Flash SDCard
  - diskutil list | Locate SD Card
  - diskutil unmountDisk /dev/disk3 | Unmount the SD Card
  - sudo dd bs=1M if=~/Downloads/pi-image.img of=/dev/rdisk3 | Burn Image on SDCard
  - To see progress while it is running just type control-t

## Troubleshooting on RasPI
  - Does the RasPI start properly? ...
  - Is the IR measuring Head well connected?



## Extra Infos
  - [microSD Card Benchmarks](http://www.pidramble.com/wiki/benchmarks/microsd-cards)
  - [Docker on ARM](http://blog.hypriot.com/getting-started-with-docker-on-your-arm-device/)
