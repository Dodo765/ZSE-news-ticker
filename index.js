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


//first data
let data = {
	speed: 75,
	text: [
		"Paski informacyjne Szkolnego Studia Telewizyjnego w Zespole Szkół Elektronicznych",
		"Paski informacyjne Szkolnego Studia Telewizyjnego w Zespole Szkół Elektronicznych",
	],
	isOpen: false,
};

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
		function updateClients() {
			socket.emit("update-data", data.text, data.speed, data.isOpen);
		}
		socket.on("req-data", () => {
			updateClients();
		});
		socket.on("send-speed", (speed) => {
			data.speed = speed;
			socket.emit("server-successfull-message", "Poprawnie zmieniono prędkość");
		});
		socket.on("send-text", (text) => {
			data.text = text;
			socket.emit("server-successfull-message", "Poprawnie zmieniono tekst");
		});

		socket.on("open", () => {
			data.isOpen = true;
			socket.emit("server-successfull-message", "Uruchomiono napisy");
			updateClients();
		});
		socket.on("close", () => {
			data.isOpen = false;
			socket.emit("server-successfull-message", "Zamknięto napisy");
			updateClients();
		});
		socket.on("req-state", () => {
			socket.emit("res-state", data.isOpen);
		});
	});
}
main();

app.use(`${URLpath}/display`, express.static(path.join(__dirname, "display")));

app.use(`${URLpath}/manage`, express.static(path.join(__dirname, "manage")));

app.use(`${URLpath}`, express.static(path.join(__dirname, "menu")));

app.use(`${URLpath}/sources`, express.static(path.join(__dirname, "sources")));

//API
app.use(`${URLpath}/API/show`, (req, res) => {
	data.isOpen = true;
	res.status(200).json({ operation: "show", state: "success" });
});
app.use(`${URLpath}/API/hide`, (req, res) => {
	data.isOpen = false;
	res.status(200).json({ operation: "hide", state: "success" });
});
