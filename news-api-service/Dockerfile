FROM node:alpine

LABEL Maintainer="muralidhar.chavan@in.ibm.com"

RUN apk update && apk upgrade

# Create app directory
RUN mkdir -p /news-api/
WORKDIR /news-api/

# Install the application
COPY . /news-api/

RUN pwd
RUN npm install && ls
ENV WEB_PORT 3002
EXPOSE  3002

# Define command to run the application when the container starts
CMD ["node", "app.js"]