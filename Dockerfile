FROM node:18-alpine

WORKDIR /app

COPY package.json .

# install server deps
RUN npm run install-server --omit=dev

COPY client/package.json client/

RUN npm run install-client

COPY . .

RUN npm run react-build

EXPOSE 3030

CMD ["npm", "start"]