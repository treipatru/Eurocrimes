    function drawBarIncome () {
      //MAKE THE SVG ELEMENT
      var width, height, svg, barHeight, barSpacing, axisHeight;
      width = 400;
      barHeight = 15;
      barSpacing = 10;
      axisHeight = 20;
      svg = d3.select("#barIncome").append("svg")
              .attr("id","salaryContainer")
              .style("display","block")
              .style("margin","auto");
      
      var x = d3.scale.linear()
      	    .range([0, width]);

     	var xAxis = d3.svg.axis()
     			  .scale(x)
     			  .orient("bottom");

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
      	   .style("fill", function (d,i){if (i%2 === 0){return "#bcbcbc";}else {return "#6f7075";}})
      	   .attr("width", function(d) { return x(d.income); })
      	   .attr("height", barHeight - 5);

      	//DRAW COUNTRY LABEL
  		bar.append("text")
		   .attr("x", 0)
		   .attr("y", barHeight)
		   .attr("dy", ".35em")
		   .style("fill", function (d,i){if (i%2 === 0){return "#bcbcbc";}else {return "#6f7075";}})
		   .style("font-size", "0.5em")
		   .text(function(d) { return d.country; });

		//DRAW COUNTRY NUMBERS
		bar.selectAll("rect")
  		   .append("text")
		   .attr("x", 0)
		   .attr("y", 0)
		   .attr("dy", ".35em")
		   .style("font-size", "0.5em")
		   .style("fill", "#ff00ff")
		   .text(function (d) {return d.income;});

		//DRAW AXIS
		chart.append("g")
		     .attr("class", "x axis")
		     .attr("transform", "translate(0," + (height - axisHeight) + ")")
		     .call(xAxis);

      });

  function type(d) {
	d.income = +d.income; // coerce to number
	return d;}

}








    function drawBarPrisoners () {
      //MAKE THE SVG ELEMENT
      var width, height, svg, barHeight, barSpacing;
      width = 400;
      barHeight = 15;
      barSpacing = 10;
      svg = d3.select("#barPrisoners").append("svg")
              .attr("id","prisonersContainer")
              .style("display","block")
              .style("margin","auto");
      
      var x = d3.scale.linear()
      	    .range([0, width]);

     	var xAxis = d3.svg.axis()
     			  .scale(x)
     			  .orient("bottom");

	var chart = d3.select("#prisonersContainer").attr("width", width);

      //IMPORT DATA
      d3.csv("data/bar-percentage.csv", type, function (error, data) {

      	x.domain([0, d3.max(data, function(d) { return d.percentage; })]);

      	chart.attr("height", (barHeight + barSpacing) * data.length);



      	var bar = chart.selectAll("g")
      		         .data(data)
      		         .enter()
      		         .append("g")
      		         .attr("transform", function(d, i) { return "translate(0," + i * (barHeight + barSpacing) + ")"; });

      	bar.append("rect")
      	   .style("fill", function (d,i){if (i%2 === 0){return "#bcbcbc";}else {return "6f7075";}})
      	   .attr("width", function(d) { return x(d.percentage); })
      	   .attr("height", barHeight - 5);

  		bar.append("text")
		   .attr("x", 0)
		   .attr("y", barHeight)
		   .attr("dy", ".35em")
		   .style("fill", function (d,i){if (i%2 === 0){return "#bcbcbc";}else {return "#6f7075";}})
		   .style("font-size", "0.5em")
		   .text(function(d) { return d.country; });

  });
  function type(d) {
	d.percentage = +d.percentage; // coerce to number
	return d;}
}
