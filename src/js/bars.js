  //EXPATS IN JAIL/COUNTRY OF ORIGIN
  //---------------------------------------------------------------------------
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
      chart.append("g").attr("id","prisonersGrid");
      chart.append("g").attr("id","prisonersBars");

      //IMPORT DATA
      d3.csv("data/bar-percentage.csv", type, function (error, data) {
      	x.domain([0, d3.max(data, function(d) { return d.percentage; })]);
      	var height = ((barHeight + barSpacing) * data.length) + axisHeight;
      	chart.attr("height", height);


      	//MAKE SVG GROUPS FOR EACH BAR
      	var bar = chart.select("#prisonersBars").selectAll("g")
       .data(data)
       .enter()
       .append("g")
       .attr("class", "bars")
       .attr("transform", function(d, i) { return "translate(0," + i * (barHeight + barSpacing) + ")"; });

      	//DRAW BARS
      	bar.append("rect")
        .attr("class","barRect")
        .style("fill", "#ED9F85")
        .attr("width", function(d) { return x(d.percentage); })
        .attr("height", barHeight);

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
		chart.select("#prisonersGrid").append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + (height - axisHeight) + ")")
   .call(xAxis.tickSize(-height, 3).tickPadding(5));

   chart.selectAll(".bars")
   .on("mouseover", mouseOverBar)
   .on("mouseout", mouseOutBar);

 });

      function type(d) {
	d.percentage = +d.percentage; // coerce to number
	return d;}

  function mouseOverBar () {
    d3.select(this).select("rect")
    .transition()
    .duration(300)
    .ease("bounce").style("fill","#ED7149");

  	//TRANSITION
  	d3.select(this)
    .select(".barRectTitle")
    .transition()
    .duration(150)
    .ease("cubic")
    .style("opacity", "0")
    .style("font-weight","700")
    .transition()
    .duration(150)
    .style("opacity", "1")
    .text(function (d) {return d.percentage + " %";});
  }

  function mouseOutBar () {
    d3.select(this).select("rect")
    .transition()
    .duration(300)
    .ease("exp").style("fill","#ED9F85");

  	//REMOVE NUMBER FROM BAR
    d3.select(this)
    .select(".barRectTitle")
    .transition()
    .duration(150)
    .style("opacity", "0")
    .transition()
    .style("font-weight","500")
    .duration(150)
    .style("opacity", "1")
    .text(function (d) {return d.country;});
  }

}




  //AVERAGE INCOME PER COUNTRY OF ORIGIN
  //---------------------------------------------------------------------------
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
      .ticks(7);

      var chart = d3.select("#salaryContainer").attr("width", width);
      chart.append("g").attr("id","salaryGrid");
      chart.append("g").attr("id","salaryBars");
      //IMPORT DATA
      d3.csv("data/bar-income.csv", type, function (error, data) {
        x.domain([0, d3.max(data, function(d) { return d.income; })]);
        var height = ((barHeight + barSpacing) * data.length) + axisHeight;
        chart.attr("height", height);


        //MAKE SVG GROUPS FOR EACH BAR
        var bar = chart.select("#salaryBars").selectAll("g")
       .data(data)
       .enter()
       .append("g")
       .attr("class", "bars")
       .attr("transform", function(d, i) { return "translate(0," + i * (barHeight + barSpacing) + ")"; });

        //DRAW BARS
        bar.append("rect")
        .attr("class","barRect")
        .style("fill", "#9CD4D1")
        .attr("width", function(d) { return x(d.income); })
        .attr("height", barHeight);

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
    chart.select("#salaryGrid").append("g")
   .attr("class", "x axis")
   .attr("transform", "translate(0," + (height - axisHeight) + ")")
   .call(xAxis.tickSize(-height, 3).tickPadding(5));

   chart.selectAll(".bars")
   .on("mouseover", mouseOverBar)
   .on("mouseout", mouseOutBar);

 });

      function type(d) {
  d.income = +d.income; // coerce to number
  return d;}

  function mouseOverBar () {
    d3.select(this).select("rect")
    .transition()
    .duration(300)
    .ease("bounce").style("fill","#5bc1ba");

    //TRANSITION
    d3.select(this)
    .select(".barRectTitle")
    .transition()
    .duration(150)
    .ease("cubic")
    .style("opacity", "0")
    .style("font-weight","700")
    .transition()
    .duration(150)
    .style("opacity", "1")
    .text(function (d) {return d.income + " €";});
  }

  function mouseOutBar () {
    d3.select(this).select("rect")
    .transition()
    .duration(300)
    .ease("exp").style("fill","#9CD4D1");

    //REMOVE NUMBER FROM BAR
    d3.select(this)
    .select(".barRectTitle")
    .transition()
    .duration(150)
    .style("opacity", "0")
    .transition()
    .style("font-weight","500")
    .duration(150)
    .style("opacity", "1")
    .text(function (d) {return d.country;});
  }

}