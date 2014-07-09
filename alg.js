
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
        cont = 0;
    while(true){
    
        //se revisa siguiendo el orden de las agujas del reloj
        
        //la nuevas posicion es igual al ultimo movimineto
        node = mov[mov.length-1];
        console.log(node);
        
        /*
        //matriz que guarda las posibles posiciones adyacentes al nodo 
        //[]1º para elegir cual nodo adyacente []2ª los valores X o Y del nodo adyacente
        /*var nodesAdyPos = new Array(8);
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
        */

        adyacentNodes(node, abierto, costMov);
        
        //establece el nodo con la menor distancia al destino
        var f = 1000000,
            num;
        console.log("abierto length : "+abierto.length);
        for(x = 0; x < abierto.length; x++){
        
            if(abierto[x].f < f){
            
                f = abierto[x].f;
                node = abierto[x];
                num = x;
            
            }
        
        }
        
        //si el nodo esta ubicado en el destino se cierra el bucle
        if( matriz.dest[0] === node.pos[0] && matriz.dest[1] === node.pos[1] ){
        
            //ya que el nodo actual esta en la posicion actual se pasa su nodo padre
            mov = rutaIniToDest(node.parentNode);
            break;
        
        }
        else{//de lo contrario se agrega a la lista de movimientos
            
            abierto.splice(num,1);//se borra el nodo de la lista

            mov.push(node);
            costMov += dist(node.pos[0], node.pos[1], node.parentNode[0], node.parentNode[1]);
            console.log(node.pos[0]+" : "+node.pos[1]);
            
            matriz.mtrz[ node.pos[0] ][ node.pos[1] ] = 1;//se cierra el nodo
        
        }
        
        if(cont >= 200 ){ console.error("Limite de movimentos alcanzado"); break; }
        else{ cont++; }
    
    }//fin while
    
    console.log("Listo!!!!!!");
    for(x = 0; x < mov.length-1; x++){

        console.log(mov[x][0]+":"+mov[x][1]);

    }
    
    paintMovs(mov);
    
    return;

}

function adyacentNodes(node, abierto, costMov){

    var nodesAdyPos = new Array(8);
        nodesAdyPos[0] = new Array(node.pos[0], node.pos[1]-1); nodesAdyPos[1] = new Array(node.pos[0]+1, node.pos[1]-1);//norte, noreste
        nodesAdyPos[2] = new Array(node.pos[0]+1, node.pos[1]); nodesAdyPos[3] = new Array(node.pos[0]+1, node.pos[1]+1);//este, sreste
        nodesAdyPos[4] = new Array(node.pos[0], node.pos[1]+1); nodesAdyPos[5] = new Array(node.pos[0]-1, node.pos[1]+1);//sur, suroeste
        nodesAdyPos[6] = new Array(node.pos[0]-1, node.pos[1]); nodesAdyPos[7] = new Array(node.pos[0]-1, node.pos[1]-1);//oeste, noroeste

    var nod;
    for(var x = 0; x < 8; x++){

        var posX = nodesAdyPos[x][0],
            posY = nodesAdyPos[x][1];

        //true si la posicion esta dentro del rango de la matriz
        if(posX >= 0 && posY >= 0 && posX < matriz.sizeX && posY < matriz.sizeY){

            //true si el nodo esta abierto
            if(matriz.mtrz[posX][posY] === 0){

                nod = new ANode(posX, posY)
                for(var num = 0; num < abierto.length; num++){

                    //true si si el nodo ya esta en la lista
                    nod = (posX === abierto[num].pos[0] && posY === abierto[num].pos[1])? null : nod;

                }

            }

            if(nod !== null && nod !== undefined){

                //se inicializan los datos del nodo, luego se guarda en la lista de nodos abiertos
                nod.parentNode = node;
                nod.calcF(costMov);
                abierto.push(nod);

            }

        }

    }//fin For*/

}

function rutaIniToDest(node){

    var ruta = new Array();
    ruta.push( node.pos );

    var cont = 0;
    while(true){

        if(node.parentNode === null){ ruta.push(node.pos); break; }

        ruta.push(node.pos);
        node = node.parentNode;

    }

    console.log("ruta encontrada");
    console.info(ruta)
    return ruta.reverse();

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

    if(posX !== parentX && posY !== parentY){
        
        return 14;
    
    }
    else{ return 10; }

}

function ANode(x, y){

    //true:abierto false:cerrado
    this.state = true;
    this.pos = [(x == null)? 0 : x, (y == null)? 0 : y];
    this.parentNode = null;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    
    this.calcF = function(costMov){
    
        if( this.parentNode.pos[0] == null || this.parentNode.pos[1] == null){
        
            console.error("falta informacion 'ANode.calcF()' : "+this.parentNode);
            
        }
        
        this.h = heuristic(this.pos[0], this.pos[1]);
        this.g = this.parentNode.g + dist(this.pos[0], this.pos[1], this.parentNode[0], this.parentNode[1]);
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









