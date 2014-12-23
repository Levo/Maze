function init(){
	var newWidth = document.getElementById("Width").value;
	var newHeight = document.getElementById("Height").value;
	var newTileSize = document.getElementById("TileSize").value;
	var tileSizeString = newTileSize.toString();
	var tileSize = newTileSize
    var width = newWidth;
    var height = newHeight;

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


	var grid = document.getElementById("grid");

	while (grid.firstChild) {
	    grid.removeChild(grid.firstChild);
	}

	grid.style.width = width * tileSize;
	grid.style.height = height * tileSize;

	for (var i = 0; i < width*height; i++) {
		var fragment = create('<div class="node" id=null style="width:'+ tileSizeString + 'px; height: '+ tileSizeString + 'px; border-right: 1px solid; border-bottom: 1px solid; border-right-color: black; border-bottom-color: black;"></div>');
		grid.insertBefore(fragment,grid.childNodes[0]);
	};


    setNodeIDs(width,height);
    var set = new Disjointset();
    generateMaze(width, height, set, tileSize);
}

function setNodeIDs(width, height){
	var nodes = document.getElementsByClassName("node");
	nodes[0].style.color = "green";
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].id = i;
	};		
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

function updateMaze(width, height, graph, walls){
	var nodes = document.getElementsByClassName("node");
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			var index = graph[i][j];

			if(walls[index].down === false){
				nodes[index].style.borderBottomColor = "white";
			}
			if(walls[index].right === false)
			{
				nodes[index].style.borderRightColor = "white";
			}

		}
	}
	drawExtraWalls(graph,height,width);
}

function drawExtraWalls(graph,height,width){
	var nodes = document.getElementsByClassName("node");
	for (var i = 0; i < height; i++) {
		var index = graph[0][i];
		nodes[index].style.borderLeft = "1px solid";
		nodes[index].style.borderLeftColor = "black";
	};
	for (var i = 1; i < width; i++) {
		var index = graph[i][0];
		nodes[index].style.borderTop = "1px solid";
		nodes[index].style.borderTopColor = "black";
	};

	var index = graph[width-1][height-1];
	nodes[index].style.borderBottomColor = "white";
}

function generateMaze(width, height, kruskal, tileSize){
	var width = width;
	var height = height;
	var setSize = 0;
	var graph = [];	

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
			nodes[location].style.top = j * tileSize;

			walls[location] = {down: true, right: true};

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
    updateMaze(width, height, graph, walls);
}

function solveMaze(walls, graph){

}