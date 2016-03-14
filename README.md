# buzzn reader
  buzzn reader ist eine app die die zählerstände ausliest und an staging.buzzn.net sendet.

## program flow
  - express.js app starten (fertig)
  - localhost:3000/bearers/new aufruffen token eingeben (fertig)
  - token an app.buzzn.net senden zur validierung und lokaler in mongodb speichern (fertig)
  - neuen metering_point auf app.buzzn.net erstellen und metering_point_id lokaler speichern.
  - reader c programm starten zur auslese der IR schnittstelle.
  - sekündliche ausgabe wird in lokaler mongodb gespeichert.
  - express nimmt sich die ältesten eintrage jede sekunde aus der mongodb und sendet sie an app.buzzn

## Setup
  install node with nvm https://github.com/creationix/nvm
  install mongodb
  npm install -g nodemon
  npm install

## run app
    nodemon npm start

## build docker image
    docker build -t buzzn-reader .
    docker run -it  -p 80:3000 --rm --name web buzzn-reader

## neuen token von staging.buzzn.net bekommen
  momentan verfallen die token alle paar stunden.
  um sich einen neuen token zu besorgen muss man folgendes machen

  in der lokalen rails console:

    site      = "https://staging.buzzn.net"
    app_id    = "28aaa50aaa47e2a8a0165804ee2d533a388914582e4f42321addb5b28aea34dd"
    secret    = "d85a76a53c37451d7d82b552808b7c183c95f0b9336e8fbc59b042370946f1f9"
    scopes    = "public read write"
    callback  = "urn:ietf:wg:oauth:2.0:oob"
    client    = OAuth2::Client.new(app_id, secret, site: site)
    client.auth_code.authorize_url(scope: scopes, redirect_uri: callback)

  - man bekommt ein link als ausgabe. diesen im browser öffnen und auf Authorize klicken.
  - dann bekommt man einen Authorization code diesen Authorization code muss noch zu einen access_token umgewandelt werden.
  - kopiere den Authorization code und gehe zu https://staging.buzzn.net/api#!/auth/POST_api_version_auth_token_json
  - und gebe dort den Authorization code ein klick auf "Try it out!"
  - in der ausgabe sollte jetzt der access_token zu sehen sein.
