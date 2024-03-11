FROM node:21
RUN mkdir /data
COPY . .
WORKDIR /
CMD node index.js
EXPOSE 8080