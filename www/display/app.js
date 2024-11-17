/* Inicjalizacja frameworka VueJS */
const app = Vue.createApp({
	data() {
		return {
			socket: null,
			speed: 75,
            logo: false,
            dots: true,
			text: [""],
			isVisible: false,
		};
	},
	mounted() {
		/* Kod wykonuje się jeden raz po załadowaniu strony */

		/* Inicjalizacja połączenia z serwerem Socket.IO */
		const URL = window.location.origin
		let fullpath = window.location.pathname
		let loc = fullpath.indexOf("/display/")
		const PATH = fullpath.slice(0, loc)
		this.socket = io(URL, {
			path: `${PATH}/socket.io`,
		})

        this.socket.on('connect', () => {
            this.socket.emit('join-display')
        })

		this.socket.on("init", (options) => {
            this.speed = options.speed
            this.text = options.text
            this.logo = options.logo
            this.isVisible = options.isVisible
            console.log('Display inited!')
		});

        this.socket.on('show',() => {
            this.isVisible = true
            console.log('Bar shown!')
        })

        this.socket.on('hide',() => {
            this.isVisible = false
            console.log('Bar hidden!')
        })

        this.socket.on('updateText',(text) => {
            this.text = text
            console.log('Text updated!')
        })

        this.socket.on('updateSpeed',(speed) => {
            this.speed = speed
            console.log(`speed = ${speed}`)
        })

        this.socket.on('updateLogo',(logo) => {
            this.logo = logo
            console.log(`logo = ${logo}`)
        })

        this.socket.on('updateDots', (dots) => {
            this.dots = dots
            console.log(`dots = ${dots}`)
        })

        this.socket.on('uploadLogo',() => {
            console.log(`Logo updated!`)
            document.querySelector('.right-panel img').src = 'img/logo_partnera.png' + "?" + new Date().getTime()
        })
	},
	watch: {
		/* Ta funkcja będzie się wykonywać zawsze, gdy zmienna isOpen
		   zmieni swoją wartość - odpowiednio zmienianiąc stan widoczności pasków */
		isVisible(newVal) {
			if (newVal) {
				this.show();
			} else {
				this.hide();
			}
		},

        logo(newVal)
        {
            if(newVal)
            {
                this.showLogo()
            }
            else
            {
                this.hideLogo()
            }
        }
	},
	methods: {
		/* Miejsce, w którym Vue przechowuje wszystkie funkcje dostępne
		   do wywołania z poziomu całej strony */

		/* Funkcja, która obsługuje ukrycie pasków */
		hide() {
			const con = document.querySelector(".bar");
			if (con.classList.contains("shown")) con.classList.remove("shown");
			if (!con.classList.contains("hidden")) con.classList.add("hidden");
		},

		/* Funkcja, która obsługuje pokazanie pasków */
		show() {
			const con = document.querySelector(".bar");
			if (con.classList.contains("hidden")) con.classList.remove("hidden");
			if (!con.classList.contains("shown")) con.classList.add("shown");
		},

        hideLogo()
        {
            const con = document.querySelector(".right-panel img");
			con.classList.add("disable");
        },

        showLogo()
        {
            const con = document.querySelector(".right-panel img");
			con.classList.remove("disable");
        }
	},
}).mount(".container");
