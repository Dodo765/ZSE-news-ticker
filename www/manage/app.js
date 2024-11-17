/* Inicjalizacja frameworka VueJS */
const app = Vue.createApp({
	data() {
		return {
			socket: null,
			speed: 75,
            dots: true,
            logo: false,
			text: [""],
			isVisible: false,
		};
	},
	mounted() {
		/* Kod wykonuje się jeden raz po załadowaniu strony */

		/* Inicjalizacja połączenia z serwerem Socket.IO */
		const URL = window.location.origin
		let fullpath = window.location.pathname
		let loc = fullpath.indexOf("/manage/")
		const PATH = fullpath.slice(0, loc)
		this.socket = io(URL, {
			path: `${PATH}/socket.io`,
		})

		this.socket.on('connect', () => {
            this.socket.emit('join-manage')
            console.log('Connected!')
            this.popup('good', 'Połączono')
        })
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected!')
            this.popup('bad', 'Utracono połączenie')
        })

        this.socket.on('init',(options)=>{
            this.speed = options.speed
            this.logo = options.logo
            this.text = options.text
            this.isVisible = options.isVisible
        })

        this.socket.on('updateSpeed', (speed) => {
            this.speed = speed
        })

        this.socket.on('updateText', (text) => {
            this.text = text
        })

        this.socket.on('updateLogo', (logo) => {
            this.logo = logo
        })

        this.socket.on('updateDots', (dots) => {
            this.dots = dots
        })

        this.socket.on('show', () => {
            this.popup('info','Wyświetlono pasek')
        })

        this.socket.on('hide', () => {
            this.popup('info','Ukryto pasek')
        })
        

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
    watch: {
        speed(newVal)
        {
            console.log(`speed = ${newVal}`)
            this.popup('info', 'Zaktualizowano prędkość przesuwania')
        },
        logo(newVal)
        {
            console.log(`logo = ${newVal}`)
            this.popup('info', 'Zaktualizowano wyświetlanie logotypu')
        },
        text()
        {
            console.log(`Updated text`)
            this.popup('info', 'Zaktualizowano wyświetlane napisy')
        }
    },
	methods: {
		/* Funkcja automatycznie próbuje dostosować wysokość textarea
		   do ilości tekstu (funkcja eksperymentalna */
		textareaHeight() {
			const textareaEle = document.querySelectorAll(".textarea");
			textareaEle.forEach((textarea) => {
				textarea.style.height = "auto";
				textarea.style.height = `${textarea.scrollHeight}px`;
			});
		},

		popup(type, message) {
            let icon
            switch(type) {
                case 'good':
                    icon = 'fa-check-circle'
                    break
                case 'bad':
                    icon = 'fa-times-circle'
                    break
                case 'info':
                default:
                    icon = 'fa-info-circle'
                    break
            }
            document.querySelector('#popup .icon').classList.toggle(icon)
            document.querySelector('#popup .message').innerHTML = message
            document.querySelector('#popup').classList.toggle('active')
            setTimeout(() => {
                document.querySelector('#popup').classList.toggle('active')
            }, 2000);
            setTimeout(() => {
                document.querySelector('#popup .icon').classList.toggle(icon)
            }, 2750);
        },

        setLogo() {
            this.socket.emit('updateLogo',this.logo)
        },

        setDots() {
            this.socket.emit('updateDots', this.dots)
        },

        uploadLogo() {
            let selectedFile = document.querySelector('input#logofile').files[0]
            if(typeof selectedFile == "undefined")
            {
                alert("Należy wcześniej wybrać plik")
                return
            }
            console.log('Uploading new logo')
            this.socket.emit('uploadLogo', selectedFile, (status)=>{
                console.log("Logo upload: "+status.message)
                if(status.message == "success") this.popup('good', 'Pomyślnie zaktualizowano logotyp')
                else if (status.message == "forbidden") this.popup('bad', 'Aktualizacja logotypu możliwa jedynie z sieci szkolnej')
                else this.popup('bad', 'Wystąpił błąd podczas aktualizacji logotypu')
            })
        },

        setFileName() {
            let selectedfile = document.querySelector('input#logofile').files[0]
            document.querySelector('span#filename').innerHTML = typeof selectedfile !== "undefined" ? selectedfile.name : ""
        },

		/* Funkcja, która obsługuje ukrycie pasków */
		hide() {
            this.isVisible = false
			this.socket.emit("hide")
		},

		/* Funkcja, która obsługuje pokazanie pasków */
		show() {
            this.isVisible = true
			this.socket.emit("show")
		},

		/* Funkcja sprawdzająca poprawność tekstu i wysyłająca go do serwera */
		setText() {
			if (this.text) {
				this.socket.emit("updateText", this.text)
			}
		},

		/* Obsługa wysłania prędkości do serwera */
		setSpeed() {
			if (this.speed && this.speed > 0 && this.speed < 2500) {
				document.querySelector("input").blur()
				this.socket.emit("updateSpeed", this.speed)
            }
		},

		/* Stworzenie nowego wiersza tekstu (nowego akapitu) */
		addText() {
			this.text.push("")
		},

		/* Usunięcie wiersza z tekstu o podanym indexie */
		delText(index) {
			this.text.splice(index, 1)
		},
	},
}).mount(".container");
