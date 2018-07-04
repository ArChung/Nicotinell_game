
var app = new Vue({
    el: '#app',
    data: {
      gameArr: [],
      channel: 'index',
      waitingIndex: -1,
      time: 30,
      timer: null,
      score: 0,
      goEnd : false,
      gameTime: 30,
    },
    watch: {
        score: function (val) {
            if(val>=80){
                this.endGame();
            }
        },
      },
    methods: {
        initGameArr: function(){
            let arr =[],count=1;
            for (let index = 0; index < 20; index++) {
                arr.push({
                    value: count,
                    waiting: false,
                    match:false,
                })
                count= (count>=4)?1:count+1;
            }
            arr[17].value = 1;
            arr[18].value = 4;
            arr.sort(function() { return 0.5 - Math.random() });
            this.gameArr = arr ;
        },
        startTimer : function(){
            let vm  = this ; 
            this.timer = setInterval(function(){
                if(vm.time<=0){
                    vm.endGame();
                }else{
                    vm.time-=1;
                }
            },1000)

        },
        endGame: function(){
            clearInterval(this.timer);
            this.goEnd = true;
            if(this.score>=80){
                this.channel = 'win';
            }else{
                this.channel = 'lose';
            }
        },
        startGame: function(){
            this.score = 0;
            this.time = this.gameTime;
            this.goEnd = false;
            this.waitingIndex = -1;
            this.initGameArr();
            this.startTimer();
            this.channel = 'game';
        },
        punish: function(){
            console.log('punish');
            this.time -= 2;
            TweenMax.fromTo('.timeBox',1,{color:'red'},{color:'white'})
        },
        clickItem: function(indexNow){
            let now = this.gameArr[indexNow];
            let prev = this.gameArr[this.waitingIndex];

            if(now.match){
                return;
            }


            if(this.waitingIndex==-1){
                
                // 第一個選
                now.waiting = true;
                this.waitingIndex = indexNow;
                
            }else{

                // 第二個選
                if(indexNow === this.waitingIndex){
                    // 選跟第一個一樣
                    now.waiting = false;
                    this.waitingIndex = -1;
                    return;
                }

                // 選跟第一個不一樣
                if(now.value!= prev.value){
                    this.waitingIndex = -1;
                    prev.waiting = false;
                    this.punish();
                }else{
                    this.waitingIndex = -1;
                    now.match = true;
                    prev.match = true;
                    prev.waiting = false;
                    this.score+=10
                }

                
                
            }

        }

    },
    created: function(){
    }
  })