

docker build -t buzzn-reader .
docker run -it  -p 80:3000 --rm --name web buzzn-reader

DEBUG=buzzn-reader:* nodemon npm start
