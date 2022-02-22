// some globals
var gl, program, canvas;
var vertLoc, vBuffer, vertices = [], cols = [], delay = 100;
var MaxPoints = 100, counter = 0, text_area;
var world_xmin, world_ymin, world_xmax, world_ymax;
var x, y;
var pos;
var drawPT = true;

window.onload = function init() {
	// get the canvas handle from the document's DOM
    canvas = document.getElementById( "gl-canvas" );
    
	// initialize webgl
    gl = initWebGL(canvas);

    // set up a viewing surface to display your image
	// All drawing will be restricted to these dimensions
    gl.viewport( 0, 0, canvas.width, canvas.height );

	// clear the display with a background color 
	// specified as R,G,B triplet in 0 to 1.0 range
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //  Load shaders -- all work done in init_shaders.js
	//  Shaders are compiled and linked and returned as an
	//  executable program; the arguments are the names
	// of the shaders specified in the html file
    program = initShaders(gl, "vertex-shader", "fragment-shader");
	// make this program the current shader program
    gl.useProgram(program);

	// create a vertex buffer - to hold point data
	vBuffer = gl.createBuffer();
	
	// set this buffer the active buffer for subsequent operations on it
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	// Associate our shader variables with our data buffer
    // note: "vposition" is a named variable used in the vertex shader and is
    // associated with vPosition here
    var vPosition = gl.getAttribLocation( program, "vPosition");

    // specify the format of the vertex data - here it is a float with
    // 2 coordinates per vertex - these are its attributes
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);

    // enable the vertex attribute array 
    gl.enableVertexAttribArray(vPosition);

	// create a color buffer - to hold vertex colors
	cBuffer = gl.createBuffer();
    
	// set this buffer the active buffer, set attributes
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	var vColor = gl.getAttribLocation( program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	//setEventHandlers();
    render();
};

function render() {
	// first clear the display with the background color
    gl.clear( gl.COLOR_BUFFER_BIT );

	if (counter)
    	gl.drawArrays(gl.POINTS, 0, counter);

	// recursive call to render, to continuously update geometry
    setTimeout(
        function (){
			requestAnimFrame(render);}, delay
    	);
}

function setEventHandlers() {

    window.onmousedown = function (evt) { // mouse handler
		// add a vertex, positioning it randomly
		if(drawPT){
			if (counter < MaxPoints) {
				pos = getMousePosWorld(canvas, evt);
				text_area.value += "X: " + pos[0] + " Y: " + pos[1] + "\n";
				generatePoint(pos[0], pos[1]);
			}
		}
		
    }
	document.getElementById("update_world").onclick = function (evt) {
		world_xmax = document.getElementById("worldXmax").value;
		world_ymax = document.getElementById("worldYmax").value;
		world_xmin = document.getElementById("worldXmin").value;
		world_ymin = document.getElementById("workYmin").value;
	}
	document.getElementById("draw_point").onclick =  function (evt) {// button handler
		if (drawPT){
			document.getElementById("draw_point").innerText = "Draw Point[OFF]"
		}
		else{
			document.getElementById("draw_point").innerText = "Draw Point[ON]"
		}
		drawPT = !drawPT;
	}
	// text area for messages
	text_area = document.getElementById( "myTextArea" );
	text_area.value = "";
}

function xform_world(){
	//var xform = gl.uniformed4f
}

function getMousePosWorld(canvas, evt){
	var rect = canvas.getBoundingClientRect();
	var xScale = canvas.width / rect.width;
	var yScale = canvas.height / rect.height; 
	var xPix = (evt.x - rect.left) / xScale;
	var yPix = (evt.y - rect.top) / yScale;
	x = world_xmin + xPix * (world_xmax-world_xmin) / width;
	y = world_ymin + yPix * (world_ymax-world_ymin) / height;
	return [x, y];
}

function generatePoint(x, y) { // creates point and sends to GPU
	if (counter < MaxPoints) {
		// set point position
		console.log(x);
		console.log(y);
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		vertices.push(x, y, 0.0, 1.);
		gl.bufferData (gl.ARRAY_BUFFER, flatten(vertices), gl.DYNAMIC_DRAW);

		// set color
        gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
		cols.push(Math.random(), Math.random(), Math.random(),  1.);
		gl.bufferData (gl.ARRAY_BUFFER, flatten(cols), gl.DYNAMIC_DRAW);
		counter++;
	}
}
