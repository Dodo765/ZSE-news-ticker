//NEWS TICKERS
const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

//env
const URLpath = process.env.URLpath; //zmienić
const cors = process.env.cors;
const servicePort = process.env.servicePort;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: cors,
		methods: ["GET", "POST"],
	},
	path: `${URLpath}/socket.io`, //url
});
console.log(
	`Serwer Express działa na http://localhost:${servicePort}${URLpath}/manage i http://localhost:${servicePort}${URLpath}/display 
natomiast socket.io na http://localhost:${servicePort}${URLpath}/socket.io`
);
server.listen(servicePort, () => {
	console.log("");
});

async function main() {
	io.on("connect", (socket) => {
		console.log("\nNowy klient: ");
		console.log(socket.id);
	});
}
main();

app.use(`${URLpath}/display`, express.static(path.join(__dirname, "display")));

app.use(`${URLpath}/manage`, express.static(path.join(__dirname, "manage")));

app.use(`${URLpath}`, express.static(path.join(__dirname, "menu")));

app.use(`${URLpath}/sources`, express.static(path.join(__dirname, "sources")));
