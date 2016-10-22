//-----------------------------------------------------------------------------
//
// EU JAIL POPULATION
//
//-----------------------------------------------------------------------------





function drawJailPop () {
  var dataSet = [{"Morrocans" : 11700},
  		     {"Romanians" : 11400},
  		     {"Expats" : 68000},
  		     {"Locals" : 552000}];

  var peopleSquare = 500; //PEOPLE PER SQUARE
  var squareSize = 10;
  var squarePadding = 1;
  var internalMargins = 20;
  var heightAdjust = 13;

  //DYNAMIC WIDTH
  var margin = {top: 10, left: 20, bottom: 20, right: 10},
    boxWidth = parseInt(d3.select('#jailPop').style('width')),
    boxWidth = boxWidth - margin.left - margin.right - internalMargins,
    boxRatio = 0.7,
    boxHeight = 0;

  d3.select(window).on("resize", resizeJailPop);

  render();

  function render () {
  	//MAKE SVG
  	var svg = d3.select("#jailPop")
  		    .append("svg")
  		    	.attr("id","jailPopContainer")
  		    	.attr("width", boxWidth)
  		    	.attr("height", boxHeight)
  		    	.style("display","block")
  		    	.style("margin","auto");
	
	svg.append("rect")
	   .attr("width", "100%")
	   .attr("height", "100%")
	   .style("fill", "#ededed");

  	//MAKE GROUPS FOR DATA
  	var squares = svg.selectAll("g").data(dataSet)
		  	     .enter()
		  	   .append("g")
		  	     .attr("id", function (d){return Object.keys(d);});
	
	//SET NEGATIVE STARTING X
	var currentX = -(squareSize + squarePadding) + internalMargins;
	var sqRow = 0;
	//DRAW SQUARES
	squares.each(function(d, i) {
		var name = String(Object.keys(d));
		var number = d3.format("f")(d[name] / peopleSquare);

		for (var z = 0; z < number; z++){
			d3.select("#"+ name)
			  .append("rect")
			  .attr("class", "sq" + name + " jailPopSquares")
			  .attr("x", getX())
			  .attr("y", getY() + internalMargins)
			  .attr("width", squareSize)
			  .attr("height", squareSize)
			  .on("mouseover", mouseoverSq)
			  .on("mousemove", mousemoveSq)
			  .on("mouseout", mouseoutSq);
		}

		function getX () {
			currentX += (squareSize + squarePadding);
			if ( currentX + squareSize > boxWidth - internalMargins) {
				currentX = 0 + internalMargins;
				sqRow ++;
				return currentX;
			}else {
				return currentX;
			}

		}

		function getY() {
			return sqRow * (squareSize + squarePadding);
		}
	d3.select("#jailPopContainer").attr("height", (sqRow * heightAdjust) + internalMargins);

	});

  }//END RENDER


      //MOUSE EVENTS
  function mouseoverSq (){
    var currentSelection = d3.select(this);
    currentSelection.style("opacity","0.5");

    var data = d3.select(this.parentNode).datum();

    d3.select("#tooltip")
      .style("visibility", "visible")
      .html("<p>"+ peopleSquare + " " + String(Object.keys(data)) + "</p>")
      .style("top", function () { return (d3.event.pageY + 10)+"px";})
      .style("left", function () { return (d3.event.pageX - 0)+"px";});
  }

  function mousemoveSq (d) {
    d3.select("#tooltip")
      .style("left", (d3.event.pageX + 20) + "px")
      .style("top", (d3.event.pageY + 20) + "px");
  }
  
  function mouseoutSq() {
    var currentSelection = d3.select(this);

    currentSelection.style("opacity","1");

    d3.select("#tooltip").style("visibility", "hidden");
  }


  //REDRAW ON RESIZE
  function resizeJailPop () {
    // adjust things when the window size changes
    boxWidth = parseInt(d3.select("#jailPop").style('width'));
    boxHeight = boxWidth * boxRatio;
    
    //remove current
    d3.select("#jailPopContainer").remove();

    //update svg
    render();
  }
}