$(document).ready(function() {
    var range = 200; // [0..range] max 999
    var completed = 0,
        posArr = [
            360, //number 0
            0, //number 1
            3240, //number 2
            2880, //number 3
            2520, //number 4
            2160, //number 5
            1800, //number 6
            1440, //number 7
            1080, //number 8
            720, //number 9
        ];

    window.luckyNumber = getLuckyNumber();
    console.log('Lucky Number:', window.luckyNumber);

    function getLuckyNumber() {
        var fillZero = function(number, digits){  
            number = String(number);  
            var length = number.length;  
            if(number.length<digits){  
                for(var i=0;i<digits-length;i++){  
                    number = "0"+number;  
                }  
            }  
            return number;  
        }
        return fillZero(Math.floor(Math.random() * range), 3);
    }
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot

        $(el).pan({
            fps:30,
            dir:'down'
        });
        $(el).spStop();
    }

    Slot.prototype.start = function() {
        var _this = this;
        $(_this.el).addClass('motion');
        $(_this.el).spStart();
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    Slot.prototype.stop = function(position) {
        var _this = this,
            limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            if(_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            if(_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass('motion');
                _this.speed = 0;
            }
        }, 100);
    };

    Slot.prototype.finalPos = function() {
        var el = this.el;
        var currentIndex = (window.luckyNumber + "")[completed];
        var currentPosition = posArr[parseInt(currentIndex)];
        position = "0 " + currentPosition + "px";
        $(el).animate({
            backgroundPosition:"(" + position + ")"
        }, {
            duration: 200
        });
        completed ++
    };
    
    Slot.prototype.reset = function() {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        this.speed = 0;
        completed = 0;
        $(this.el).animate({
            backgroundPosition: "(0 360px)"
        }, {
            duration: 1000,
            complete: null
        });
    };

    //create slot objects
    var a = new Slot('#slot1', 45, 2, []),
    b = new Slot('#slot2', 70, 4, []),
    c = new Slot('#slot3', 100, 6, []);

    function handleController() {
        var x;
        if ($('.control').hasClass('start')) {
            $('.control').removeClass('start').addClass('stop');
            a.start();
            b.start();
            c.start();
        } else if ($('.control').hasClass('stop')) {
            $('.control').removeClass('stop').addClass('reset');
            window.setTimeout(function () {
                a.stop();
                window.setTimeout(function () {
                    b.stop();
                    window.setTimeout(function () {
                        c.stop();
                    }, 5 * 100)
                }, 5 * 100)
            }, 1 * 100)
        } else if ($('.control').hasClass('reset')) {
            $('.control').removeClass('reset').addClass('start');
            a.reset();
            b.reset();
            c.reset();

            window.luckyNumber = getLuckyNumber();
            console.log('Lucky Number:', window.luckyNumber);
        }
    }

   
    $('.control').click(handleController);
    $(document).keyup(function (e) {
        if (e.keyCode === 13 || e.keyCode === 32) {
            handleController()
        }
    });
});
