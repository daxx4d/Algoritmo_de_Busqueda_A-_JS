
//var costMov = 0;

function main(matriz){
    
    var matrz = new Matriz(matriz.sizeX, matriz.sizeY);
    matrz.ini[0] = matriz.ini[0];
    matrz.ini[1] = matriz.ini[1];
    matrz.dest[0] = matriz.dest[0];
    matrz.dest[1] = matriz.dest[1];
    matrz.init();
    for(var limX = 0; limX < matriz.sizeX; limX++){
        
        for(var limY = 0; limY < matriz.sizeY; limY++){
            
            matrz.mtrz[limX][limY] = matriz.mtrz[limX][limY];
            
        }
        
    }
    //contendra los movimientos necesarios para llegar a destino 
    var mov = new Array();
    
    //establece la ubicacion inicial como primera posicion
    var node = new ANode(matrz.ini[0], matrz.ini[1]);
    node.g = 0;
    matrz.mtrz[ node.pos[0] ][ node.pos[1] ] = 1;
    mov.push(node);
    
    var abierto = new Array(),
        cont = 0,
        limt = 1000;
    while(true){
        
        //la nuevas posicion es igual al ultimo movimineto
        node = mov[mov.length-1];
        console.log(node);

        adyacentNodes(matrz, node, abierto);
        
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
        if( matrz.dest[0] === node.pos[0] && matrz.dest[1] === node.pos[1] ){
        
            //ya que el nodo actual esta en la posicion actual se pasa su nodo padre
            mov = rutaIniToDest(node.parentNode);
            break;
        
        }
        else{//de lo contrario se agrega a la lista de movimientos
            
            abierto.splice(num,1);//se borra el nodo de la lista

            mov.push(node);
            console.log(node.pos[0]+" : "+node.pos[1]);
            
            matrz.mtrz[ node.pos[0] ][ node.pos[1] ] = 1;//se cierra el nodo
        
        }
        
        if(cont > limt){ console.error("Limite de movimentos alcanzado main()"); break; }
        else{ cont++; }
    
    }//fin while
    
    console.log("Listo!!!!!!");
    for(x = 0; x < mov.length-1; x++){ console.log(mov[x][0]+":"+mov[x][1]); }
    
    paintMovs(mov);
    
    return;

}

function adyacentNodes(matrz, node, abierto){

    //se establece las posiciones de los nodos adyacentes
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
        if(posX >= 0 && posY >= 0 && posX < matrz.sizeX && posY < matrz.sizeY){

            //true si el nodo esta abierto
            if(matrz.mtrz[posX][posY] === 0){

                nod = new ANode(posX, posY)
                for(var num = 0; num < abierto.length; num++){

                    //true si si el nodo ya esta en la lista
                    nod = (posX === abierto[num].pos[0] && posY === abierto[num].pos[1])? null : nod;

                }

            }

            if(nod !== null && nod !== undefined){

                //se inicializan los datos del nodo, luego se guarda en la lista de nodos abiertos
                nod.parentNode = node;
                nod.calcF(matrz);
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

        //si el nodo no tiene un nodo padre significa que es el nodo inicial por lo que el bucle se termina
        if(node.parentNode === null){ ruta.push(node.pos); break; }

        //se añade el nuevo nodo a la lista
        ruta.push(node.pos);
        node = node.parentNode;

        if(cont > 500){ console.error("limite de pasos alcanzado rutaIniToDest()"); break; }
        
    }

    console.log("ruta encontrada");
    console.info(ruta)
    return ruta.reverse();

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
    
    this.calcF = function(matrz){
    
        if( this.parentNode.pos[0] == null || this.parentNode.pos[1] == null){
        
            console.error("falta informacion 'ANode.calcF()' : "+this.parentNode);
            
        }
        
        this.h = this.heuristic(matrz);
        this.g = this.parentNode.g + dist(this.pos[0], this.pos[1], this.parentNode[0], this.parentNode[1]);
        this.f = this.h + this.g;
    
    }
    
    this.heuristic = function(matrz){

        var IPosX = this.pos[0],
            IPosY = this.pos[1],
            FPosX = matrz.dest[0],
            FPosY = matrz.dest[1];
    
        var totX = (IPosX > FPosX)? IPosX - FPosX : FPosX - IPosX,
            totY = (IPosY > FPosY)? IPosY - FPosY : FPosY - IPosY;
    
        return totX+totY;

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









