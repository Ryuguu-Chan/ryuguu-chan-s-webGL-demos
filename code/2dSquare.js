// +-------------------------------------+
// | MADE BY OGAN OEZKUL AKA RYUGUU CHAN |
// +-------------------------------------+

var ready = false;

// when the page has been loaded
window.onload = function()
{
	if
	(
		DetectPhone() == true ||
		GetSize()[0] <= 800
	)
	{
		document.getElementById('rightArrowKeyText').innerHTML = "right arrow";	
		document.getElementById('leftArrowKeyText').innerHTML = "left arrow";
	}

	// kick-starting the graphical engine
	ryuryuGfx.init();

	// choosing the buffer clear color
	ryuryuGfx.setClearColor(1, 1, 1, 1);

	// creating a square object
	let squareShape = new Shape();

	// defining it's coordinates
	// the drawing mode that will be use will be the Line mode
	squareShape.setVertecies([
		-0.5, 0.5,
		-0.5, -0.5,
		0.5, -0.5,
		0.5, 0.5
	]);

	// setting the rectangle color to blue
	squareShape.setSolidColorFromRGBA(0, 0, 1, 1);

	// drawing the shape
	ryuryuGfx.draw(squareShape, ryuryuGfx.drawingModes.closedLineLoop);

	document.getElementById("confirmationButton").onclick = function()
	{
		document.body.removeChild(document.getElementById("instructionMessageBox"));
		ready = true;
	}

	document.getElementById("leftArrowKey").onclick = function()
	{
		if (ready && (DetectPhone() == true || GetSize()[0] <= 800))
		{
			squareShape.rotate(0.1, [0, 0]);
			ryuryuGfx.draw(squareShape, ryuryuGfx.drawingModes.closedLineLoop);
		}
	}

	document.getElementById("rightArrowKey").onclick = function()
	{
		if (ready && (DetectPhone() == true || GetSize()[0] <= 800))
		{
			squareShape.rotate(-0.1, [0, 0]);
			ryuryuGfx.draw(squareShape, ryuryuGfx.drawingModes.closedLineLoop);
		}
	}

	document.onkeydown = function(e)
	{
		if (ready)
		{
			if (e.key == "ArrowRight")
			{
				squareShape.rotate(-0.1, [0, 0]);
				ryuryuGfx.draw(squareShape, ryuryuGfx.drawingModes.closedLineLoop);
			}
			else if (e.key == "ArrowLeft")
			{
				squareShape.rotate(0.1, [0, 0])
				ryuryuGfx.draw(squareShape, ryuryuGfx.drawingModes.closedLineLoop);
			}
		}
	}
}
