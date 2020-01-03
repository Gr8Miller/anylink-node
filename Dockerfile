FROM node:10-alpine

MAINTAINER Gr8Miller <gr8miller@hotmail.com>

WORKDIR /usr/src/anylink/proxy

RUN rm -rf ./*

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

COPY . .

RUN npm config set registry https://registry.npm.taobao.org
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production
RUN npm run build
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8001
