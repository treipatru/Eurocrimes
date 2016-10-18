    function drawBarIncome () {
      //MAKE THE SVG ELEMENT
      var width, height, svg, barHeight, barSpacing, axisHeight;
      width = 400;
      barHeight = 20;
      barSpacing = 8;
      axisHeight = 20;
      svg = d3.select("#barIncome").append("svg")
              .attr("id","salaryContainer")
              .style("display","block")
              .style("margin","auto");
      
      var x = d3.scale.linear()
      	    .range([0, width]);

     	var xAxis = d3.svg.axis()
     			  .scale(x)
     			  .orient("bottom")
            .ticks(4, ".f");

	var chart = d3.select("#salaryContainer").attr("width", width);

      //IMPORT DATA
      d3.csv("data/bar-income.csv", type, function (error, data) {
      	x.domain([0, d3.max(data, function(d) { return d.income; })]);
      	var height = ((barHeight + barSpacing) * data.length) + axisHeight;
      	chart.attr("height", height);


      	//MAKE SVG GROUPS FOR EACH BAR
      	var bar = chart.selectAll("g")
      		         .data(data)
      		         .enter()
      		         .append("g")
      		         .attr("transform", function(d, i) { return "translate(0," + i * (barHeight + barSpacing) + ")"; });

      	//DRAW BARS
      	bar.append("rect")
      	   .attr("class","barRect")
      	   .style("fill", "#9CD4D1")
      	   .attr("width", function(d) { return x(d.income); })
      	   .attr("height", barHeight);

      	//DRAW COUNTRY NUMBERS
    		bar.append("text")
    		   .attr("class","invisiText selectDisallow")
    		   .attr("x", d3.select("#salaryContainer").attr("width") - 33)
    		   .attr("y", barHeight/2)
    		   .attr("text-anchor","right")
    		   .attr("dy", ".35em")
    		   .style("font-size", "0.7em")
    		   .style("fill", "#FFFFFF")
    		   .text(function (d) {return d.income;});

      	//DRAW COUNTRY LABEL
    		bar.append("text")
    		   .attr("class","barRectTitle selectDisallow")
  		   .attr("x", 5)
  		   .attr("y", barHeight/2)
  		   .attr("dy", ".35em")
  		   .style("fill", "#000000")
  		   .style("font-size", "0.7em")
  		   .text(function(d) { return d.country; });

    		//DRAW AXIS
    		chart.append("g")
    		     .attr("class", "x axis")
    		     .attr("transform", "translate(0," + (height - axisHeight) + ")")
    		     .call(xAxis);

      	chart.selectAll(".barRect")
      	     .on("mouseover", mouseOverBar)
      	     .on("mouseout", mouseOutBar);

      });

  function type(d) {
	d.income = +d.income; // coerce to number
	return d;}
  
  //MAKE A VARIABLE TO STORE CURRENT BAR WIDTH
  var curWidth;
  function mouseOverBar () {
  	//STORE VAR
  	iniWidth = d3.select(this).attr("width");
  	curWidth = d3.select(this).attr("width");

  	//DISPLAY NUMBER ON BAR
  	d3.select(this.parentNode).select("text").attr("class","visiText selectDisallow");

  	//TRANSITION
  	d3.select(this)
      .transition()
      .duration(20)
      .ease("cubic")
      .style("fill", "#89BDBA")
  	     .transition()
  	     .delay(200)
  	     .duration(400)
         .ease("exp")
         .attr("width", d3.select("#salaryContainer").attr("width"));
  }

  function mouseOutBar () {
  	//REMOVE NUMBER FROM BAR
  	d3.select(this.parentNode).select("text").attr("class","invisiText selectDisallow");

  	//TRANSITION
    	d3.select(this)
        .transition()
        .duration(200)
        .ease("exp")
        .style("fill", "#9CD4D1")
    	     .transition()
  	       .duration(500)
           .ease("exp")
           .attr("width", curWidth);
  	//RESET VAR
	curWidth = 0;
  }

}




    function drawBarPrisoners () {
      //MAKE THE SVG ELEMENT
      var width, height, svg, barHeight, barSpacing, axisHeight;
      width = 400;
      barHeight = 20;
      barSpacing = 8;
      axisHeight = 20;
      svg = d3.select("#barPrisoners").append("svg")
              .attr("id","prisonersContainer")
              .style("display","block")
              .style("margin","auto");
      
      var x = d3.scale.linear()
      	    .range([0, width]);

     	var xAxis = d3.svg.axis()
     			  .scale(x)
     			  .orient("bottom")
            .ticks(7);

	var chart = d3.select("#prisonersContainer").attr("width", width);

      //IMPORT DATA
      d3.csv("data/bar-percentage.csv", type, function (error, data) {
      	x.domain([0, d3.max(data, function(d) { return d.percentage; })]);
      	var height = ((barHeight + barSpacing) * data.length) + axisHeight;
      	chart.attr("height", height);


      	//MAKE SVG GROUPS FOR EACH BAR
      	var bar = chart.selectAll("g")
      		         .data(data)
      		         .enter()
      		         .append("g")
      		         .attr("transform", function(d, i) { return "translate(0," + i * (barHeight + barSpacing) + ")"; });

      	//DRAW BARS
      	bar.append("rect")
      	   .attr("class","barRect")
      	   .style("fill", "#ED9F85")
      	   .attr("width", function(d) { return x(d.percentage); })
      	   .attr("height", barHeight);

      	//DRAW COUNTRY NUMBERS
		bar.append("text")
		   .attr("class","invisiText selectDisallow")
		   .attr("x", d3.select("#prisonersContainer").attr("width") - 33)
		   .attr("y", barHeight/2)
		   .attr("text-anchor","right")
		   .attr("dy", ".35em")
		   .style("font-size", "0.7em")
		   .style("fill", "#FFFFFF")
		   .text(function (d) {return d.percentage;});

      	//DRAW COUNTRY LABEL
  		bar.append("text")
  		   .attr("class","barRectTitle selectDisallow")
		   .attr("x", 5)
		   .attr("y", barHeight/2)
		   .attr("dy", ".35em")
		   .style("fill", "#000000")
		   .style("font-size", "0.7em")
		   .text(function(d) { return d.country; });

		//DRAW AXIS
		chart.append("g")
		     .attr("class", "x axis")
		     .attr("transform", "translate(0," + (height - axisHeight) + ")")
		     .call(xAxis);

		chart.selectAll(".barRect")
		     .on("mouseover", mouseOverBar)
		     .on("mouseout", mouseOutBar);

      });

  function type(d) {
	d.percentage = +d.percentage; // coerce to number
	return d;}

//MAKE A VARIABLE TO STORE CURRENT BAR WIDTH
  var curWidth;
  function mouseOverBar () {
  	//STORE VAR
  	iniWidth = d3.select(this).attr("width");
  	curWidth = d3.select(this).attr("width");

  	//DISPLAY NUMBER ON BAR
  	d3.select(this.parentNode).select("text").attr("class","visiText selectDisallow");

  	//TRANSITION
  	d3.select(this)
      .transition()
      .duration(20)
      .ease("cubic")
      .style("fill", "#ED7149")
  	     .transition()
  	     .delay(100)
  	     .duration(400)
         .ease("exp")
         .attr("width", d3.select("#salaryContainer").attr("width"));
  }

  function mouseOutBar () {
  	//REMOVE NUMBER FROM BAR
  	d3.select(this.parentNode).select("text").attr("class","invisiText selectDisallow");

  	//TRANSITION
    	d3.select(this)
        .transition()
        .duration(200)
        .ease("exp")
        .style("fill", "#ED9F85")
    	     .transition()
  	       .duration(500)
           .ease("exp")
           .attr("width", curWidth);
  	//RESET VAR
	curWidth = 0;
  }

}
