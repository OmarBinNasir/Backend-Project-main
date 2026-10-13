
FROM node:20.20.2-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm ls bcrypt \
    && node -e "console.log('bcrypt resolved at:', require.resolve('bcrypt'))"

COPY src ./src
COPY public ./public

ENV NODE_ENV=production

EXPOSE 8000

CMD ["node", "src/index.js"]
