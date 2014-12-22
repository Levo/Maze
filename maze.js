function setNodeIDs(){
	var nodes = document.getElementsByClassName("node");
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].id = i;
	};
}



function generateMaze(width, height){
	var width = width;
	var height = height;

	var graph = [];	

// var associativeArray = {};
// associativeArray["one"] = "First";

	var walls = {};
		
		
	int location = 0;

	for (var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++){
			graph.push(location);

		}
	};


}