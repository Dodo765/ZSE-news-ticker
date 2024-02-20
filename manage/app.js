const app = Vue.createApp({
	data() {
		return {
			socket: null,
			animationDelay: 100,
			text: [""],
			isOpen: false,
		};
	},
	mounted() {
		const URL = window.location.origin;
		let fullpath = window.location.pathname;
		let loc = fullpath.indexOf("/manage/");
		const PATH = fullpath.slice(0, loc);

		//logo
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

		this.socket = io(URL, {
			path: `${PATH}/socket.io`,
		});

		this.socket.on("connect", () => {
			//console.log("Socket ID:" + this.socket.id);
			console.log("Wersja: 1.0");
			this.statusPopup("Połączono", true, 1000);

			setTimeout(() => {
				this.socket.emit("req-data");
			}, 1);
			setInterval(() => {
				this.socket.emit("req-state");
			}, 1000);
			this.socket.on("server-successfull-message", (message) => {
				this.statusPopup(message, true);
			});
			this.socket.on("server-failed-message", (message) => {
				this.statusPopup(message, false);
			});
			this.socket.on("update-data", (text, delay, isOpen) => {
				this.text = text;
				this.animationDelay = delay;
				this.isOpen = isOpen;
				setTimeout(() => {
					this.textareaHeight();
				}, 1);
			});
			this.socket.on("res-state", (state) => {
				this.isOpen = state;
			});
		});

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
		textareaHeight() {
			const textareaEle = document.querySelectorAll(".textarea");
			textareaEle.forEach((textarea) => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			});
		},
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
		close() {
			this.socket.emit("close");
		},
		open() {
			this.socket.emit("open");
		},
		setText() {
			if (this.text.length > 0 && this.text != undefined && this.text != null) {
				console.log("text-send");
				this.socket.emit("send-text", this.text);
			}
		},
		setSpeed() {
			if (
				this.animationDelay > 0 &&
				this.animationDelay < 1000 &&
				this.animationDelay != undefined &&
				this.animationDelay != null
			) {
				document.querySelector("input").blur();
				this.socket.emit("send-speed", this.animationDelay);
			}
		},
		addText() {
			this.text.push("");
		},
		delText(index) {
			this.text.splice(index, 1);
		},
	},
}).mount(".container");
