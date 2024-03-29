/* NEWS TICKERS */
/* Inicjalizacja serwera */
const fs = require("fs");
const path = require("path");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fileUpload = require("express-fileupload");
require("dotenv").config();

/* Wczytanie zmiennych z pliku .env */
const URLpath = process.env.URLpath; 
const cors = process.env.cors;
const servicePort = process.env.servicePort;
log(`Wczytane zmienne: URLpath: ${URLpath}, servicePort: ${servicePort}, cors: ${cors}`);

/* Ustawnienie serwera do obsługi WWW i Socket.IO na podanym porcie */
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: cors,
		methods: ["GET", "POST"],
	},
	path: `${URLpath}/socket.io`, //Socket.IO URL
});

/* Ustawanienie domyślnych danych potrzebnych do funkcjonowania pasków */
const filePath = "/data/data.json";
let defaultData = {
	speed: 50,
	text: ["Paski szkolnego Studia Telewizyjnego - Zespół Szkół Technicznych"],
	isOpen: false,
	img: ["left-wing.png", "right-wing.png"],
};
let data = defaultData;

/* Jeśli jest to możliwe (zamontowanie stałego folderu na /data), odczytanie 
   danych z pliku /data/data.json i zastąpienie obiektu data, 
   natomiast jeśli plik nie istnieje, to stworzenie go i dodanie wartości domyślnych*/
fs.access(filePath, fs.constants.F_OK, (err) => {
	if (err) {
		log("Plik nie istnieje, tworzę nowy...");
		fs.writeFile(filePath, JSON.stringify(defaultData), (err) => {
			if (err) {
				log(`Błąd zapisu danych: ${err}`);
			} else {
				log("Plik utworzony i zapisany pomyślnie!");
			}
		});
	} else {
		log("Plik istnieje, odczytuję dane...");
		fs.readFile(filePath, "utf-8", (err, fileReadData) => {
			if (err) {
				log(`Błąd odczytu danych: ${err}`);
			} else {
				const jsonData = JSON.parse(fileReadData);
				data = jsonData;
				log(`Dane odczytane pomyślnie: ${JSON.stringify(data)}`);
			}
		});
	}
});

/* Ustawienie domyślnej prędkości poruszania się pasków
   (która wynosi ilość liter / 4) */
if (data.text.length > 0) {
	data.speed = Math.round(data.text.join("").length / 4 / 10) * 10;
	log(`Ustawiono prędkość pasków na: ${data.speed}`);
}

/* Funkcja wysyłająca logi */
function log(message) {
	let time = new Date().toLocaleTimeString("pl");
	console.log(`[${time}] ${message}`);
}

/* Ustawnienia połączeń Socket.IO */
io.on("connect", (socket) => {
	/* Odpowiednie wyświetlenie komunikatu otrzymanego od klienta */
	socket.on("c-log", (message) => {
		log(message);
	});

	/* Odpowiedź serwera na zapytanie klienta - prośba o wysłanie wszystkich danych */
	socket.on("req-data", () => {
		socket.emit("update-data", data);
	});

	/* Zapytanie, które wysyła klient, aby wysłać nową wartość prędkości przewijania
	   oraz ustawienie jej globalnie, wraz z wysłaniem potwierdzenia poprawności */
	socket.on("send-speed", (speed) => {
		if (speed && speed > 0 && speed <= 2500) {
			data.speed = speed;
			socket.emit("server-successfull-message", "Poprawnie zmieniono prędkość");
			log(`Poprawnie zmieniono prędkość: ${data.speed}`);
		} else {
			log(`Błąd przy ustawianiu prędkości: ${speed}`);
		}
	});

	/* Zapytanie, które wysyła klient, aby wysłać nowy array zawierający tekst, 
	   który ma być wyświetlany na paskach oraz ustawienie domyślnej szybkości */
	socket.on("send-text", (text) => {
		if (text) {
			data.text = text;
			data.speed = Math.round(data.text.join("").length / 4 / 10) * 10;
			socket.emit("update-data", data);
			socket.emit("server-successfull-message", "Poprawnie zmieniono tekst");
			log(`Poprawnie zmieniono tekst:`);
			log(data.text);
			log(`Zmieniono prędkość: ${data.speed}`);
			fs.writeFile(filePath, JSON.stringify(data), (err) => {
				if (err) {
					log(`Błąd zapisu danych: ${err}`);
				} else {
					log("Plik zaktualizowany pomyślnie!");
				}
			});
		} else {
			log(`Błąd w otrzymywaniu tekstu: ${text}`);
		}
	});

	/* Otrzymanie polecenia zmiany stanu wyświetlania pasków na widoczne 
	   oraz wymuszenie zmiany na obu stronach*/
	socket.on("open", () => {
		data.isOpen = true;
		socket.emit("server-successfull-message", "Uruchomiono napisy");
		socket.emit("update-data", data);
		log("Uruchomiono napisy");
	});

	/* Otrzymanie polecenia zmiany stanu wyświetlania pasków na ukryte 
	   oraz wymuszenie zmiany na obu stronach*/
	socket.on("close", () => {
		data.isOpen = false;
		socket.emit("server-successfull-message", "Zamknięto napisy");
		socket.emit("update-data", data);
		log("Zamknięto napisy");
	});

	/* Obsługa zapytania o stan widoczności pasków - zwraca true/false */
	socket.on("req-state", () => {
		socket.emit("res-state", data.isOpen);
	});

	/* Obsługa zapytania o ustawienie domyślnych grafik do pasków */
	socket.on("defaultImg", () => {
		data.img[0] = "left-wing.png";
		data.img[1] = "right-wing.png";
		log(`Zdjęcie lewe zaktualizowano pomyślnie: ${data.img[0]}`);
		log(`Zdjęcie prawe zaktualizowano pomyślnie: ${data.img[1]}`);
	});

	/* Umożliwia pobieranie aktualnego zdjęcia grafiki */
	socket.on("req-img", () => {
		socket.emit("res-img", data.img);
	});
});

/* Obsługa odbioru plików */
app.use(fileUpload());

/* Obsługa serwera WWW */
app.use(`${URLpath}/display`, express.static(path.join(__dirname, "display")));
app.use(`${URLpath}/manage`, express.static(path.join(__dirname, "manage")));
app.use(`${URLpath}`, express.static(path.join(__dirname, "menu")));
app.use(`${URLpath}/sources`, express.static(path.join(__dirname, "sources")));

/* Obsługa formularza z zdjęciami - odebranie pliku oraz ustawienie losowej nazwy, 
   zapisanie do katalogu oraz zmiana aktualnie wybranego zdjęcia */
app.post("/manage/upload-photo", (req, res) => {
	const left = req.files.left;
	const right = req.files.right;

	if (!left || !right) return res.sendStatus(400);

	const leftName = "l" + Math.round(Math.random() * 1000) + ".png";
	const rightName = "r" + Math.round(Math.random() * 1000) + ".png";
	left.mv("display/img/" + leftName);
	right.mv("display/img/" + rightName);
	data.img[0] = leftName;
	data.img[1] = rightName;

	io.on("connection", (socket) => {
		socket.broadcast.emit("RQ");
	});
	log(`Zdjęcie lewe zaktualizowane pomyślnie: ${data.img[0]}`);
	log(`Zdjęcie prawe zaktualizowane pomyślnie: ${data.img[1]}`);
	res.sendStatus(200);
});

/* Obsługa zapytań http, co umożliwia sterowanie widocznością za pomocą np. Stream Decka */

/* Zapytanie, które umożliwia zmianę stanu pasków na widoczne */
app.use(`${URLpath}/API/show`, (req, res) => {
	data.isOpen = true;
	res.status(200).json({ operation: "show", state: "success" });
	log(`Request API ustawienie pasków na widoczne`);
});

/* Zapytanie, które umożliwia zmianę stanu pasków na ukryte */
app.use(`${URLpath}/API/hide`, (req, res) => {
	data.isOpen = false;
	res.status(200).json({ operation: "hide", state: "success" });
	log(`Request API ustawienie pasków na ukryte`);
});

/* Uruchomienie serwera na podanym porcie */
server.listen(servicePort, () => {});
log(`Serwer Express działa na http://localhost:${servicePort}${URLpath}/manage i 
http://localhost:${servicePort}${URLpath}/display 
natomiast socket.io na http://localhost:${servicePort}${URLpath}/socket.io`);
