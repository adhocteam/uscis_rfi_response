FROM node:9.4.0
RUN mkdir /app
WORKDIR /app
COPY ./package.json ./yarn.lock /app/
RUN npm install -g -s --no-progress yarn && yarn
COPY . .
