FROM node:8-alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY dist .
RUN npm install
EXPOSE 3000
CMD [ "node", "server.js" ]