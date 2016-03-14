FROM node:4-onbuild

RUN apt-get update
RUN apt-get install -y gcc make build-essential
RUN apt-get install -y sqlite3 libsqlite3-dev

EXPOSE 3000
