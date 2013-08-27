// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


var Cell = function(x,y, _cells){
	var me = this;

	me.isAlive = false;
	me.x = x;
	me.y = y;
	me.distance = function(cell){
		return Math.abs(cell.x - me.x) + Math.abs(cell.y - me.y);
	};

	me.neighbors = null;	

	me.countNeighbors = function(){
		return me.neighbors.filter(function(cell){
			return cell.isAlive;
		}).length;
	};

	return me;
};


var Grid = function(width, height){
	var me = this;
	var _cells = new Array(width*height);

	var _living = [];

	// instantiate cells
	for(var i = 0; i < width; i++){
		for(var j = 0; j < height; j++){
			(function(){
				_cells[i+j*width] = new Cell(i, j, _cells);
			})();			
		}
	}

	// assign neighbors
	_cells.forEach(function(cell){
		cell.neighbors = _cells.filter(function(cell2){
			var dx = Math.abs(cell2.x - cell.x);
			var dy = Math.abs(cell2.y - cell.y);
			return (dx === 1 && dy === 1 ) || (dx === 1 && dy === 0) || (dx === 0 && dy === 1);
		});
	});


	me.filter = function(fcn){
		return _cells.filter(fcn);
	};

	me.updateLiving = function(){
		

		var deadOvercrowded = _cells.filter(function(cell){
			return cell.isAlive && (cell.countNeighbors() > 3);
		});

		var deadUnderpop = _cells.filter(function(cell){
			return cell.isAlive && (cell.countNeighbors() < 2);
		})

		

		var reproduction = _cells.filter(function(cell){
			return !cell.isAlive && cell.countNeighbors() === 3;
		});

		var livesOn = _cells.filter(function(cell){
			return cell.isAlive && (cell.countNeighbors() === 2 || cell.countNeighbors() === 3);
		});

		deadOvercrowded.concat(deadUnderpop).forEach(function(cell){
			cell.isAlive = false;
		});

		reproduction.forEach(function(cell){
			cell.isAlive = true;
		});
		livesOn.forEach(function(cell){
			cell.isAlive = true;
		});

	};

	me.getCell = function(x,y){
		return _cells[x+y*width];
	};

	return me;
}
