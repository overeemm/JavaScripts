var overeemm = window.overeemm || {};

overeemm.log = function (msg) { 
    console.log(msg); 
};

overeemm.mandelbrot = overeemm.mandelbrot || {};

overeemm.mandelbrot.Number = function(options) {
    
    var repeatloops = 255;
    var scale = options.scale;
    var colormodifier = options.colormodifier || function (r, g, b) { return { r: r, g: 255-g, b: 255-b}; };
    
    var getColor = function(number) {
        
        var r = 0, g = 0, b = 0;
        r = ( ( (number/scale) * (255/ (repeatloops/scale) ) ) );
        g = ( ( (number/scale) * (255/ (repeatloops/scale) ) ) );
        b = ( ( (number/scale) * (255/ (repeatloops/scale) ) ) );

        return colormodifier(r, g, b);
    };    
     
    var getNumber = function (x, y) {
         
        var a = { start: 0.0, loop: 0.0, previous : 0.0 };
        var b = { start: 0.0, loop: 0.0, previous : 0.0 };
        var distance = 0.0;
        var number = 0;

        while (number < repeatloops && distance < 4) {
            a.previous = a.loop;
            b.previous = b.loop;
            a.loop = a.previous * a.previous - b.previous * b.previous + x;
            b.loop = 2 * a.previous * b.previous + y;
            distance = Math.sqrt(  (Math.abs(a.start - a.loop) * Math.abs(a.start - a.loop)) 
                                 + (Math.abs(b.start - b.loop) * Math.abs(b.start - b.loop))
                                );
            number++;
        }
        return number;
    };
    
    return {
        getNumber : getNumber,
        getColor : getColor
    };
};

overeemm.mandelbrot.Painter = function(options) {
    
    var scale = options.scale || 0.01;
    
    var canvas = options.canvas;
    var canvascontext = canvas.getContext('2d');
    var canvaswidth = parseInt(canvas.getAttribute('width'));
    var canvasheight = parseInt(canvas.getAttribute('height'));
    
    var center = { x : 0.0, y : 0.0 };
    var startpoint = { x : -1 * (canvaswidth / 2)
                     , y : -1 * (canvasheight / 2) };
    var endpoint = { x : startpoint.x + canvaswidth
                   , y : startpoint.y + canvasheight };
    
    var number = overeemm.mandelbrot.Number({ scale : scale});
    
    var setColor = function(rgb) {
         canvascontext.fillStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    };
    
    var paint = function () {
        for (var screenX = startpoint.x; screenX < endpoint.x ; screenX++) {
            for (var screenY = startpoint.y; screenY < endpoint.y ; screenY++) {
                var xynumber = number.getNumber( center.x+(screenX*scale), center.y+(screenY*scale) );
                var color = number.getColor(xynumber);
                setColor(color);
                canvascontext.fillRect(screenX+200, screenY+200, 1, 1);
            }
        }         
    };
    
    return {
         paint : paint
    };
};
