FROM node:16

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci --ignore-scripts

COPY  ./src ./src

CMD ["node", "./src/app.js"]



