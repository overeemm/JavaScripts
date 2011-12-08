var overeemm = window.overeemm || {};
overeemm.conway = overeemm.conway || {};

overeemm.conway.Life = function (canvas) {
    
    var elem = document.getElementById(canvas);
    var canvascontext = elem.getContext('2d');
    var width = elem.getAttribute('width');
    var height = elem.getAttribute('height');
    var state = {};
    
    var initState = function () {
         
        for(var x = 0; x < width; x++) {
            state[x] = {};
            for(var y = 0; y < height; y++) {
                state[x][y] = '0';
            }
        }
    };
    
    var init = function() {
      
        initState();
        
        var pattern = elem.getAttribute('data-startpattern');
        console.log('initial pattern '+pattern);
        var startingpoints = pattern.split(';');
        for(var i = 0; i < startingpoints.length; i++){
            var x = startingpoints[i].split(',')[0];
            var y = startingpoints[i].split(',')[1];
            console.log('init pixel ('+x+','+y+')');
            state[x-1][y-1] = '1';
        }
    };
    
    var show = function () {
        console.log('current state');
        console.log(state);
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                console.log(state[x][y] === '1');
                canvascontext.fillStyle = (state[x][y] === '0') ? "rgb(0,0,0)" : "rgb(1,1,1)";
                canvascontext.fillRect(x, y, 1, 1);
            }
        }
    };
    
    var life = {
        show : function () { show(); return life; },
        init: function () { init(); return life; }
    };
    
    return life;
};