function init(){
	var newWidth = document.getElementById("Width").value;
	var newHeight = document.getElementById("Height").value;
	var newTileSize = document.getElementById("TileSize").value;
	var tileSizeString = newTileSize.toString();
	var tileSize = newTileSize
    var width = newWidth;
    var height = newHeight;

	var grid = document.getElementById("grid");

	while (grid.firstChild) {
	    grid.removeChild(grid.firstChild);
	}

	grid.style.width = width * tileSize;
	grid.style.height = height * tileSize;

	var innerWalls="<div id=\"borderDown\" style=\"top:"+(tileSize-1)+"px; width:"+(tileSize)+"px;\"><\/div>";
	var rightWalls= "<div id=\"borderRight\" style=\"left:"+(tileSize-1)+"px;\"><\/div>";

	for (var i = 0; i < width*height; i++) {
		var fragment = create('<div class="node" id='+i+' style="width:'+ tileSizeString + 'px; height: '+ tileSizeString + 'px;">'+innerWalls+rightWalls+'</div>');		
		grid.insertBefore(fragment,grid.childNodes[0]);
	};

    var set = new Disjointset();
    generateMaze(width, height, set, tileSize);
}
function keyBoardInit(event){
	document.body.addEventListener("keypress", function(event){
		if(event.keyCode === 13 ){
			init();
		}
	},false);
}

// http://stackoverflow.com/questions/814564/inserting-html-elements-with-javascript
function create(htmlStr) {
    var frag = document.createDocumentFragment(),
        temp = document.createElement('div');
    temp.innerHTML = htmlStr;
    while (temp.firstChild) {
        frag.appendChild(temp.firstChild);
    }
    return frag;
}

// http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function updateMaze(width, height, graph, walls, tileSize){
	var nodes = document.getElementsByClassName("node");
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			var index = graph[i][j];

			if(walls[index].down === false){
				nodes[index].childNodes[0].style.borderBottomColor = "white";
				nodes[index].childNodes[0].style.borderBottom = "0px";
			}
			if(walls[index].right === false)
			{
				nodes[index].childNodes[1].style.borderRightColor = "white";
				nodes[index].childNodes[1].style.borderRight = "0px";
			}

		}
	}
	drawExtraWalls(graph,height,width,tileSize);
}

function drawExtraWalls(graph,height,width,tileSize){
	var nodes = document.getElementsByClassName("node");
	for (var i = 0; i < height; i++) {
		var index = graph[0][i];
		nodes[index].style.borderLeft = "1px solid";
		nodes[index].style.borderLeftColor = "black";
	};
	for (var i = 0; i < width; i++) {
		var index = graph[i][0];
		nodes[index].style.borderTop = "1px solid";
		nodes[index].style.borderTopColor = "black";
	};

	var index = graph[width-1][height-1];
	nodes[index].childNodes[0].style.borderBottom = "0px";
	nodes[0].style.borderTopColor = "white";
	nodes[0].style.borderTop = "0px";
	nodes[0].childNodes[0].style.top = tileSize+"px";
}

function generateMaze(width, height, kruskal, tileSize){
	var width = width;
	var height = height;
	var setSize = 0;
	var graph = [];	

	var visitedMap = {};
	var walls = {};

	var rightWalls = [];
	var downWalls = [];
		
	var location = 0;

	kruskal.addElements(width*height);

	var nodes = document.getElementsByClassName("node");

	for (var i = 0; i < width; i++) {
		graph[i] = new Array(height);
		for(var j = 0; j < height; j++){
			graph[i][j] = location;

			nodes[location].style.left = (i * tileSize);
			nodes[location].style.top = (j * tileSize);

			walls[location] = {down: true, right: true};
			visitedMap[location] = false;


			rightWalls.push({x:i, y:j});
			downWalls.push({x:i, y:j});
			location++;
		}
	};

	var rightWalls = shuffle(rightWalls);
	var downWalls = shuffle(downWalls);
	while(setSize != kruskal.elements - 1){
		var randomWall = Math.floor((Math.random() * 2) + 1)
		if(randomWall === 1 && downWalls.length > 0){
			var currentNode = downWalls.pop();
			var currentNodePosX = currentNode.x;
			var currentNodePosY = currentNode.y;
			var downNodePosY = currentNodePosY + 1;
			if(downNodePosY < height){
				var u = graph[currentNodePosX][currentNodePosY];
				var v = graph[currentNodePosX][downNodePosY];
				if(kruskal.find(u) != kruskal.find(v)){
					kruskal.setUnion(u,v);
					setSize++;
					walls[u].down = false;
				}
			}
		}else if(randomWall === 2 && rightWalls.length > 0){
			var currentNode = rightWalls.pop();
			var currentNodePosX = currentNode.x;
			var currentNodePosY = currentNode.y;
			var rightNodePosX = currentNodePosX + 1;
			if(rightNodePosX < width){
				var u = graph[currentNodePosX][currentNodePosY];
				var v = graph[rightNodePosX][currentNodePosY];
				if(kruskal.find(u) != kruskal.find(v)){
					kruskal.setUnion(u,v);
					setSize++;
					walls[u].right = false;
				}
			}
		}
	}
    updateMaze(width, height, graph, walls, tileSize);
    solveMaze(walls, graph, height, width, visitedMap, tileSize);
}

function solveMaze(walls, graph, height, width, visitedMap, tileSize){
	var Q = [];
	var sX = 0;
	var sY = 0;
	var sXY = {x: sX, y: sY};
	var longestDistance = 0;
	var longestIndex = 0;
	var longestX = 0;
	var longestY = 0;
	var distanceMap = {};
	var parentMap = {};
	var directionMap = {}; 
	var startingNode = graph[sX][sY];
	distanceMap[startingNode] = 0;
	Q.push(sXY);
	while(Q.length > 0){
		var currentNode = Q.shift();
		var indexCurrentNode = graph[currentNode.x][currentNode.y];
		if(move(currentNode.x, currentNode.y, "east", width, height, graph, walls)){
			var rightNode = graph[currentNode.x + 1][currentNode.y];
			if(visitedMap[rightNode] === false){
				var newNode = {x: currentNode.x + 1, y: currentNode.y};
				Q.push(newNode);
				distanceMap[rightNode] = distanceMap[indexCurrentNode] + 1;
				parentMap[rightNode] = indexCurrentNode;
				directionMap[rightNode] = "east";
				visitedMap[rightNode] = true;
			}
		}
		if(move(currentNode.x, currentNode.y, "south", width, height, graph, walls)){
			var downNode = graph[currentNode.x][currentNode.y + 1];
			if(visitedMap[downNode] === false){
				var newNode = {x: currentNode.x, y: currentNode.y + 1};
				Q.push(newNode);
				distanceMap[downNode] = distanceMap[indexCurrentNode] + 1;
				parentMap[downNode] = indexCurrentNode;
				directionMap[downNode] = "south";
				visitedMap[downNode] = true;
			}
		}
		if(move(currentNode.x, currentNode.y, "west", width, height, graph, walls)){
			var leftNode = graph[currentNode.x - 1][currentNode.y];
			if(visitedMap[leftNode] === false){
				var newNode = {x: currentNode.x - 1, y: currentNode.y};
				Q.push(newNode);
				distanceMap[leftNode] = distanceMap[indexCurrentNode] + 1;
				parentMap[leftNode] = indexCurrentNode;
				directionMap[leftNode] = "west";
				visitedMap[leftNode] = true;
			}
		}
		if(move(currentNode.x, currentNode.y, "north", width, height, graph, walls)){
			var northNode = graph[currentNode.x][currentNode.y - 1];
			if(visitedMap[northNode] === false){
				var newNode = {x: currentNode.x, y: currentNode.y - 1};
				Q.push(newNode);
				distanceMap[northNode] = distanceMap[indexCurrentNode] + 1;
				parentMap[northNode] = indexCurrentNode;
				directionMap[northNode] = "north";
				visitedMap[northNode] = true;
			}
		}
	}

	longestIndex = graph[width-1][height-1];
	var nodes = document.getElementsByClassName("node");

	while(longestIndex != startingNode){
		nodes[longestIndex].style.backgroundColor = "red";
		longestIndex = parentMap[longestIndex];
	}

	nodes[0].style.backgroundColor = "red";

}

function move(x, y, direction, width, height, graph, walls){

	if(direction === "east"){
		var nX = x + 1;
		if(nX < width){
			var currentNode = graph[x][y];
			if(!walls[currentNode].right){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else if(direction === "south"){
		var nY = y + 1;
		if(nY < height){
			var currentNode = graph[x][y];
			if(!walls[currentNode].down){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else if(direction === "west"){
		var nX = x - 1;
		if(nX >= 0){
			var currentNode = graph[nX][y];
			if(!walls[currentNode].right){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}else if(direction === "north"){
		var nY = y - 1;
		if(nY >= 0){
			var currentNode = graph[x][nY];
			if(!walls[currentNode].down){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}

}


