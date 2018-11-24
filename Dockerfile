FROM node:latest
WORKDIR /usr/WhiteGoat
COPY ./package.json /usr/WhiteGoat/package.json
COPY ./webpack.config.js /usr/WhiteGoat/webpack.config.js
COPY ./index.js /usr/WhiteGoat/index.js
COPY ./app /usr/WhiteGoat/app
RUN npm install
RUN npm run build

