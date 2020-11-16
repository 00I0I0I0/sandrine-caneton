FROM node:12
WORKDIR /usr/src/app
RUN apt-get update && apt-get install ffmpeg -y
RUN npm i ffmpeg
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "src/app.js" ]

