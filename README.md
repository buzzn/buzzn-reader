# buzzn reader
  buzzn reader ist eine app die die zählerstände an buzzn sendet.

## program flow
  express.js app starten (fertig)
  localhost:3000/bearers/new aufruffen token eingeben (fertig)
  token an app.buzzn.net senden zur validierung und lokaler in mongodb speichern (fertig)
  neuen metering_point auf app.buzzn.net erstellen und metering_point_id lokaler speichern.
  reader c programm starten zur auslese der IR schnittstelle.
  sekündliche ausgabe wird in lokaler mongodb gespeichert.
  express nimmt sich die ältesten eintrage jede sekunde aus der mongodb und sendet sie an app.buzzn

## Setup reader
  install node with nvm https://github.com/creationix/nvm
  install mongodb
  npm install -g nodemon
  npm install

## run app
  nodemon npm start

## build docker image
  docker build -t buzzn-reader .
  docker run -it  -p 80:3000 --rm --name web buzzn-reader

## neuen token von app.buzzn.net bekommen
  momentan verfallen die token alle paar stunden.
  um sich einen neuen token zu besorgen muss man folgendes machen

  in der rails console
  site      = "https://app.buzzn.net"
  app_id    = "f0bd18be0aa6260e3fef45030cb83be1d142e05418da0b2081de15a01a36ddd4"
  secret    = "2f8a7acd77837ce0ca82d43cef04b5cff5dfefb3ef248c5f91cd87b7c6ba1652"
  scopes    = "public read write"
  callback  = "urn:ietf:wg:oauth:2.0:oob"
  client    = OAuth2::Client.new(app_id, secret, site: site)
  client.auth_code.authorize_url(scope: scopes, redirect_uri: callback)

  man bekommt ein link als ausgabe. diesen im browser öffnen und auf Authorize klicken.
  dann bekommt man einen Authorization code diesen Authorization code muss noch zu einen access_token umgewandelt werden.
  kopiere den Authorization code und gehe zu https://app.buzzn.net/api#!/auth/POST_api_version_auth_token_json
  und gebe dort den Authorization code ein klick auf "Try it out!"
  in der ausgabe sollte jetzt der access_token zu sehen sein.
