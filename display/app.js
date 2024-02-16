const app = Vue.createApp({
	data() {
		return {
			socket: null,
			animationDelay: 100,
			text: [
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
				"TEST321",
			],
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
		});
	},
	methods: {},
}).mount(".container");
