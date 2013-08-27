var App = function(targetElementId, viewWidth, viewHeight, squaresX, squaresY){
	var me = this;
	// Grab the canvas
	me.canvas = document.getElementById(targetElementId);
	me.ctx = me.canvas.getContext("2d");

	// Grab the start button
	me.button = document.getElementById("start");

	// Initialize page styles
	var body = document.getElementsByTagName('body')[0];
	body.style.margin = '0px';
	body.style.overflow = "hidden";

	// Set height and width to window inner height
	viewWidth = me.canvas.width = window.innerWidth ;//viewWidth || 600;
  	viewHeight = me.canvas.height = window.innerHeight ;//viewHeight || 600;

  	squaresX = squaresX || 20;
  	squaresY = squaresY || 20;

  	var _squareWidth = me.canvas.width/squaresX;
  	var _squareHeight = _squareWidth;//me.canvas.height/squaresY;

  	var grid = new Grid(squaresX, squaresY);


  	// Handle Click events
	var _mouseDown = false;
	var handleClick = function(event){
		var x = event.pageX - me.canvas.offsetLeft;
		var y = event.pageY - me.canvas.offsetTop;
		
		var i = Math.floor(x/_squareWidth);
		var j = Math.floor(y/_squareHeight);

		grid.getCell(i, j).isAlive = true;
		return;
	};

	var _startSim = false;

	window.onkeydown = function(ev){
		_startSim = !_startSim;
	};

	window.onresize = function(ev){
		viewWidth = me.canvas.width = window.innerWidth;//viewWidth || 600;
  		viewHeight = me.canvas.height = window.innerHeight;//viewHeight || 600;
	};

	me.canvas.addEventListener('mousedown', function(event){
		_mouseDown = true;
		handleClick(event);
		me.canvas.addEventListener('mousemove', handleClick);
	});

	me.canvas.addEventListener('mouseup', function(event){
		_mouseDown = false;
		me.canvas.removeEventListener('mousemove', handleClick);
	});

	me.start = function(){
		setInterval(function(){
			me.update();
			me.draw();
		}, 60);

	};

	me.update = function(){
		if(_startSim){
			grid.updateLiving();	
		}
	};

	me.draw = function(){
		// Erase previous draw
		me.ctx.fillStyle = 'white';
	 	me.ctx.fillRect(0,0,me.canvas.width,me.canvas.height);

	 	// Draw living squares
	 	grid.filter(function(cell){
	 		return cell.isAlive;
	 	}).forEach(function(cell){
	 		me.ctx.fillStyle = 'black';
	 		me.ctx.fillRect(cell.x * _squareWidth, cell.y * _squareHeight, _squareWidth, _squareHeight);
	 	});



	 	// Draw grid
	 	
	 	me.ctx.fillStyle = 'gray';
	 	for(var x = 0; x <= viewWidth; x+=_squareWidth){
	 		me.ctx.beginPath();
	 		me.ctx.moveTo(x, 0);
	 		me.ctx.lineTo(x, viewHeight);
	 		me.ctx.stroke();
	 	};

	 	for(var y = 0; y <= viewHeight; y+= _squareHeight){
	 		me.ctx.beginPath();
	 		me.ctx.moveTo(0, y);
	 		me.ctx.lineTo(viewWidth, y);
	 		me.ctx.stroke();	
	 	};
	};

	return me;
};


var app = new App("game", 1000, 1000, 100, 50);
app.start();