var overeemm = window.overeemm || {};

overeemm.log = function(debug) {
    return function (msg) { 
        if(debug) {
            console.log(msg); 
        }
    };
};

overeemm.conway = overeemm.conway || {};

overeemm.conway.Life = function (canvas) {
    
    var elem = document.getElementById(canvas);
    var pattern = elem.getAttribute('data-startpattern');
    var blocksize = elem.getAttribute('data-blocksize');
    var steptime = elem.getAttribute('data-steptime');
    var debug = elem.getAttribute('data-debug');
    
    var log = overeemm.log(debug === '1');
    
    var canvascontext = elem.getContext('2d');
    var width = elem.getAttribute('width') / blocksize;
    var height = elem.getAttribute('height') / blocksize;
    var state = [];
    var running = false;
    
    var initState = function () {
        state = [];
        for(var x = 0; x < width; x++) {
            state[x] = [];
            for(var y = 0; y < height; y++) {
                state[x][y] = '0';
            }
        }
    };
    
    var getLiveNeighbours = function (oldstate, x, y) {
        var nr = 0;
        for(var xx = Math.max(0, x-1); xx < Math.min(width, x+2); xx++)
            for(var yy = Math.max(0, y-1); yy < Math.min(height, y+2); yy++)                   
                if((xx !== x || yy !== y) && oldstate[xx][yy] === '1')
                    nr++;
     
        return nr;
    };
    
    var shouldLive = function (oldstate, x, y) {
        
        var live = false;
        var nrofliveneighbours = getLiveNeighbours(oldstate, x, y);
        /// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if(oldstate[x][y] === '1' && nrofliveneighbours < 2)
            live = false;
        /// Any live cell with two or three live neighbours lives on to the next generation.
        if(oldstate[x][y] === '1' && (nrofliveneighbours === 2 || nrofliveneighbours === 3))
            live = true;
        /// Any live cell with more than three live neighbours dies, as if by overcrowding.
        if(oldstate[x][y] === '1' && nrofliveneighbours > 3)
            live = false;
        /// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction
        if(oldstate[x][y] === '0' && nrofliveneighbours === 3)
            live = true;
        return live;
    };
    
    var step = function () {
        log('step begin');
        var newstate = [];
        
        for(var x = 0; x < width; x++) {
            newstate[x] = [];
            for(var y = 0; y < height; y++) {
                newstate[x][y] = shouldLive(state, x, y) ? '1' : '0';
            }
        }
        state = newstate;
        log('step eind');
    };
    
    var init = function() {
      
        initState();
        
        log('initial pattern '+pattern);
        var startingpoints = pattern.split(';');
        for(var i = 0; i < startingpoints.length; i++){
            var x = startingpoints[i].split(',')[0];
            var y = startingpoints[i].split(',')[1];
            log('init pixel ('+x+','+y+')');
            state[x-1][y-1] = '1';
        }
    };
    
    var show = function () {
        log('current state');
        log(state);
        
        canvascontext.fillStyle = "rgb(255,255,255)";
        canvascontext.fillRect(0,0,width*blocksize,height*blocksize);
        
        canvascontext.fillStyle = "rgb(0,0,0)";
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                log('('+x+','+y+') ' + (state[x][y] === '1' ? 'true' : 'false'));
                
                if(state[x][y] === '1')
                    canvascontext.fillRect(x*blocksize, y*blocksize, blocksize, blocksize);
            }
        }
    };
    
    var start = function () {
        
        step();
        show();
        if(running)
            setTimeout(function() { start(); }, steptime);
    };
    
    var life = {
        show : function () { show(); return life; },
        init: function () { init(); return life; },
        step : function () { step(); return life; },
        start : function () { running = true; start(); return life; },
        stop : function () { running = false; return life; },
        reset : function () { running = false; init(); show(); return life; }
    };
    
    return life;
};