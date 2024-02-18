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
		let loc = fullpath.indexOf("/display/");
		const PATH = fullpath.slice(0, loc);

		//logo
		// 	console.log(`	 _____                  _       _ _
		// |  __ \\                (_)     (_) |
		// | |  | | ___  _ __ ___  _ _ __  _| | __
		// | |  | |/ _ \\| '_ \` _ \\| | '_ \\| | |/ /
		// | |__| | (_) | | | | | | | | | | |   <
		// |_____/ \\___/|_| |_| |_|_|_| |_|_|_|\\_\\
		// | |/ /                  | |
		// | ' / __ ___      ____ _| | ___  ___
		// |  < / _\` \\ \\ /\\ / / _\` | |/ _ \\/ __|
		// | . \\ (_| |\\ V  V / (_| | |  __/ (__
		// |_|\\_\\__,_| \\_/\\_/_\\__,_|_|\\___|\\___|__
		// |  __ \\          | |   |____  / /| ____|
		// | |  | | ___   __| | ___   / / /_| |__
		// | |  | |/ _ \\ / _\` |/ _ \\ / / '_ \\___ \\
		// | |__| | (_) | (_| | (_) / /| (_) |__) |
		// |_____/ \\___/ \\__,_|\\___/_/  \\___/____/ `);

		this.socket = io(URL, {
			path: `${PATH}/socket.io`,
		});

		this.socket.on("connect", () => {
			console.log("Socket ID:" + this.socket.id);
			// console.log("Wersja: 1.1");

			this.socket.emit("req-data");
			this.socket.on("update-data", (text, delay, isOpen) => {
				if (this.text != text) this.text = text;
				if (this.animationDelay != delay) this.animationDelay = delay;
				if (this.isOpen != isOpen) this.isOpen = isOpen;
			});

			setInterval(() => {
				this.socket.emit("req-data");
			}, 1000);
		});
		setTimeout(() => {
			document.querySelector(".startup").classList.remove("startup");
		}, 1000);
	},
	watch: {
		isOpen(newVal) {
			if (newVal) {
				this.open();
			} else {
				this.close();
			}
		},
	},
	methods: {
		close() {
			const con = document.querySelector(".container");
			if (con.classList.contains("open")) con.classList.remove("open");
			if (!con.classList.contains("closed")) con.classList.add("closed");
		},
		open() {
			const con = document.querySelector(".container");
			if (con.classList.contains("closed")) con.classList.remove("closed");
			if (!con.classList.contains("open")) con.classList.add("open");
		},
	},
}).mount(".container");
