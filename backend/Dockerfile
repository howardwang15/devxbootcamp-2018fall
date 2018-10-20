FROM node:alpine
MAINTAINER xorkevin
WORKDIR /app
RUN apk --no-cache add --virtual builds-deps build-base python
COPY package.json .
COPY package-lock.json .
RUN npm ci
COPY src src
EXPOSE 31337
CMD ["npm", "run", "serve"]
