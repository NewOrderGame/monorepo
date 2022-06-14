FROM node:16-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY webpack.config.js tsconfig.json  ./
COPY environment/.env.production ./environment/
COPY src ./src
RUN npm run webpack:build
RUN rm -rf package.json webpack.config.js tsconfig.json .environment src
EXPOSE 5000
EXPOSE 5050
RUN npm i -S concurrently
CMD npx concurrently -n "main,stats-reader" "node build/main.js --stats" "node build/stats-reader.js"
