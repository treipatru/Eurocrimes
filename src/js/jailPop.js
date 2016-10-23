//-----------------------------------------------------------------------------
//
// EU JAIL POPULATION
//
//-----------------------------------------------------------------------------





function drawJailPop () {
  var dataSet = [{"Romanian" : 11400},
  		     {"EU" : 68000},
  		     {"Foreign" : 113500},
  		     {"Local" : 506500}];

  var peopleSquare = 1500; //PEOPLE PER SQUARE
  var squareSize = 20;
  var squarePadding = 0.5;
  var internalMargins = 20;
  var titleSize = 20;
  var sqLabel = 50;
  var heightAdjust = 30;

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
	
	//BACKGROUND
	// svg.append("rect")
	//    .attr("width", "100%")
	//    .attr("height", "100%")
	//    .style("fill", "#ededed");

	//TITLE
	svg.append("text")
	   .attr("id","jailPopTitle")
	   .attr("x", boxWidth/2)
	   .attr("y", internalMargins+margin.top)
	   .attr("class", "chartTitle")
	   .attr("text-anchor","middle")
	   .style("fill","#606062")
	   .text("EU JAIL POPULATION BY ORIGIN");

  	//MAKE GROUPS FOR DATA
  	var squares = svg.selectAll("g").data(dataSet)
		  	     .enter()
		  	   .append("g")
		  	     .attr("id", function (d){return Object.keys(d);});
	
	//SET NEGATIVE STARTING X
	var currentX = -(squareSize + squarePadding) + internalMargins;
	var sqRow = 0;
	var computedH = 0;
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
			computedH = sqRow * (squareSize + squarePadding) + titleSize;
			return computedH;
		}

	});
	
	//SET HEIGHT
	d3.select("#jailPopContainer").attr("height", (sqRow * heightAdjust) + internalMargins);
	
	d3.select("#jailPopContainer").append("g").attr("id","jailPopLegend")
	.selectAll("g")
	.data(dataSet)
	.enter()
	.append("g")
	.attr("transform", function (d, i) { return "translate(" + (i * (squareSize + squarePadding)) + "," + (computedH + margin.top + internalMargins + titleSize) +")";})
	.on("mouseover", mouseoverLabel)
	.on("mouseout", mouseoutLabel)
	.append("rect")
	.attr("x", internalMargins)
	.attr("y", internalMargins)
	.attr("width", squareSize)
	.attr("height", squareSize)
	.attr("class", function (d){return "sq" + Object.keys(d);});
	
	//APPEND LABELS
	d3.select("#jailPopLegend").selectAll("g").each(function (d,i) {
		d3.select(this)
		  .append("text")
		  .attr("class", function (d){return "selectDisallow sq" + Object.keys(d);})
		  .attr("x", internalMargins + squareSize + 3)
		  .attr("y", 35)
		  .attr("text-anchor","left")
		  .style("fill", "#606062")
		  .style("font-size", "0.7em")
		  .text(function (d){return Object.keys(d);});
	});

	//REPOSITION GROUPS TO FIT
	var prevTextW = 0;
	d3.select("#jailPopLegend").selectAll("g").each(function (d,i) {
		var textWidth = d3.select(this).select("text").node().getBBox().width * 1.3;
		var nextElement = d3.select(this.nextElementSibling);


		if (nextElement[0][0]) {
		  var x = d3.transform(nextElement.attr("transform")).translate[0];
		  var y = d3.transform(nextElement.attr("transform")).translate[1];
		  
		  x = prevTextW + x + textWidth;
		  prevTextW += textWidth;

		  d3.select(this.nextElementSibling).attr("transform","translate(" + x +"," + y + ")");
		}
		
	});

  }//END RENDER



  //MOUSE EVENTS
  function mouseoverSq (){
    var currentSelection = d3.select(this);
    currentSelection.transition()
    			  .duration(200)
    			  .ease("bounce")
    			  .style("opacity","0.7");

    var data = d3.select(this.parentNode).datum();

    d3.select("#tooltip")
      .style("visibility", "visible")
      .html("<p>"+ peopleSquare + " " + String(Object.keys(data)) + " Prisoners" +"</p>")
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

    currentSelection.transition()
    			  .duration(100)
    			  .ease("cubic")
    			  .style("opacity","1");

    d3.select("#tooltip").style("visibility", "hidden");
  }

  function mouseoverLabel (){
    var currentSelection = d3.select(this);
    currentSelection.style("font-weight","800");
    d3.select("#" + currentSelection.text())
    	.transition()
    	.duration(500)
    	.ease("bounce")
    	.style("opacity","0.7");
  }

  function mouseoutLabel (){
    var currentSelection = d3.select(this);
    currentSelection.style("font-weight","500");
    d3.select("#" + currentSelection.text())
    	.transition()
    	.duration(250)
    	.ease("cubic")
    	.style("opacity","1");
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