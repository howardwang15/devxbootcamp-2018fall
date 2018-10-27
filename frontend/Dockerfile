FROM node:alpine
MAINTAINER xorkevin
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY server.js .
COPY bin bin
EXPOSE 3030
CMD ["npm", "run", "serve"]
