//-----------------------------------------------------------------------------
//
// EU JAIL POPULATION
//
//-----------------------------------------------------------------------------


function drawJailPop () {
  var dataSet = [{"Romanian" : 2},
  		     {"EU Expat" : 10},
  		     {"Foreign" : 16},
  		     {"Local" : 72}];

  var peopleSquare = 1; //PEOPLE PER SQUARE
  var squarePadding = 20;
  var squareSize = 0;//USED LATER
  var sqSizeProp = 20;//SQUARES ARE DRAWN PROPORTIONALLY TO SCREEN
  var internalMargins = 0;
  var titleSize = 20;//TITLE HEIGHT

  //DYNAMIC WIDTH
  var margin = {top: 20, left: 0, bottom: 20, right: 35};
  var boxWidth = parseInt(d3.select("#jailPop").style("width")),
      boxWidth = boxWidth - margin.left - margin.right,
    	boxHeight = margin.top + margin.bottom;

  function render () {
  	//MAKE SVG
  	var svg = d3.select("#jailPop")
  		    .append("svg")
  		    	.attr("id","jailPopContainer")
  		    	.attr("width", boxWidth)
  		    	.attr("height", boxHeight)
  		    	.style("display","block")
  		    	.style("margin","auto");
	
	squareSize = svg.attr("width")/100 + sqSizeProp;

	//BACKGROUND
	// svg.append("rect")
	//    .attr("width", "100%")
	//    .attr("height", "100%")
	//    .style("fill", "#ededed");

	//TITLE
	svg.append("text")
	   .attr("id","jailPopTitle")
	   .attr("x", boxWidth/2)
	   .attr("y", margin.top)
	   .attr("class", "chartTitle")
	   .attr("text-anchor","middle")
	   .style("fill","#606062")
	   .text("EU JAIL POPULATION BY ORIGIN");

  	//MAKE GROUPS FOR DATA
  	var squares = svg.selectAll("g").data(dataSet)
		  	     .enter()
		  	   .append("g")
		  	     .attr("id", function (d){return String(Object.keys(d)).replace(/ /g,"");});
	
	//SET NEGATIVE STARTING X
	var currentX = -(squareSize + squarePadding);
	var sqRow = 0;
	var computedH = 0;
	//DRAW SQUARES
	squares.each(function(d, i) {
		var name = String(Object.keys(d));
		var number = d3.format("f")(d[name] / peopleSquare);
		var className = String(name).replace(/ /g,"");

		for (var z = 0; z < number; z++){
			d3.select("#"+ className)
			  .append("rect")
			  .attr("class", "sq" + className + " jailPopSquares")
			  .attr("x", getX())
			  .attr("y", getY() + titleSize)
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
	
	//SET NEW HEIGHT --ADD ROW FOR CHART LEGEND
	sqRow ++;
	computedH = sqRow * (squareSize + squarePadding) + titleSize;
	d3.select("#jailPopContainer").attr("height", (computedH) + margin.top + margin.bottom + titleSize);

	d3.select("#jailPopContainer").append("g").attr("id","jailPopLegend")
	.selectAll("g")
	.data(dataSet)
	.enter()
	.append("g")
	.attr("id", function (d){return String(Object.keys(d));})
	.attr("transform", function (d, i) { return "translate(" + (i * (squareSize + squarePadding)) + "," + (computedH + titleSize) +")";})
	.on("mouseover", mouseoverLabel)
	.on("mouseout", mouseoutLabel)
	.append("rect")
	.attr("x", 0)
	.attr("y", 0)
	.attr("width", squareSize)
	.attr("height", squareSize)
	.attr("class", function (d){return "sq" + String(Object.keys(d)).replace(/ /g,"");});
	
	//APPEND LABELS
	d3.select("#jailPopLegend").selectAll("g").each(function (d,i) {
		d3.select(this)
		  .append("text")
		  .attr("class", function (d){return "selectDisallow sq" + String(Object.keys(d)).replace(/ /g,"");})
		  .attr("x", squareSize + 3)
		  .attr("y", squareSize/2)
		  .attr("dy", ".35em")
		  .attr("text-anchor","left")
		  .style("fill", "#606062")
		  .style("font-size", "0.7em")
		  .text(function (d){return Object.keys(d);});
	});

	//REPOSITION GROUPS TO FIT
	var prevTextW = 0;
	d3.select("#jailPopLegend").selectAll("g").each(function (d,i) {
		var textWidth = d3.select(this).select("text").node().getBBox().width * 1 + 15;
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
      .html("<p>1% of Prisoners</p>")
      // .html("<p>" + String(Object.keys(data)) + " - 1% Of Prisoners" +"</p>")
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
    var currentName = currentSelection.attr("id").replace(/ /g,"");
    var currentValue = d3.select("#" + currentName).selectAll("rect").size();
    currentSelection.select("text")
    			  .text(currentValue + "%")
    			  .style("font-weight","800");   

    d3.select("#" + currentName)
    .transition()
    .duration(500)
    .ease("bounce")
    .style("opacity","0.3");
    
  }

  function mouseoutLabel (){
    var currentSelection = d3.select(this);
    var currentName = currentSelection.attr("id");

    currentSelection.select("text")
    			  .text(currentName)
    			  .style("font-weight","500");

    d3.selectAll("#" + currentName.replace(/ /g,""))
    	.transition()
    	.duration(250)
    	.ease("cubic")
    	.style("opacity","1");
  }

  render();
}