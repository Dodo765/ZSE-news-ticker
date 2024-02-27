/* Inicjalizacja frameworka VueJS */
const app = Vue.createApp({
	data() {
		return {
			/* Ustawienie domyślnych wartości */
			socket: null,
			animationDelay: 100,
			text: [""],
			isOpen: false,
		};
	},
	mounted() {
		/* Kod wykonuje się jeden raz po załadowaniu strony */

		/* Inicjalizacja połączenia z serwerem Socket.IO */
		const URL = window.location.origin;
		let fullpath = window.location.pathname;
		let loc = fullpath.indexOf("/manage/");
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

		/* Funkcje uruchamiane, gdy połączenie się uruchomi pomyślnie */
		this.socket.on("connect", () => {
			console.log("Wersja: 1.1");

			/* Wyświetlenie powiadomienia o pomyślny połączeniu z serwerem Socket.IO */
			this.statusPopup("Połączono", true, 1000);

			/* Wysłanie zapytania do serwera z poleceniem wysłania wszystkich danych
			   (opóźnienie wynika z przyczyn technicznych) */
			setTimeout(() => {
				this.socket.emit("req-data");
			}, 1);

			/* Cykliczne wysyłanie zapytań o wysłanie aktualnego stanu widoczności strony */
			setInterval(() => {
				this.socket.emit("req-state");
			}, 500);

			/* Obsługa wyświetlania powiadomień nadanych od strony serwera (zakończonych sukcesem) */
			this.socket.on("server-successfull-message", (message) => {
				this.statusPopup(message, true);
			});

			/* Obsługa wyświetlania powiadomień nadanych od strony serwera (zakończonych niepowodzeniem) */
			this.socket.on("server-failed-message", (message) => {
				this.statusPopup(message, false);
			});

			/* Odbieranie wszystkich danych nadanych od strony serwera */
			this.socket.on("update-data", (data) => {
				if (data) {
					this.text = data.text;
					this.animationDelay = data.speed;
					this.isOpen = data.isOpen;
					/* Przy odebraniu nowych danych, funkcja automatycznie próbuje dostosować 
					   wysokość textarea do ilości tekstu (funkcja eksperymentalna) */
					setTimeout(() => {
						this.textareaHeight();
					}, 1);
				}
			});

			/* Obsługa odbierania aktualnego stanu widoczności strony */
			this.socket.on("res-state", (state) => {
				this.isOpen = state;
			});
		});

		/* Funkcja automatycznie próbuje dostosować wysokość textarea
		   do ilości tekstu (funkcja eksperymentalna) */
		document.addEventListener("DOMContentLoaded", () => {
			const textareaEle = document.querySelectorAll(".textarea");
			textareaEle.forEach((textarea) => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight + 40}px`;
				textarea.addEventListener("input", () => {
					textarea.style.height = "auto";
					textarea.style.height = `${textarea.scrollHeight}px`;
				});
			});
		});
	},
	methods: {
		/* Miejsce, w którym Vue przechowuje wszystkie funkcje dostępne
		   do wywołania z poziomu całej strony */

		/* Funkcja automatycznie próbuje dostosować wysokość textarea
		   do ilości tekstu (funkcja eksperymentalna */
		textareaHeight() {
			const textareaEle = document.querySelectorAll(".textarea");
			textareaEle.forEach((textarea) => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			});
		},

		/* Wyświetlenie powiadomienia udanej i nieudanej akcji, za co odpowiana parametr isOk */
		async statusPopup(message, isOk, time) {
			if (time == undefined) time = 2500;
			let pop = document.querySelector("#popup");
			let icon = document.querySelector(".status-icon");
			let mes = document.querySelector(".status-message");
			mes.textContent = message;
			if (isOk == true) {
				icon.src = "img/status-ok.png";
				if (pop.classList.contains("hidden")) {
					pop.classList.remove("hidden");
					setTimeout(() => {
						pop.classList.add("hidden");
					}, time);
				}
			} else {
				icon.src = "img/status-warning.png";
				if (pop.classList.contains("hidden")) {
					pop.classList.remove("hidden");
					setTimeout(() => {
						pop.classList.add("hidden");
					}, time);
				}
			}
		},

		/* Funkcja, która obsługuje ukrycie pasków */
		close() {
			this.socket.emit("close");
		},

		/* Funkcja, która obsługuje pokazanie pasków */
		open() {
			this.socket.emit("open");
		},

		/* Funkcja sprawdzająca poprawność tekstu i wysyłająca go do serwera */
		setText() {
			if (this.text) {
				console.log("text-send");
				this.socket.emit("send-text", this.text);
			}
		},

		/* Obsługa wysłania prędkości do serwera */
		setSpeed() {
			if (this.animationDelay && this.animationDelay > 0 && this.animationDelay < 1000) {
				document.querySelector("input").blur();
				this.socket.emit("send-speed", this.animationDelay);
			}
		},

		/* Stworzenie nowego wiersza tekstu (nowego akapitu) */
		addText() {
			this.text.push("");
		},

		/* Usunięcie wiersza z tekstu o podanym indexie */
		delText(index) {
			this.text.splice(index, 1);
		},
	},
}).mount(".container");
