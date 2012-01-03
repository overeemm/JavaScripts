var overeemm = window.overeemm || {};

overeemm.log = function (msg) { 
    console.log(msg); 
};

overeemm.mandelbrot = overeemm.mandelbrot || {};

overeemm.mandelbrot.Number = function(options) {
    
    var repeatloops = 256;
    var scale = 0.0;
    var colormodifier = options.colormodifier || function (r, g, b) { return { r: r, g: 255-g, b: 255-b}; };
    
    var setScale = function(sc) { 
         var oldscale = scale;
         if(typeof sc === 'function')
             scale = sc(scale);
         else
             scale = sc; 
             
         return oldscale;
    };
    
    var getColor = function(number) {
        
        var r = 0, g = 0, b = 0;
        r = ( ( (number/scale) * (repeatloops/ (repeatloops/scale) ) ) );
        g = ( ( (number/scale) * (repeatloops/ (repeatloops/scale) ) ) );
        b = ( ( (number/scale) * (repeatloops/ (repeatloops/scale) ) ) );

        return colormodifier(r, g, b);
    };    
     
    var getNumber = function (x, y, center_x, center_y) {
       
        var a_loop = 0.0;
        var a_prev = 0.0;
        var b_loop = 0.0;
        var b_prev = 0.0;
        var distance = 0.0;
        var number = 0;

        x = center_x + x * scale;
        y = center_y + y * scale;

        while (number < repeatloops && distance < 16) {
            a_prev = a_loop;
            b_prev = b_loop;
            a_loop = a_prev * a_prev - b_prev * b_prev + x;
            b_loop = 2 * a_prev * b_prev + y;
            
            distance = a_loop * a_loop + b_loop * b_loop;
            number++;
        }
        return number;
    };
    
    return {
        getNumber : getNumber,
        getColor : getColor,
        setScale : setScale
    };
};

overeemm.mandelbrot.Painter = function(options) {
    
    var canvas = options.canvas;
    var canvascontext = canvas.getContext('2d');
    var canvas_half_width = parseInt(canvas.getAttribute('width')) / 2;
    var canvas_half_height = parseInt(canvas.getAttribute('height')) / 2;
    
    var center_x = 0.0;
    var center_y = 0.0;
    var startpoint_x = 0 - canvas_half_width;
    var startpoint_y = 0 - canvas_half_height;
    var endpoint_x = canvas_half_width;
    var endpoint_y = canvas_half_height;
    
    var number = overeemm.mandelbrot.Number({});
    number.setScale(options.scale || 0.01);
    
    var setColor = function(rgb) {
         canvascontext.fillStyle = 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
    };
    
    var paint = function () {
        for (var screenX = startpoint_x; screenX < endpoint_x ; screenX++) {
            for (var screenY = startpoint_y; screenY < endpoint_y ; screenY++) {
                var xynumber = number.getNumber(screenX, screenY, center_x, center_y);
                var color = number.getColor(xynumber);
                setColor(color);
                canvascontext.fillRect(screenX + canvas_half_width, screenY + canvas_half_height, 1, 1);
            }
        }         
    };
    
    var getCoordinates = function(event, document, canvas) {
        var x;
        var y;
        if (event.pageX || event.pageY) { 
            x = event.pageX;
            y = event.pageY;
        } else { 
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        return { x : x, y : y };
    };
    
    var zoom = function(point) {
        var oldscale = number.setScale( function(s) { return s/2; } );
        
        center_x = center_x + ( (point.x - canvas_half_width) * oldscale);
	   center_y = center_y + ( (point.y - canvas_half_height) * oldscale);
    };
    
    var painter = {
         paint : function () { paint(); return painter; },
         setScale : function(scale) { number.setScale(scale); return painter; },
         zoom : function (point) { zoom(point); return painter; },
         getCoordinates : getCoordinates
    };
    return painter;
};
