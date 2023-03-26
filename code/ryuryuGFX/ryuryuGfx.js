// +-------------------------------------+
// | MADE BY OGAN OEZKUL AKA RYUGUU CHAN |
// +-------------------------------------+


// the shape class
class Shape
{
	constructor()
	{
		this.vertecies = [];
		this.fragmentShaderCode  = '';
	}

	// creating the Fragment Shader Code based on a simple RGBA color code
	setSolidColorFromRGBA(r, g, b, a)
	{
		if (typeof(r) == 'number' && typeof(g) == 'number' && typeof(b) == 'number' && typeof(a) == 'number')
		{
			if
			(
				(r >= 0 && r <= 1) &&
				(g >= 0 && g <= 1) &&
				(b >= 0 && b <= 1) &&
				(a >= 0 && a <= 1)
			)
			{
				// creating the code
				this.fragmentShaderCode = [
					'precision mediump float;',
					'void main(){gl_FragColor = vec4(' + r + ', ' + g + ', ' + b + ', ' + a + ');}'
				].join('\n');

			}
			else
			{
				console.error('all the color channel must be between 0 and 1!');
			}
		}
		else
		{
			console.error('all the color channels have to be numbers');
		}
	}

	// setting the shape's vertex shader code
	setVertexShaderSourceCode(shaderCode)
	{
		if (typeof(shaderCode) == 'string') { this.vertexShaderCode = shaderCode; }
		else { console.error('the vertexShaderCode parameter must be a string!'); }
	}
	
	// setting the shape's fragment shader code
	setFragmentShaderSourceCode(shaderCode)
	{
		if (typeof(shaderCode) == 'string') { this.fragmentShaderCode = shaderCode; }
		else { console.error('the vertexShaderCode parameter must be a string!'); }
	}

	setVertecies(v)
	{
		if (typeof(v) == 'object')
		{
			for (let i = 0; i < v.length; i++)
			{
				if (typeof(v[i]) == 'number')
				{
					if (v[i] >= -1 && v[i] <= 1) { this.vertecies.push(v[i]); }
					else
					{
						console.error('the ' + i + 'rd number must be between 0 and 1!');
						return;
					}
				}
				else
				{
					console.error('v most only contain numbers!');
					return;
				}
			}
		}
		else
		{
			console.error('v must be a array object!');
		}
	}

	rotate(degree, origin)
	{
		if (typeof(degree) == 'number' && typeof(origin) == 'object')
		{
			if (origin.length == 2)
			{
				for (let i = 0; i < this.vertecies.length; i += 2)
				{
					let originalXcoord = this.vertecies[i];
					let originalYcoord = this.vertecies[i+1]

					let r00 = Math.cos(degree);
					let r01 = (Math.sin(degree) * (-1));
					let r10 = Math.sin(degree);
					let r11 = Math.cos(degree);

					let futureXcoord = (r00 * originalXcoord + r01 * originalYcoord + origin[0] - r00 * origin[0] - r01 * origin[1]);
					let futureYcoord = (r10 * originalXcoord + r11 * originalYcoord + origin[1] - r10 * origin[0] - r11 * origin[1]);

					this.vertecies[i] = futureXcoord;
					this.vertecies[i+1] = futureYcoord;
				}
			}
			else
			{
				console.error('the origin must contain 2 coordinates (x and y)');
			}
		}
		else
		{
			console.error('the degree must be a number and the origin must be a array of 2 numbers!');
		}

	}

	getVertecies() { return this.vertecies; }

	// getting the fragment shaer code
	getFragmentShaderCode() { return this.fragmentShaderCode; }

	// getting the vertex shader code
	getVertexShaderCode() { return this.vertexShaderCode }


}

// the namespace
const ryuryuGfx = 
{
	// the webGL context
	gl: null,
	clarColor: [0, 0, 0, 0],

	// the GL drawing mode
	drawingModes: {
		point: 			0, // gl.POINTS
		lines: 			1, // gl.LINES
		stripes: 		2, // gl.LINE_STRIP
		closedLineLoop: 	3, // gl.LINE_LOOP
		triangles: 		4, // gl.TRIANGLES
		triangleStripes: 	5, // gl.TRIANGLE_STRIP
		connectedTriangles: 	6  // gl.TRIANGLE_FAN
	},

	draw: function(shapeToDraw, drawingMode)
	{
		if (shapeToDraw instanceof Shape && typeof(drawingMode) == 'number')
		{
			if (gl != null)
			{
				const drawingModeList = [
					gl.POINTS,
					gl.LINES,
					gl.LINES_STRIP,
					gl.LINE_LOOP,
					gl.TRIANGLES,
					gl.TRIANGLE_STRIP,
					gl.TRIANGLE_FAN
				];

				let sampleVertexShaderCode = [
					'precision mediump float;',
					'attribute vec2 vPos;',
					'void main(){gl_Position = vec4(vPos, 0, 1);}'
				].join('\n');

				let futureShapeVertexShader = gl.createShader(gl.VERTEX_SHADER);
				let futureShapeFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

				gl.shaderSource(futureShapeVertexShader, sampleVertexShaderCode);
				gl.shaderSource(futureShapeFragmentShader, shapeToDraw.getFragmentShaderCode());

				gl.compileShader(futureShapeVertexShader);
				gl.compileShader(futureShapeFragmentShader);

				if (!gl.getShaderParameter(futureShapeVertexShader, gl.COMPILE_STATUS))
				{
					console.error
					(
						'the shape\'s vertex shader code couldn\'t be compiled!\n---\n' +
						gl.getShaderInfoLog(futureShapeVertexShader)
					);
					return;
				}
				
				if (!gl.getShaderParameter(futureShapeFragmentShader, gl.COMPILE_STATUS))
				{
					console.error
					(
						'the shape\'s fragment shader code couldn\'t be compiled!\n---\n' +
						gl.getShaderInfoLog(futureShapeFragmentShader)
					);
					return;
				}

				let futureShapeShaderProgram = gl.createProgram();

				gl.attachShader(futureShapeShaderProgram, futureShapeVertexShader);
				gl.attachShader(futureShapeShaderProgram, futureShapeFragmentShader);

				gl.linkProgram(futureShapeShaderProgram);
				if (!gl.getProgramParameter(futureShapeShaderProgram, gl.LINK_STATUS))
				{
					console.error('the shape\'s shader program couldn\'t be linked!');
					return;
				}

				gl.validateProgram(futureShapeShaderProgram);
				if (!gl.getProgramParameter(futureShapeShaderProgram, gl.VALIDATE_STATUS))
				{
					// bs. Everyone is valid :3
					console.error('the shape\'s shader pgoram coulnd\'t be validated!');
					return;
				}
				
				let futureShapeVertexBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, futureShapeVertexBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeToDraw.getVertecies()), gl.STATIC_DRAW);

				let positionAttributeLocation = gl.getAttribLocation(futureShapeShaderProgram, 'vPos');
				gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, gl.FALSE, (2 * Float32Array.BYTES_PER_ELEMENT), 0);
				gl.enableVertexAttribArray(positionAttributeLocation);
				
				gl.useProgram(futureShapeShaderProgram);

				gl.drawArrays(drawingModeList[drawingMode], 0, (shapeToDraw.getVertecies().length/2));
				
			}
			else
			{
				console.error('the webGL engine hasn\'t been initialized yet!');
				return;
			}
		}
		else
		{
			console.error('the objec to be drawn must be a Shape object!');
			return;
		}
	},

	setClearColor: function(r, g, b, a)
	{
		if (typeof(r) == 'number' && typeof(g) == 'number' && typeof(b) == 'number' && typeof(a) == 'number')
		{
			if
			(
				(r >= 0 && r <= 1) &&
				(g >= 0 && g <= 1) &&
				(b >= 0 && b <= 1) &&
				(a >= 0 && a <= 1)
			)
			{
				clearColor = [r, g, b, a];
			}
			else
			{
				console.error('all the color channels have to be between 0 and 1!');
			}

		}
		else
		{
			console.error('all the color channels must be numbers!');
		}
	},

	init: function(width, height)
	{
		let x;
		let y;

		if (typeof(width) == 'number' && typeof(height) == 'number')
		{
			x = width;
			y = height;
		}
		else
		{
			x = 500;
			y = 500;
			console.log('since no resolution has been provided -> the canvas\'s size is 500x500 (1:1)');
		}
		
		let canvasItem = document.createElement("canvas");
		canvasItem.setAttribute("id", "mainScreen");
		canvasItem.setAttribute("width", x);
		canvasItem.setAttribute("height", y);

		gl = canvasItem.getContext('webgl');

		if (!gl) { gl = canvasItem.getContext('experimental-webgl'); }
		if (!gl) { console.error('webGL couldn\'t start!'); return;  }

		document.body.appendChild(canvasItem);
	},

	createShaderProgram: function(vertexShaderSourceCode, fragmentShaderSourceCode)
	{
		if (gl != null)
		{
			// 1) initialize a new GL program
			let ShaderProgram = gl.createProgram();
			
			// 2) attach both shaders into the shader program
			gl.attachShader(ShaderProgram, vertexShaderSourceCode);
			gl.attachShader(ShaderProgram, fragmentShaderSourceCode);
			
			// 3) linking them all
			gl.linkProgram(ShaderProgram);
			
			// 4) checking wether the shader program has beensuccessfully created or not
			if (!gl.getProgramParameter(ShaderProgram, gl.LINK_STATUS)) { console.error('coudln\'t create the shader program!'); return; }
			
			// 5) validating the shader program
			gl.validateProgram(ShaderProgram);
			
			// 6) checking wether the shader program could have been validated or not
			if (!gl.getProgramParameter(ShaderProgram, gl.VALIDATE_STATUS)) { console.error('couldn\'t validate the shader program!'); return; }
	
			// 7) return the program
			return ShaderProgram
		}
		else
		{
			console.error('the webGL engine hasn\'t been started yet!');
			return null;
		}
	},

	HelloWorld: function()
	{

		// =========|THE DEMO VERTEX SHADER SOURCE CODE |==========
		let demoVertexShaderSourceCode = [
			'precision mediump float;',
			'attribute vec2 vPos;',
			'void main(){gl_Position = vec4(vPos, 0, 1);}'
		].join('\n');
		// ========================================================

		// ========| THE DEMO FRAGMENT SHADER SOURCE CODE |=========
		let demoFragmentShaderCode = [
			'precision mediump float;',
			'void main(){gl_FragColor = vec4(1, 0, 0, 1);}'
		].join('\n');
		// =========================================================
		
		// =========| THE TRIANGLE SHAPE |===============
		let demoTriangleShapeVertices = [
			// 	  X	  Y
				 0.0,	 0.5, // vertex 1
				-0.5, 	-0.5, // vertex 2
				 0.5, 	-0.5  // vertex 2
		];
		// ==============================================

		// =======| THE SCREEN CANVAS CREATION |==============
		let mainScreen = document.createElement("canvas");
		mainScreen.setAttribute("id", "mainScreen");
		mainScreen.width = 500;
		mainScreen.height = 500;
		// ===================================================
		
		// ==========| THE WEBGL CANVAS CONTEXT CREATION |================

		// 1) getting the context
		let gl = mainScreen.getContext('webgl');

		// 1.a) if that dind't worked -> try the experimental version of webGL
		if (!gl) { gl = mainScreen.getContext('experimental-webgl'); }

		// 1.b) if that dind't worked either -> webGL isn't implemented no the web browser!!!
		if (!gl) { console.error('webGL couldn\'t start!'); }
		// ===============================================================

		// | CLEARING THE SCREEN |
		
		// 1) choosing the clearing color (black in this case)
		// R = 0 (0)
		// G = 0 (0)
		// B = 0 (0)
		// A = 1 (255)
		gl.clearColor(0, 0, 0, 1);

		// clearing the screen's buffer
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		// ==============| CREATING BOTH SHADERS |======================
		// 1) the vertex shader
		let vertexShader = gl.createShader(gl.VERTEX_SHADER);
		// 2) the fragment shader
		let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		// =============================================================		


		// ================| COMPILING BOTH SHADERS |=======================
		// 1) getting the source for both shaders
		gl.shaderSource(vertexShader, demoVertexShaderSourceCode);
		gl.shaderSource(fragmentShader, demoFragmentShaderCode);
		// 2) compiling both of them
		gl.compileShader(vertexShader);
		gl.compileShader(fragmentShader);
		// 3) checking wether both shaders were successfully compiled or not
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))	{console.error('couldn\'t compile the vertex shader!'); return;}
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))	{console.error('couldn\'t compile the fragment shader!'); return;}
		// =================================================================

		// | CREATING THE SHADER PROGRAM FOR THE GPU |
		// 1) initialize a new GL program
		let demoShaderProgram = gl.createProgram();
		// 2) attach both shaders into the shader program
		gl.attachShader(demoShaderProgram, vertexShader);
		gl.attachShader(demoShaderProgram, fragmentShader);
		// 3) linking them all
		gl.linkProgram(demoShaderProgram);
		// 4) checking wether the shader program has beensuccessfully created or not
		if (!gl.getProgramParameter(demoShaderProgram, gl.LINK_STATUS)) { console.error('coudln\'t create the shader program!'); return; }
		// 5) validating the shader program
		gl.validateProgram(demoShaderProgram);
		// 6) checking wether the shader program could have been validated or not
		if (!gl.getProgramParameter(demoShaderProgram, gl.VALIDATE_STATUS)) { console.error('couldn\'t validate the shader program!'); return; }

		// ========================| THE TRIANGLE ADDITION INTO THE BUFFER |===============================
		// 1) creating the buffer for the triangle
		let demoTriangleVertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, demoTriangleVertexBuffer);
		// 2) put the triangle shape into the created buffer
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(demoTriangleShapeVertices), gl.STATIC_DRAW);
		// ================================================================================================
		
		// ===================================| DEFINING THE ATTRIBUTES |========================================
		// 1) getting the position attribute location of theshader program
		let positionAttributeLocation = gl.getAttribLocation(demoShaderProgram, 'vPos');
		// 2) create a pointer to it
		gl.vertexAttribPointer
		(
			positionAttributeLocation,		// the attribute's location in the shader program
			2,					// amount of elements per attributes
			gl.FLOAT,				// the element's datatype
			gl.FALSE,
			(2 * Float32Array.BYTES_PER_ELEMENT),	// the individual vertex's size
			0					// the offset which the very first vertex begins

		);
		// 3) activate it
		gl.enableVertexAttribArray(positionAttributeLocation);
		// ======================================================================================================

		// =======| RENDERING THE TRIANGLE |================
		// 1) choosing the shader program to use
		gl.useProgram(demoShaderProgram);
		// 2) drawing the triangle (by using triangles)
		gl.drawArrays(gl.TRIANGLES, 0, 3);
		// =================================================

		// PUTTING THE CANVAS ON THE DOCUMENT
		document.body.appendChild(mainScreen);
	}
}
