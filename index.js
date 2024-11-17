//NEWS TICKERS
const express = require("express")
const app = express()
const PORT = process.env.PORT || 8080
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    maxHttpBufferSize: 1e9
});
const fs = require('fs')
const path = require('path')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
require("dotenv").config();

/* Zaczytanie zmiennych ENV */
const apiFullUrl = process.env.apiUrl

let options = {
	speed: 75,
    logo: false,
    dots: true,
	text: [
		"Paski informacyjne Szkolnego Studia Telewizyjnego w Zespole Szkół Elektronicznych",
		"Paski informacyjne Szkolnego Studia Telewizyjnego w Zespole Szkół Elektronicznych",
	],
	isVisible: false,
}

try {
    options = JSON.parse(fs.readFileSync('config.json', 'utf8'))
} catch (e) {
    console.error('Błąd podczas pobierania danych z pliku \'config.json\'!')
}

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Dokumentacja API',
			version: '1.0.0',
			description:
				'Pełna dokumentacja API dla ZSE NT. Kody błędów zapisane w dokumentacji dotyczą jedynie problemów wewętrznych aplikacji i nie obejmują błędów z komunikacją (standardowe HTTP Error Codes)',
		},
        tags: [
			{
				name: 'PASKI',
			},
			{
				name: 'LOGO PARTNERA',
			},
			{
				name: 'KROPKI',
			},
		],
		servers: [
			{
				url: `${apiFullUrl}`, // Serwer API
			},
		],
	},
	apis: ['./swagger.js'], // Ścieżka do pliku, gdzie są endpointy
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)
app.use(`/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// API
app.use(`/api/show`, (req, res) => {
	options.isVisible = true;
    io.emit("show");
    log(`Show scrollbar`)
	res.status(200).json({ message: "Poprawnie pokazano paski"});
});

app.use(`/api/hide`, (req, res) => {
	options.isVisible = false;
        io.emit("hide");
        log(`Hide scrollbar`)
	res.status(200).json({ message: "Poprawnie ukryto paski"});
});

app.use(`/api/logo/show`, (req, res) => {
    logo = true
	options.logo = logo
    log(`logo = ${logo}`)
    io.emit("updateLogo", logo)
	res.status(200).json({ message: "Poprawnie ukryto logo partnera"});
});

app.use(`/api/logo/hide`, (req, res) => {
    logo = false
	options.logo = logo
    log(`logo = ${logo}`)
    io.emit("updateLogo", logo)
	res.status(200).json({ message: "Poprawnie ukryto logo partnera"});
});

app.use(`/api/dots/show`, (req, res) => {
    dots = true
	options.dots = dots
    log(`dots = ${dots}`)
    io.emit("updateDots", dots)
	res.status(200).json({ message: "Poprawnie ukryto kropki między paskami"});
});

app.use(`/api/dots/hide`, (req, res) => {
    dots = false
	options.dots = dots
    log(`dots = ${dots}`)
    io.emit("updateDots", dots)
	res.status(200).json({ message: "Poprawnie ukryto kropki między paskami"});
});

app.use(express.static('www'))

io.on("connection", (socket) => {

    socket.emit('init',options)

    socket.on('join-display', () => {
        log('DISPLAY')
        socket.join('display')
    })

    socket.on('join-manage', () => {
        log('MANAGE')
    })

    socket.on("updateSpeed", (speed) => {
        options.speed = Math.abs(speed) || 75
        log(`speed = ${speed}`)
        io.emit('updateSpeed', speed)
    })

    socket.on("updateText", (text) => {
        options.text = text
        options.speed = calculateSpeedTime()
        log(`Updated texts`)
        io.emit("updateText", text)
        io.emit('updateSpeed', options.speed)
    })

    socket.on("updateLogo", (logo) => {
        options.logo = logo
        log(`logo = ${logo}`)
        io.emit("updateLogo", logo)
    })

    socket.on("updateDots", (dots) => {
        options.dots = dots
        log(`logo = ${dots}`)
        io.emit("updateDots", dots)
    })

    socket.on('uploadLogo', (file, callback) => {
        fs.writeFile(path.join("www","display","img","logo_partnera.png"), file, (err) =>
        {
            callback({ message: err ? "failure" : "success"})
            if(err) {
                log("Plansza upload failed: " + err)
            } else {
                log("Plansza upload success")
            }

        })
        io.to('display').emit('uploadLogo')
    })

    socket.on("show", () => {
        options.isVisible = true;
        io.emit("show");
        log(`Show scrollbar`)
    })
    socket.on("hide", () => {
        options.isVisible = false;
        io.emit("hide");
        log(`Hide scrollbar`)
    })
})

function log(message) {
    let time = new Date().toLocaleTimeString('pl')
    console.log(`[${time}] ${message}`)
}

function calculateSpeedTime()
{
    return Math.round(options.text.join("").length / 4 / 10) * 10;
}

server.listen(PORT, () => {
    log(`Listening on port ${PORT}`)
})