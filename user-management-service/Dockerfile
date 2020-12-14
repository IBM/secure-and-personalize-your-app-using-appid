FROM node:alpine

LABEL Maintainer="muralidhar.chavan@in.ibm.com"

RUN apk update && apk upgrade

# Create app directory
RUN mkdir -p /user-api/
WORKDIR /user-api/

# Install the application
COPY . /user-api/

RUN pwd
RUN npm install && ls
ENV WEB_PORT 3001
EXPOSE  3001

# Define command to run the application when the container starts
CMD ["node", "app.js"]