window.onload = init;

document.addEventListener('keydown',function(evt){
    
    lastPress = evt.keyCode;
    
},false);

var canvas = null, ctx = null;
var lastPress=null;
var KEY_LEFT=37;    var KEY_UP=38;
var KEY_RIGHT=39;   var KEY_DOWN=40;
var KEY_ENTER = 13;
var dir = 0;
var gameover=true;
var pause=true;
var score = 0;

//var player = new Rectangle(40, 60, 20, 20);
var body=new Array();
var food = new Rectangle(100, 100, 30, 30);

var wall = new Array();
wall.push(new Rectangle(200, 150, 80,40));
wall.push(new Rectangle(500, 150, 80,40));
wall.push(new Rectangle(200, 250, 80,40));
wall.push(new Rectangle(500, 250, 80,40));

function init(){
    
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    
    run();
    repaint();
    
}

function run(){
    
    setTimeout(run,50);
    act();
    paint(ctx);
    
}

function repaint(){
    
    requestAnimationFrame(repaint);
    paint(ctx);
    
}


function act(){
    
    
    
    if(!pause){
    
        //direccion del movimiento
        if(lastPress==KEY_UP)
            dir=0;
        if(lastPress==KEY_RIGHT)
            dir=1;
        if(lastPress==KEY_DOWN)
            dir=2;
        if(lastPress==KEY_LEFT)
            dir=3;
    
        //Movimineto
        if(dir==0)
            body[0].y-=10;
        if(dir==1)
            body[0].x+=10;
        if(dir==2)
            body[0].y+=10;
        if(dir==3)
            body[0].x-=10;

        //Revsar si se sale de la pnatalla
        if(body[0].x>canvas.width)
            body[0].x=0;
        if(body[0].y>canvas.height)
            body[0].y=0;
        if(body[0].x<0)
            body[0].x=canvas.width;
        if(body[0].y<0)
            body[0].y=canvas.height;
        
        //comio
        if(player.intersects(food)){
            
            body.push(new Rectangle(food.x,food.y,10,10));
            score++;
            food.x=random(canvas.width/10-1)*10;
            food.y=random(canvas.height/10-1)*10;
            
        }
        
        // cuerpo choca
        for(var i=2,l=body.length;i<l;i++){
            
            if(body[0].intersects(body[i])){
                
                gameover=true;
                pause=true;
                
            }
            
        }
        
        //pared
        for(var i=0,l=wall.length;i<l;i++){
            
            if(food.intersects(wall[i])){
                
                food.x = random(canvas.width/10-1)*10;
                food.y = random(canvas.height/10-1)*10;
                
            }
            
            if(player.intersects(wall[i])){
                
                gameover = true;
                pause = true;
                
            }
       }
        
    }
    
    for(var i=body.length-1;i>0;i--){
        
            body[i].x=body[i-1].x;
            body[i].y=body[i-1].y;
        
    }
    
    if(gameover)
            reset();
    
    if(lastPress == KEY_ENTER){
    
        pause = !pause;
        lastPress = null;
    
    }
    
}// act

function paint(ctx){
    
    ctx.fillStyle='#000';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0f0';
    for(var i=0,l=body.length;i<l;i++){
        
        body[i].fill(ctx);
        
    }
    
    ctx.fillStyle='#999';
    for(var i=0,l=wall.length;i<l;i++){
        
        wall[i].fill(ctx);
        
    }
    
    
    ctx.fillStyle='#f00';
    food.fill(ctx);
    
    ctx.fillStyle='#fff';
    ctx.fillText('Last Press: '+lastPress,0,20);
    ctx.fillText('Score: '+score,0,10);
    
    if(pause){
        
        ctx.textAlign='center';
        if(gameover)
            ctx.fillText('GAME OVER', canvas.width / 2 , canvas.height / 2);
        else
            ctx.fillText('PAUSE', canvas.width / 2 , canvas.height / 2);
            ctx.textAlign='left';
        
    }
    
}// paint

function random(max){ return Math.floor(Math.random()*max); }

function reset(){
    
    score=0;
    dir=1;
    food.x=random(canvas.width/10-1)*10;
    food.y=random(canvas.height/10-1)*10;
    gameover=false;
    
    body.length=0;
    body.push(new Rectangle(40,40,10,10));
    body.push(new Rectangle(0,0,10,10));
    body.push(new Rectangle(0,0,10,10));
    
}

//calse Rectangle ////////////////////////////////////////////////////////
function Rectangle(x,y,width,height){
    
    this.x      = (x==null)?      0          : x;
    this.y      = (y==null)?      0          : y;
    this.width  = (width==null)?  0          : width;
    this.height = (height==null)? this.width : height;
    
    this.intersects=function(rect){
        
        if(rect!=null){
            
            return(this.x<rect.x+rect.width&&
                this.x+this.width>rect.x&&
                this.y<rect.y+rect.height&&
                this.y+this.height>rect.y);
            
        }
        
    }
    
    this.fill=function(ctx){
        
        if(ctx!=null){
            ctx.fillRect(this.x,this.y,this.width,this.height);
            
        }
        
    }
    
}
//calse Rectangle ////////////////////////////////////////////////////////














