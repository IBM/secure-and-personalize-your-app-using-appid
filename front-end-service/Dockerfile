FROM node:alpine

MAINTAINER Shikha "shikha.mah@in.ibm.com"

RUN apk update && apk upgrade

# Create app directory
RUN mkdir -p /front-end-service/
WORKDIR /front-end-service/

# Install the application
COPY . /front-end-service/

RUN pwd
RUN npm install && ls
ENV WEB_PORT 3000
EXPOSE  3000

# Define command to run the application when the container starts
CMD ["node", "./bin/www"]