FROM node:9.4.0
RUN mkdir /app
WORKDIR /app
COPY package.json /app/package.json
RUN npm install -g -s --no-progress yarn && yarn --pure-lockfile
COPY . .
