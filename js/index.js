var app = new Vue({
	el: '#app',
	data: {
		gameArr: [],
		channel: 'index',
		waitingIndex: -1,
		time: 30,
		timer: null,
		score: 0,
		goEnd: false,
		gameTime: 30,
		audio: {
			bg: 'audio/bg.mp3',
			lose: 'audio/lose.mp3',
			right: 'audio/right.mp3',
			win: 'audio/win.mp3',
			wrong: 'audio/wrong.mp3',
		},
		bgPlayer: null,
        soundPlayer: null,
        activeBgMusic: false,
	},
	watch: {
		score: function (val) {
			if (val >= 80) {
				this.endGame();
			}
		},
	},
	methods: {
		initGameArr: function () {
			let arr = [],
				count = 1;
			for (let index = 0; index < 20; index++) {
				arr.push({
					value: count,
					waiting: false,
					match: false,
				})
				count = (count >= 4) ? 1 : count + 1;
			}
			arr[17].value = 1;
			arr[18].value = 4;
			arr.sort(function () {
				return 0.5 - Math.random()
			});
			this.gameArr = arr;
		},
		startTimer: function () {
			let vm = this;
			this.timer = setInterval(function () {
				if (vm.time <= 0) {
					vm.endGame();
				} else {
					vm.time -= 1;
				}
			}, 1000)

		},
		endGame: function () {
			clearInterval(this.timer);
			this.goEnd = true;
			if (this.score >= 80) {
				this.channel = 'win';
				this.playAudio(this.audio.win,true)	
			} else {
				this.channel = 'lose';
				this.playAudio(this.audio.lose,true)	
				
			}

			// this.bgPlayer.pause();
			
		},
		startGame: function () {
			this.score = 0;
			this.time = this.gameTime;
			this.goEnd = false;
			this.waitingIndex = -1;
			this.initGameArr();
			this.startTimer();
			this.channel = 'game';
			
		},
		punish: function () {
			console.log('punish');
			this.time -= 2;
			if(this.time<=0){
				this.time = 0;
			}
			TweenMax.fromTo('.timeBox', 1, {
				color: 'red'
			}, {
				color: 'white'
			})
		},
		clickItem: function (indexNow) {
			let now = this.gameArr[indexNow];
			let prev = this.gameArr[this.waitingIndex];

			if (now.match) {
				return;
			}


			if (this.waitingIndex == -1) {

				// 第一個選
				now.waiting = true;
				this.waitingIndex = indexNow;

			} else {

				// 第二個選
				if (indexNow === this.waitingIndex) {
					// 選跟第一個一樣
					now.waiting = false;
					this.waitingIndex = -1;
					return;
				}

				// 選跟第一個不一樣
				if (now.value != prev.value) {
					this.waitingIndex = -1;
					prev.waiting = false;
					this.punish();
					this.playAudio(this.audio.wrong,false);
					
				} else {
					this.waitingIndex = -1;
					now.match = true;
					prev.match = true;
					prev.waiting = false;
					this.score += 10;

					this.playAudio(this.audio.right,false);
				}



			}

		},
		playAudio: function (src, stopBg) {
			if (stopBg) {
				this.bgPlayer.pause();
			}
			this.soundPlayer.src = src;
			this.soundPlayer.load();
			this.soundPlayer.play();
		},
		startBgAudio: function () {
			let bgp = this.bgPlayer;
			bgp.loop = true;
			bgp.currentTime = 0;
			bgp.play();
		},
		goIndex: function () {  
			this.startBgAudio();
			this.soundPlayer.pause();
			this.channel = 'index';
        },
        goInfo:function(){
            if(!this.activeBgMusic){
                this.startBgAudio();
                this.activeBgMusic = true;
            }else{
                this.channel='info';
            }
        }
	},
	created: function () {
		this.soundPlayer = new Audio();
		this.bgPlayer = new Audio(this.audio.bg);
		
	}
})