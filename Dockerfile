FROM node:9
WORKDIR usr/app
COPY . /usr/app
RUN apt-get update && apt-get install -y postgresql postgresql-contrib
RUN ["chmod", "+x", "/usr/app/wait-for-postgres.sh"]
RUN npm install
EXPOSE 4000
CMD npm start

