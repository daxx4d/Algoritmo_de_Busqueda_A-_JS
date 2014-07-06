
//var costMov = 0;

function main(){
    
    var costMov = 0;
    //contendra los movimientos necesarios para llegar a destino 
    var mov = new Array();
    
    //establece la ubicacion inicial como primera posicion
    var node = new ANode(matriz.ini[0], matriz.ini[1]);
    matriz.mtrz[ node.pos[0] ][ node.pos[1] ] = 1;
    mov.push(node);
    
    var abierto = new Array(),
        cont = 0,
        sdf = 0;
    while(true){
    
        //se revisa siguiendo el orden de las agujas del reloj
        
        //la nuevas posicion es igual al ultimo movimineto
        node = mov[mov.length-1];
        console.log(node);//*
        
        //matriz que guarda las posibles posiciones adyacentes al nodo 
        //[]1º para elegir cual nodo adyacente []2ª los valores X o Y del nodo adyacente
        var nodesAdyPos = new Array(8);
        nodesAdyPos[0] = new Array(node.pos[0], node.pos[1]-1); nodesAdyPos[1] = new Array(node.pos[0]+1, node.pos[1]-1);//norte, noreste
        nodesAdyPos[2] = new Array(node.pos[0]+1, node.pos[1]); nodesAdyPos[3] = new Array(node.pos[0]+1, node.pos[1]+1);//este, sreste
        nodesAdyPos[4] = new Array(node.pos[0], node.pos[1]+1); nodesAdyPos[5] = new Array(node.pos[0]-1, node.pos[1]+1);//sur, suroeste
        nodesAdyPos[6] = new Array(node.pos[0]-1, node.pos[1]); nodesAdyPos[7] = new Array(node.pos[0]-1, node.pos[1]-1);//oeste, noroeste
        
        //se guardan las posiciones adyacentes disponibles
        var nod;
        for(var x = 0; x < 8; x++){
        
            var posX = nodesAdyPos[x][0],
                posY = nodesAdyPos[x][1];
            
            if(posX >= 0 && posY >= 0 && posX < matriz.sizeX && posY < matriz.sizeY){
                
                nod = (matriz.mtrz[posX][posY] === 0)? new ANode(posX, posY) : null;
                if(nod !== null){ 
                    
                    //se inicializan los datos del nodo, luego se guarda en la lista de nodos abiertos
                    nod.parentNode = node.pos;
                    nod.calcF(costMov);
                    abierto.push(nod);
                    
                }
                
            }
        
        }//fin For
        
        //establece el nodo con la menor distancia al destino
        var f = 1000000;
        console.log("abierto length : "+abierto.length);
        for(var x = 0; x < abierto.length; x++){
        
            if(abierto[x].f < f){
            
                f = abierto[x].f;
                node = abierto[x];
            
            }
        
        }
        
        //si el nodo esta ubicado en el destino se cierra el bucle
        if( matriz.dest[0] === node.pos[0] && matriz.dest[1] === node.pos[1] ){
        
            break;
        
        }
        else{//de lo contrario se agrega a la lista de movimientos
            
            mov.push(node);
            costMov += dist(node.pos[0], node.pos[1], node.parentNode[0], node.parentNode[1]);
            abierto = new Array();//se limpia la lista
            console.log(node.pos[0]+" : "+node.pos[1]);
            
            matriz.mtrz[ node.pos[0] ][ node.pos[1] ] = 1;//se cierra el nodo
        
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
    
    this.calcF = function(costMov){
    
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



































