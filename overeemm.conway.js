var overeemm = window.overeemm || {};

overeemm.log = function (msg) { 
    console.log(msg); 
};

overeemm.conway = overeemm.conway || {};

overeemm.conway.Utils = (function() {
     return {
          parseState: function(pattern, canvaswidth, canvasheight) {
               var state = [];
               for (var x = 0; x < canvaswidth; x++) {
                    state[x] = [];
                    for (var y = 0; y < canvasheight; y++) {
                         state[x][y] = 0;
                    }
               }

               var startingpoints = pattern.split(';');
               for (var i = 0; i < startingpoints.length; i++) {
                    var x = parseInt(startingpoints[i].split(',')[0]);
                    var y = parseInt(startingpoints[i].split(',')[1]);
                    state[x - 1][y - 1] = 1;
               }
               return state;
          }
     };
})();

overeemm.conway.LifeGiver = function (logfunc) {
    var state = [];
    var width = 0;
    var height = 0;
    var log = logfunc || function () { };
    
    var getLiveNeighbours = function (oldstate, x, y) {
        var nr = 0;
        for(var xx = Math.max(0, x-1); xx < Math.min(width, x+2); xx++)
            for(var yy = Math.max(0, y-1); yy < Math.min(height, y+2); yy++)                   
                if((xx !== x || yy !== y) && oldstate[xx][yy] === 1)
                    nr++;
     
        return nr;
    };
     
    var shouldLive = function (oldstate, x, y) {
        
        var live = false;
        var nrofliveneighbours = getLiveNeighbours(oldstate, x, y);
        /// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
        if(oldstate[x][y] === 1 && nrofliveneighbours < 2)
            live = false;
        /// Any live cell with two or three live neighbours lives on to the next generation.
        if(oldstate[x][y] === 1 && (nrofliveneighbours === 2 || nrofliveneighbours === 3))
            live = true;
        /// Any live cell with more than three live neighbours dies, as if by overcrowding.
        if(oldstate[x][y] === 1 && nrofliveneighbours > 3)
            live = false;
        /// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction
        if(oldstate[x][y] === 0 && nrofliveneighbours === 3)
            live = true;
        return live;
    };
    
    var step = function () {
        log('step begin');
        var newstate = [];
        
        for(var x = 0; x < width; x++) {
            newstate[x] = [];
            for(var y = 0; y < height; y++) {
                newstate[x][y] = shouldLive(state, x, y) ? 1 : 0;
            }
        }
        state = newstate;
        log('step eind');
    };
    
    var init = function(initstate) {
        state = initstate;
        width = state.length;
        height = state.length > 0 ? state[0].length : 0;
    };
    
    var getState = function(args) {
        if(args.length === 0)
            return state;
        else if (args.length === 2)
            return state[args[0]-1][args[1]-1];
        else
            return [];
    };
     
    var lifegiver = {
        init: function(state) { init(state); return lifegiver; },
        step : function() { step(); return lifegiver; },
        state : function() { return getState(arguments); }
    };
    return lifegiver;
};

overeemm.conway.Life = function (canvas, logfunc) {
    
    var elem = document.getElementById(canvas);
    var pattern = elem.getAttribute('data-startpattern');
    var blocksize = elem.getAttribute('data-blocksize');
    var steptime = elem.getAttribute('data-steptime');
    var debug = elem.getAttribute('data-debug');
    
    var log = logfunc || (debug === '1' ? overeemm.log : function() { });
    
    var lifegiver = overeemm.conway.LifeGiver(log);
    
    var canvascontext = elem.getContext('2d');
    var canvaswidth = elem.getAttribute('width') / blocksize;
    var canvasheight = elem.getAttribute('height') / blocksize;
    
    var running = false;
    
    var init = function() {
      
        var state = overeemm.conway.Utils.parseState(pattern, canvaswidth, canvasheight);
        lifegiver.init(state);
    };
    
    var show = function () {        
        canvascontext.fillStyle = "rgb(255,255,255)";
        canvascontext.fillRect(0,0,canvaswidth*blocksize,canvasheight*blocksize);
        
        canvascontext.fillStyle = "rgb(0,0,0)";
        for(var x = 1; x <= canvaswidth; x++) {
            for(var y = 1; y <= canvasheight; y++) {
                var cellstate = lifegiver.state(x,y);
                if(cellstate === 1) {
                    canvascontext.fillRect(x*blocksize, y*blocksize, blocksize, blocksize);
                    log('('+x+','+y+') true');
                }
            }
        }
    };
    
    var start = function () {
        
        lifegiver.step();
        show();
        if(running)
            setTimeout(function() { start(); }, steptime);
    };
    
    var life = {
        show : function () { show(); return life; },
        init: function () { init(); return life; },
        start : function () { running = true; start(); return life; },
        stop : function () { running = false; return life; },
        reset : function () { running = false; init(); show(); return life; },
        toggle : function () { if(running) { running = false; stop(); } else { running = true; start(); } return life; }
    };
    
    return life;
};