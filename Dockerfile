FROM resin/rpi-raspbian:jessie
MAINTAINER Felix Faerber <ffaerber@gmail.com>

# Define working directory
WORKDIR /data

# Install dependencies
RUN apt-get update && apt-get install -y \
    node \

# Define default command
CMD ["bash"]
