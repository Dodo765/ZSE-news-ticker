FROM node:21
COPY . .
WORKDIR /
CMD node index.js
EXPOSE 8080