FROM node:9.4.0
RUN apt-get update -qq && apt-get install -y nodejs
RUN mkdir /app
WORKDIR /app
COPY package.json /myapp/package.json
RUN npm install
COPY . .
