FROM node

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm ci

CMD [ "node", "src/app.js" ]

EXPOSE 3000