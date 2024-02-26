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
	speed: 750,
	text: [
		"Jako szkoła posiadamy własne Studio TV. Najlepsze technikum w Rzeszowie. Ponad 98% zdawalność matur i egzaminów zawodowych w 2022 r. Hala sportowa do dyspozycji naszych uczniów. Pobliski internat dla uczniów z dalszych okolic. Nowoczesny sprzęt do dyspozycji. Nowe sale lekcyjne sponsorowane przez firmy: Tech-Met oraz BorgWarner",
		"Absolwent szkoły kształcącej w zawodzie technik automatyk powinien być przygotowany do wykonywania następujących zadań zawodowych: montażu urządzeń i instalacji automatyki, uruchamiania urządzeń i instalacji automatyki, obsługi urządzeń i instalacji automatyki, przeglądów technicznych i konserwacji urządzeń i instalacji automatyki, diagnostyki i remontu urządzeń i instalacji automatyki, wizualizacji procesów produkcyjnych i sterowania procesami produkcyjnymi w zautomatyzowanych liniach produkcyjnych, uzyskania dodatkowych certyfikatów i uprawnień.",
		"Absolwent szkoły kształcącej w zawodzie technik elektronik powinien być przygotowany do wykonywania następujących zadań zawodowych: montowania i uruchamiania elementów, układów i urządzeń elektronicznych, wykonywania instalacji i instalowania urządzeń elektronicznych, użytkowania instalacji elektronicznych i urządzeń elektronicznych, konserwowania i naprawy instalacji elektronicznych i urządzeń elektronicznych, uzyskania dodatkowych uprawnień, tj.: uprawnień SEP do 1 kV (w zakresie eksploatacji i dozoru urządzeń, instalacji i sieci elektroenergetycznych do 1 kV - wydawane uprawnienia elektryczne w formie świadectwa kwalifikacji są ważne przez okres 5 lat).",
		"Absolwent szkoły kształcącej w zawodzie technik informatyk powinien być przygotowany do wykonywania następujących zadań zawodowych: montażu oraz eksploatacji komputera i urządzeń peryferyjnych, naprawy i diagnostyki usterek sprzętu komputerowego, projektowania i wykonywania lokalnej sieci komputerowej, administrowania sieciowymi systemami operacyjnymi, projektowania baz danych i administrowania bazami, konfigurowania urządzeń sieciowych, serwerów, routerów, tworzenia i administrowania stronami WWW, tworzenia desktopowych, webowych oraz mobilnych aplikacji internetowych, administrowania stronami i aplikacjami internetowymi, cyfrowego przetwarzania obrazu i dźwięku, projektowania grafiki komputerowej.",
	],
	isOpen: false,
};

if (data.text.length > 0) {
	data.speed = Math.round(data.text.join("").length / 4 / 10) * 10;
}

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
