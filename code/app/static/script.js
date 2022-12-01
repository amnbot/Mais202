var canvas = document.getElementById("paint");
var ctx = canvas.getContext("2d");
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
var width = canvas.width;
var height = canvas.height;
var curX, curY, prevX, prevY;
var hold = false;
ctx.lineWidth = 2;
var fill_value = true;
var stroke_value = false;
var canvas_data = {"pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": []}
                        
function color(color_value){
    ctx.strokeStyle = color_value;
    ctx.fillStyle = color_value;
}    
        
function add_pixel(){
    ctx.lineWidth += 1;
}
        
function reduce_pixel(){
    if (ctx.lineWidth == 1){
        ctx.lineWidth = 1;
    }
    else{
        ctx.lineWidth -= 1;
    }
}
        
function fill(){
    fill_value = true;
    stroke_value = false;
}
        
function outline(){
    fill_value = false;
    stroke_value = true;
}
               
function reset(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    canvas_data = { "pencil": [], "line": [], "rectangle": [], "circle": [], "eraser": [] }
}
        
// pencil tool
        
function pencil(){
        
    canvas.onmousedown = function(e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.ontouchstart = function(e){
        curX = e.touches[0].clientX - canvas.offsetLeft;
        curY = e.touches[0].clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    }
        
    canvas.onmousemove = function(e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };

    canvas.ontouchmove = function(e){
        if(hold){
            curX = e.touches[0].clientX - canvas.offsetLeft;
            curY = e.touches[0].clientY - canvas.offsetTop;
            draw();
            e.preventDefault();
        }
    };

    canvas.ontouchend = function(e){
        if(hold){
            curX = e.touches[0].clientX - canvas.offsetLeft;
            curY = e.touches[0].clientY - canvas.offsetTop;
            draw();
        }
    };
        
    canvas.onmouseup = function(e){
        hold = false;
    };

    canvas.ontouchcancel = function(e){
        hold = false;
    };
        
    canvas.onmouseout = function(e){
        hold = false;
    };
        
    function draw(){
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }
}

// eraser tool
        
function eraser(){
    
    canvas.onmousedown = function(e){
        curX = e.clientX - canvas.offsetLeft;
        curY = e.clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };

    canvas.ontouchstart = function(e){
        curX = e.touches[0].clientX - canvas.offsetLeft;
        curY = e.touches[0].clientY - canvas.offsetTop;
        hold = true;
            
        prevX = curX;
        prevY = curY;
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
    };
        
    canvas.onmousemove = function(e){
        if(hold){
            curX = e.clientX - canvas.offsetLeft;
            curY = e.clientY - canvas.offsetTop;
            draw();
        }
    };

    canvas.ontouchmove = function(e){
        if(hold){
            curX = e.touches[0].clientX - canvas.offsetLeft;
            curY = e.touches[0].clientY - canvas.offsetTop;
            draw();
            e.preventDefault();
        }
    };
        
    canvas.onmouseup = function(e){
        hold = false;
    };

    canvas.ontouchcancel = function(e){
        hold = false;
    };
        
    canvas.onmouseout = function(e){
        hold = false;
    };
        
    function draw(){
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();
        canvas_data.pencil.push({ "startx": prevX, "starty": prevY, "endx": curX, "endy": curY, "thick": ctx.lineWidth, "color": ctx.strokeStyle });
    }    
}  

function save(){
    var filename = 'filename';
    var data = JSON.stringify(canvas_data);
    var image = canvas.toDataURL('image/png', 1.0);
    var posting = $.post("/paint", { save_fname: filename, save_cdata: data, save_image: image });
    posting.done(function (data) {
        var content = $( data ).find("#content");
        console.log(content.selector.split(' ')[0])
        const div = document.getElementById('result');
        div.textContent = content.selector.split(' ')[0]
    })
} 