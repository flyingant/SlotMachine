/**
* Slot machine
* Author: Saurabh Odhyan | http://odhyan.com
*
* Licensed under the Creative Commons Attribution-ShareAlike License, Version 3.0 (the "License")
* You may obtain a copy of the License at
* http://creativecommons.org/licenses/by-sa/3.0/
*
* Date: May 23, 2011 
*/
$(document).ready(function() {
    /**
    * Global variables
    */
    var completed = 0,
      imgHeight = 3591,
        posArr = [
            0, //number 1
            360, //number 2
            720, //number 3
            1080, //number 4
            1440, //number 5
            1800, //number 6
            2160, //number 7
            2520, //number 8
            2880, //number 9
            3240, //number 0
        ];

    /**
    * @class Slot
    * @constructor
    */
    function Slot(el, max, step, ignore) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot
        this.ignore = ignore; // ignore the numbers

        $(el).pan({
            fps:30,
            dir:'down'
        });
        $(el).spStop();
    }

    /**
    * @method start
    * Starts a slot
    */
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

    /**
    * @method stop
    * Stops a slot
    */
    Slot.prototype.stop = function() {
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

    /**
    * @method finalPos
    * Finds the final position of the slot
    */
    Slot.prototype.finalPos = function() {
        var el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            j,
            k;

        el_id = $(el).attr('id');
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        pos = parseInt(pos, 10);

        for(i = 0; i < posArr.length; i++) {
            for(j = 0;;j++) {
                k = posArr[i] + (imgHeight * j);
                if(k > pos) {
                    if((k - pos) < posMin) {
                        posMin = k - pos;
                        best = k;
                        this.pos = posArr[i]; //update the final position of the slot
                    }
                    break;
                }
            }
        }

        best += imgHeight + 1;
        bgPos = "0 " + best + "px";
        $(el).animate({
            backgroundPosition:"(" + bgPos + ")"
        }, {
            duration: 200,
            complete: function() {
                completed ++;
            }
        });
    };
    
    /**
    * @method reset
    * Reset a slot to initial state
    */
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

    /**
    * Slot machine controller
    */
    function enableControl() {
        $('.control').attr("disabled", false);
    }

    function disableControl() {
        $('.control').attr("disabled", true);
    }

    function handleController() {
        var x;
        if ($('.control').hasClass('start')) {
            $('.control').removeClass('start').addClass('stop');
            a.start();
            b.start();
            c.start();
            disableControl(); //disable control until the slots reach max speed
            //check every 100ms if slots have reached max speed
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if ($('.control').hasClass('stop')) {
            $('.control').removeClass('stop').addClass('reset');
            window.setTimeout(function () {
                a.stop();
                window.setTimeout(function () {
                    b.stop();
                    window.setTimeout(function () {
                        c.stop();
                    }, 6 * 1000)
                }, 3 * 1000)
            }, 1 * 100)

            disableControl(); //disable control until the slots stop

            //check every 100ms if slots have stopped
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if ($('.control').hasClass('reset')) {
            $('.control').removeClass('reset').addClass('start');
            a.reset();
            b.reset();
            c.reset();
        }
    }

    $('.control').click(handleController);
    $(document).keyup(function (e) {
        if (e.keyCode === 13) {
            handleController()
        }
    });
});
