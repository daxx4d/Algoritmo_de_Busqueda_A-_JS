window.onload = ini;

var canvas,
    ctx,
    selected,
    matriz;

function ini(){

    console.log("Iniciando...");
    
    canvas = $("#canvas")[0];
    ctx = canvas.getContext("2d");
    
    //se inicializa la matriz principal
    matriz = new Matriz(20, 12);
    matriz.init();

    $(".Inicio").click(opcion);
    $(".destino").click(opcion);
    $(".obstaculo").click(opcion);
    $(".borrar").click(opcion);
    
    $(".buscar").click(buscar);
    $(".reiniciar").click(reiniciar);
    
    canvas.onclick = canvasEvent;
    
    paint();
    
}

///////////////////////////////////* Eventos */////////////////////////////////////////

function buscar(){

    main();

}

function reiniciar(){

    matriz.init();
    matriz.ini = [0,0];
    matriz.dest = [matriz.sizeX-1, matriz.sizeY-1];
    
    paint();
    
    write("Matriz reiniciada");
    
    return;

}

function opcion(evt){

    evt = $(evt.target);
    //var sel = "Error";
    
    
    switch(evt.attr("class")){
    
        case "inicio":
            selected = 2;
            write("Inicio; selected:"+selected);
            break;
            
        case "obstaculo":
            selected = 1;
            write("Obstaculo; selected:"+selected);
            break;
            
        case "destino":
            selected = 3;
            write("Destino; selected:"+selected);
            break;
            
        case "borrar":
            selected = 0;
            write("Borrar; selected:"+selected);
            break;
            
        default:
            console.log("no se encontro el valor 'opcion()' : " + evt.attr("class"));
            break;
    
    }
    
}

function canvasEvent(evt){

    var targ = evt.target;
    
    var posX = evt.clientX;
    var posY = evt.clientY;
    var anch = canvas.width / matriz.sizeX;
    
    write(posX+":"+posY);
    
    //calcula cual fue el cuadro seleccionado en la matriz
    var x = 0;
    var y = 0;
    var cont = 0;
    var pos = [0,0];
    var end = false;
    //primero se busca por el eje X
    while(!end){
    
        //se le resta 3 debido a una imprecision de el elemento canvas
        if( (posX-3>x && posX-3 < x+anch) ){
        
            pos[0] = cont;
            cont = 0;
            
            //luego por el eje Y
            while(!end){
            
                if(posY>y-3 && posY-3 < y+anch){
                
                    pos[1] = cont;
                    cont = 0;
                    end = true;
                    break;
                    
                }
                
                y += anch;
                cont++;
                if( x > 800 ){ write("Error posicion no encontrada; Y : "+posY); return; }
            
            }//Eje Y
        
        }
        
        x += (!end)? anch : 0;
        cont++;
        if( x > 800 ){ write("Error posicion no encontrada; X : "+posX); return; }
    
    }//Eje X
    
    write("posicion de la matriz; "+ (pos[0]+1) +":"+ (pos[1]+1));
    
    var matrzNum = matriz.mtrz[ pos[0] ][ pos[1] ];
    switch(selected){
            
        case 0://nodo abierto
            if(matrzNum === 1){ matriz.mtrz[ pos[0] ][ pos[1] ] = 0; }
            break;
            
        case 1://nodo cerrado
            if( (matriz.ini[0] !== pos[0] || matriz.ini[1] !== pos[1]) && (matriz.dest[0] !== pos[0] || matriz.dest[1] !== pos[1]) ){
                matriz.mtrz[ pos[0] ][ pos[1] ] = (matrzNum === 0)? 1 : 0; }
            break;
            
        case 2://node de inicio
            if(matrzNum === 0 && (matriz.dest[0] !== pos[0] || matriz.dest[1] !== pos[1]) ){
                matriz.ini = pos;}
            break;
            
        case 3://nodo destino
            if(matrzNum === 0 && matriz.ini[0] !== pos[0] || matriz.ini[1] !== pos[1]){
                matriz.dest = pos;}
            break;
            
        default:
            write("Error selector no encontrado")
            console.log("Error 'canvasEvent' 'switch()' : "+selected);
            break;  
    
    }
    
    paint();
    
}

////////////////////////////////////* paint *//////////////////////////////////////////

function paint(){

    var posX = 0;
    var posY = 0;
    var anch = canvas.width / matriz.sizeX;
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //se dibuja un borde alrededor de cada elemento de la matriz principal
    for(var y = 0; y < matriz.sizeY; y++){
    
        for(var x = 0; x < matriz.sizeX; x++){
            
            ctx.moveTo(posX, posY);
            ctx.lineTo(posX, posY+anch);
            ctx.lineTo(posX+anch, posY+anch);
            ctx.lineTo(posX+anch, posY);
            ctx.lineTo(posX, posY);
            ctx.strokeStyle = "black";
            
            posX += anch;
            
        }
        
        posX = 0;
        posY += anch;
              
    }//fin For
    ctx.stroke();//al final se dibujan todas las lines trazadas
    
    //se dibuja el cuadro de inicio
    posX = (matriz.ini[0] === 0)? 0 : anch * (matriz.ini[0]-0);
    posY = (matriz.ini[1] === 0)? 0 : anch * (matriz.ini[1]-0);
    ctx.fillStyle = "blue"
    ctx.fillRect(posX,posY,anch,anch);
    
    //se dibuja el cuadro de destino
    posX = (matriz.dest[0] === 0)? 0 : anch * (matriz.dest[0]-0);
    posY = (matriz.dest[1] === 0)? 0 : anch * (matriz.dest[1]-0);
    ctx.fillStyle = "red"
    ctx.fillRect(posX,posY,anch,anch);
    
    
    //se dibujan los obstaculos
    posX = 0; posY = 0;
    for( y = 0; y < matriz.sizeY; y++){
    
        for( x = 0; x < matriz.sizeY; x++){
            
            if(matriz.mtrz[x][y] == 1){/****************/
            
                ctx.fillStyle = "grey"
                ctx.fillRect(posX,posY,anch,anch);
            
            }
            
            posX += anch;
            
        }
        
        posX = 0;
        posY += anch;
              
    }

}

function paintMovs(mov){

    var anch = canvas.width / matriz.sizeX;
    for(var x = 1;x < mov.length; x++){
    
        var nod = mov[x];
        
        var posX = (nod.pos[0] === 0)? 0 : anch * nod.pos[0];
        var posY = (nod.pos[1] === 0)? 0 : anch * nod.pos[1];
        
        ctx.fillStyle = "#68ff6b";
        ctx.fillRect(posX, posY, anch, anch);
    
    }

}

//////////////////////////////////* functions *////////////////////////////////////////

function write(text){

    var con = $(".console")[0];
    con.textContent = text;
    
}

///////////////////////////////////* Matriz *//////////////////////////////////////////
// 40/24
function Matriz(x, y){

    this.sizeX = (x === null)? 1 : x;
    this.sizeY = (y === null)? 1 : y;
    this.mtrz = null;
    
    this.ini = [0,0];
    this.dest = [x-1,y-1];
    
    this.init = function(){
    
        this.mtrz = new Array(this.sizeX);
        for(x = 0; x < this.sizeX; x++){
        
            this.mtrz[x] = new Array(this.sizeY);
        
        }
        
        for( x = 0; x < this.sizeX; x++){
        
            for(var y = 0; y < this.sizeY; y++){
            
                this.mtrz[x][y] = 0;
            
            }
        
        }
        
        console.log("Matriz cargada");
        console.info(this);
    
    }

}





///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

































