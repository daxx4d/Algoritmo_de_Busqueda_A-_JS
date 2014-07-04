
var costMov = 0;

function main(){
    
    costMov = 0;
    //contendra los movimientos necesarios para llegar a destino 
    var mov = new Array();
    
    //establece la ubicacion inicial como primera posicion
    var node = new ANode(matriz.ini[0], matriz.ini[1]);
    mov.push(node);
    
    var abierto = new Array();
    var cont = 0;
    var sdf = 0;
    while(true){
    
        //se revisa siguiendo el orden de las agujas del reloj
        
        //la nuevas posicion es igual al ultimo movimineto
        node = mov[mov.length-1];
        console.log(node);//*
        
        //se revisa si la ubicacion del nodo esta disponible
        var nod = (matriz.mtrz[ node.pos[0] ][ node.pos[1]-1 ] != 2)? new ANode(node.pos[0], node.pos[1]-1) : null;//norte
        if(nod){
            
            //luego se establece la ubicacion del nodo padre y se calcula el movimiento
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);//por ultimo se agrega a la lista de abiertos
            
        }
        //lo mismo para los siguientes nodos...
        
        var nod = (matriz.mtrz[ node.pos[0]+1 ][ node.pos[1]-1 ] != 2)? new ANode(node.pos[0]+1, node.pos[1]-1) : null;//noreste
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        var nod = (matriz.mtrz[ node.pos[0]+1 ][ node.pos[1] ] != 2)? new ANode(node.pos[0]+1, node.pos[1]) : null;//este
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        var nod = (matriz.mtrz[ node.pos[0]+1 ][ node.pos[1]+1 ] != 2)? new ANode(node.pos[0]+1, node.pos[1]+1) : null;//sureste
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        var nod = (matriz.mtrz[ node.pos[0] ][ node.pos[1]+1 ] != 2)? new ANode(node.pos[0], node.pos[1]+1) : null;//sur
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        var nod = (matriz.mtrz[ node.pos[0]-1 ][ node.pos[1]+1 ] != 2)? new ANode(node.pos[0]-1, node.pos[1]+1) : null;//suroeste
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        nod = (matriz.mtrz[ node.pos[0]-1 ][ node.pos[1] ] != 2)? new ANode(node.pos[0]-1, node.pos[1]) : null;//oeste
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        var nod = (matriz.mtrz[ node.pos[0]-1 ][ node.pos[1]-1 ] != 2)? new ANode(node.pos[0]-1, node.pos[1]-1) : null;//noroeste
        if(nod){
            
            nod.setParentN(node.pos);
            nod.calcF();
            abierto.push(nod);
            
        }
        
        //establece el nodo con la menor distancia al destino
        var f = 1000000;
        console.log("abierto length : "+abierto.length);
        for(var x = 0; x < abierto.length; x++){
        
            var beforePosX = (mov.length < 2)? -1 : mov[mov.length-2].pos[0];
            var beforePosY = (mov.length < 2 )? -1 : mov[mov.length-2].pos[1];
            if(abierto[x].f < f && (abierto[x].pos[0] != beforePosX || abierto[x].pos[1] != beforePosY) ){
            
                f = abierto[x].f;
                node = abierto[x];
            
            }
        
        }
        
        //si el nodo esta ubicado en el destino se cierra el bucle
        if( matriz.mtrz[ node.pos[0] ][ node.pos[1] ] == 3 ){
        
            break;
        
        }
        else{//de lo contrario se agrega a la lista de movimientos
            
            mov.push(node);
            costMov += dist(node.pos[0], node.pos[1], node.parentNode[0], node.parentNode[1]);
            abierto = new Array();//se limpia la lista
            console.log(node.pos[0]+" : "+node.pos[1]);
        
        }
        
        if(cont >= 50 ){ console.error("Limite de movimentos alcanzado"); break; }
        else{ cont++; }
    
    }//fin while
    
    console.log("Listo!!!!!!");
    for(x = 0; x < mov.length; x++){ console.log(mov[x].pos[0]+":"+mov[x].pos[1]); }
    
    paintMovs(mov);
    
    return;

}

function heuristic(x, y){

    var IPosX = x,
        IPosY = y,
        FPosX = matriz.dest[0],
        FPosY = matriz.dest[1];
    
    var totX = (IPosX > FPosX)? IPosX - FPosX : FPosX - IPosX;
    var totY = (IPosY > FPosY)? IPosY - FPosY : FPosY - IPosY;
    
    return totX+totY;

}

function dist(posX, posY, parentX, parentY){

    if(posX != parentX && posY != parentY){
        
        return 14;
    
    }
    else{ return 10; }

}

function ANode(x, y){

    //true:abierto false:cerrado
    this.state = true;
    this.pos = [(x == null)? 0 : x, (y == null)? 0 : y];
    this.parentNode = [null, null];
    this.f = 0;
    this.g = 0;
    this.h = 0;
    
    this.calcF = function(){
    
        if( this.parentNode[0] == null || this.parentNode[1] == null){
        
            console.error("falta informacion 'ANode.calcF()' : "+this.parentNode);
            
        }
        
        this.h = heuristic(this.pos[0], this.pos[1]);
        this.g = costMov + dist(this.pos[0], this.pos[1], this.parentNode[0], this.parentNode[1]);
        this.f = this.h + this.g;
    
    }
    
    this.setPos = function(pos){
    
        this.pos[0] = pos[0];
        this.pos[1] = pos[1];
    
    }
    
    this.setParentN = function(pos){
    
        this.parentNode[0] = pos[0];
        this.parentNode[1] = pos[1];
    
    }

}

function MObjt(){

    this.matriz = 0;
    this.ini = 0;
    this.dest = 0;
    
    this.abierto = null;
    this.cerrado = null;
    
    this.load = function(iniX, iniY, destX, destY, mtrz){
    
        console.log("cargando 'MObject'");
        
        this.ini = [iniX, iniY];
        this.dest = [destX, destY];
        
        this.matriz = new Array(matriz.mtrz.length-1);
        for(var x = 0; x < matriz.mtrz.length; x++){
            
            this.matriz[x] = new Array( matriz.mtrz[0].lenght-1 );
        
        }
        
        console.info(this.matriz);
    
    }

}



































