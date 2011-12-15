var overeemm = window.overeemm || {};

overeemm.log = function(msg) {
     console.log(msg);
};

overeemm.conway = overeemm.conway || {};

overeemm.conway.Life = function (canvas, args) {
    
    var blocksize = args.blocksize || 5;
    
    var elem = document.getElementById(canvas);
    var canvascontext = elem.getContext('2d');
    var width = elem.getAttribute('width') / blocksize;
    var height = elem.getAttribute('height') / blocksize;
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
        overeemm.log('initial pattern '+pattern);
        var startingpoints = pattern.split(';');
        for(var i = 0; i < startingpoints.length; i++){
            var x = startingpoints[i].split(',')[0];
            var y = startingpoints[i].split(',')[1];
            overeemm.log('init pixel ('+x+','+y+')');
            state[x-1][y-1] = '1';
        }
    };
    
    var show = function () {
        overeemm.log('current state');
        overeemm.log(state);
        
        canvascontext.fillStyle = "rgb(0,0,0)";
        for(var x = 0; x < width; x++) {
            for(var y = 0; y < height; y++) {
                overeemm.log('('+x+','+y+') ' + (state[x][y] === '1' ? 'true' : 'false'));
                
                if(state[x][y] === '1')
                    canvascontext.fillRect(x*blocksize, y*blocksize, blocksize, blocksize);
            }
        }
    };
    
    var life = {
        show : function () { show(); return life; },
        init: function () { init(); return life; }
    };
    
    return life;
};