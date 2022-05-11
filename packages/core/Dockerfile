FROM node:16-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json ./
RUN npm install
COPY webpack.config.js tsconfig.json ./
COPY src ./src
RUN npm run webpack:build
EXPOSE 5000
CMD [ "node", "build/main.js" ]
