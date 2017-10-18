function $(s){
    return document.querySelectorAll(s);
}


var size = 128
var height,width;
var box = $('#box')[0]
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d');
var line;
var mv = new MusicVisualizer({
    size:size,
    visualizer:draw,

})

var list = $('#list li');
for(var i= 0 ; i < list.length ; i++){
    list[i].onclick=function(){
        for(var j=0;j<list.length;j++){
            list[j].className=''
        }
        this.className='selected'
        mv.play('/media/'+this.title);
    }
}





box.appendChild(canvas)


function reasize(){
    height = box.clientHeight;
    width = box.clientWidth;
    canvas.height=height;
    canvas.width = width;
    line = ctx.createLinearGradient(0,0,0,height);//线性渐变
    line.addColorStop(0,'#fff')
    // line.addColorStop(0.2,'pink')
    line.addColorStop(1,'#fff')
  
    getDots();//每次窗口改变时，点也随之改变
}
reasize()
window.onresize = reasize;

var dots=[];
function random(m,n){//获取m-n之间的随机整数
    return Math.round(Math.random()*( n- m ) + m);
}

function getDots(){
    dots = [];
    for(var i=0;i<size ;i++){
        var x = random(0,width);
        var y = random(0,height);
        var color = 'rgba('+random(0,255)+','+random(0,255)+','+random(0,255)+',0)';
        dots.push({
            x:x,
            y:y,
            dx:random(1,4),
            color:color,
            cap:0
        })
    }
}

getDots()
function draw(arr){
    ctx.clearRect(0,0,width,height);//画之前将之前的清除
    var w = width / size;
    var cw = w * 0.6;
    var capH = cw > 10?10:cw;
    ctx.fillStyle=line;
    for(var i=0;i<size;i++){
        var o = dots[i];
        if(draw.type == 'column'){
            var h = arr[i] /256 * height;//比例
            ctx.fillRect(w*i ,height-h,cw,h  );
            ctx.fillRect(w*i ,height-(o.cap+capH),cw,capH  );//小帽
            o.cap--;
            if(o.cap <0 ){
                o.cap = 0;
            }
            if(h> 0 && o.cap <h+40){
                o.cap = h+40>height - capH ?height - capH:h+40;
            }
        }else if(draw.type== 'dot'){ 
            ctx.beginPath();
            var r = 5 + arr[i] / 256 * (height>width?width:height)/20;
            ctx.arc(o.x,o.y,r,0,Math.PI * 2 ,true );
            var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
            g.addColorStop(0,'#fff')          
            g.addColorStop(1,o.color)
            ctx.fillStyle=g;
            ctx.fill()
            o.x += o.dx;
            o.x = o.x >width?0:o.x;
        }
    }
}

draw.type = 'column'
var types = $('#type li');
for(var i=0 ;i < types.length;i++){
    types[i].onclick=function(){
        for(var j=0;j<types.length;j++){
            types[j].className=''
        }
        this.className='selected'
        draw.type = this.getAttribute('data-type');
    }
}



$('#volume')[0].onchange=function(){
    mv.changeVolume(this.value/this.max)
}
$('#volume')[0].onchange()    