FROM node:16-alpine
RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
RUN npm i
COPY webpack.config.js tsconfig.json  ./
COPY environment/.env.production ./environment/
COPY src ./src
RUN npm run webpack:build
RUN rm -rf package.json package-lock.json webpack.config.js tsconfig.json .environment src node_modules
RUN npm i -S concurrently
CMD npx concurrently -n "main" "node build/main.js"
