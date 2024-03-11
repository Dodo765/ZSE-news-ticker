/* Inicjalizacja frameworka VueJS */
const app = Vue.createApp({
	data() {
		return {
			/* Ustawienie domyślnych wartości */
			socket: null,
			animationDelay: 100,
			text: [""],
			isOpen: false,
			img: ["left-wing.png", "right-wing.png"],
		};
	},
	mounted() {
		/* Kod wykonuje się jeden raz po załadowaniu strony */

		/* Inicjalizacja połączenia z serwerem Socket.IO */
		const URL = window.location.origin;
		let fullpath = window.location.pathname;
		let loc = fullpath.indexOf("/display/");
		const PATH = fullpath.slice(0, loc);
		this.socket = io(URL, {
			path: `${PATH}/socket.io`,
		});

		/* Wyświetlenie małej reklamy :) */
		console.log(`		 _____                  _       _ _
		|  __ \\                (_)     (_) |
		| |  | | ___  _ __ ___  _ _ __  _| | __
		| |  | |/ _ \\| '_ \` _ \\| | '_ \\| | |/ /
		| |__| | (_) | | | | | | | | | | |   <
		|_____/ \\___/|_| |_| |_|_|_| |_|_|_|\\_\\
		| |/ /                  | |
		| ' / __ ___      ____ _| | ___  ___
		|  < / _\` \\ \\ /\\ / / _\` | |/ _ \\/ __|
		| . \\ (_| |\\ V  V / (_| | |  __/ (__
		|_|\\_\\__,_| \\_/\\_/_\\__,_|_|\\___|\\___|__
		|  __ \\          | |   |____  / /| ____|
		| |  | | ___   __| | ___   / / /_| |__
		| |  | |/ _ \\ / _\` |/ _ \\ / / '_ \\___ \\
		| |__| | (_) | (_| | (_) / /| (_) |__) |
		|_____/ \\___/ \\__,_|\\___/_/  \\___/____/ 
		`);

		/* Wyślij informacje o nowym połączeniu */
		this.socket.emit("c-log", "Połączono ze stroną Display");

		/* Funkcje uruchamiane, gdy połączenie się uruchomi pomyślnie */
		this.socket.on("connect", () => {
			this.log(`Podłączono z serwerem Socket.IO`);
			this.log("Wersja: 1.2");

			/* Wysłanie zapytania do serwera z poleceniem wysłania wszystkich danych
			   (opóźnienie wynika z przyczyn technicznych) */
			setTimeout(() => {
				this.socket.emit("req-data");
			}, 1);

			/* Cykliczne wysyłanie zapytań o wysłanie aktualnego stanu widoczności strony */
			setInterval(() => {
				this.socket.emit("req-data");
			}, 500);

			/* Odbieranie wszystkich danych nadanych od strony serwera */
			this.socket.on("update-data", (data) => {
				if (data) {
					if (this.text != data.text) this.text = data.text;
					if (this.animationDelay != data.speed) this.animationDelay = data.speed;
					if (this.isOpen != data.isOpen) this.isOpen = data.isOpen;
					if (this.img != data.img) this.img = data.img;
				}
			});
		});
	},
	watch: {
		/* Ta funkcja będzie się wykonywać zawsze, gdy zmienna isOpen
		   zmieni swoją wartość - odpowiednio zmienianiąc stan widoczności pasków */
		isOpen(newVal) {
			if (newVal) {
				this.open();
			} else {
				this.close();
			}
		},
	},
	methods: {
		/* Miejsce, w którym Vue przechowuje wszystkie funkcje dostępne
		   do wywołania z poziomu całej strony */

		/* Obsługa logów */
		log(message) {
			let time = new Date().toLocaleTimeString("pl");
			console.log(`[${time}] ${message}`);
		},

		/* Funkcja, która obsługuje ukrycie pasków */
		close() {
			const con = document.querySelector(".container");
			if (con.classList.contains("open")) con.classList.remove("open");
			if (!con.classList.contains("closed")) con.classList.add("closed");
			this.log("Ukryto paski");
		},

		/* Funkcja, która obsługuje pokazanie pasków */
		open() {
			const con = document.querySelector(".container");
			if (con.classList.contains("closed")) con.classList.remove("closed");
			if (!con.classList.contains("open")) con.classList.add("open");
			this.log("Pokazano paski");
		},
	},
}).mount(".container");
