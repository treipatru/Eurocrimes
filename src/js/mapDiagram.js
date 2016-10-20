    function drawMap () {
      //MAKE THE SVG ELEMENT
      var center, countries, height, path, projection, scale, svg, width, mapData;
      width = 850;
      height = 600;
      center = [20,60];
      scale = 1100;
      projection = d3.geo.azimuthalEqualArea().scale(scale).translate([width / 2, 150]).center(center);
      path = d3.geo.path().projection(projection);
      svg = d3.select("#mapDiagram")
              .append("svg")
              .attr("height", height)
              .attr("id", "mapContainer")
              .attr("width", width)
              .style("display","block")
              .style("margin","auto");

      // //DEFINE GRATICULE
      // var graticule = d3.geo.graticule(); 
      // svg.append("path")    
      //    .datum(graticule)
      //    .attr("class", "graticule")
      //    .attr("d", path);

      countries = svg.append("g");

      //SET A GLOBAL EASING DURATION
      var easingDuration = 750;

      //IMPORT DATA AND DRAW THE MAP
      d3.json("./data/map.json", function(data) {
        countries.selectAll(".country")
        .data(topojson.feature(data, data.objects.collection).features)
        .enter()
        .append("g")
        .attr("class",function (d) {if (d.properties.EU_MEMBER === "1") {return "gCountryEU";}else {return "gCountry";}})
        .attr("id", function (d) {return "g" + d.properties.NAME;})
          .append("path")
          .attr("class","country")
          .attr("id", function (d) {return d.properties.NAME;})
          .attr("d", path)
          .filter(function (d) {if (d.properties.EU_MEMBER === "1") {return d;}})
          .attr("class", "countryEU")
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .on("click", onClick);

        //MAKE TEXT CONTAINERS FOR COUNTRY NUMBERS
        d3.selectAll(".gCountryEU").append("text")
          .attr("class", "nrCountry selectDisallow")
          .attr("id", function (d) {return "nr" + d.properties.NAME;})
          .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("dy", ".35em")
          .style("font-weight", "bold")
          .style("opacity", 0);

      //IMPORT SECONDARY DIASPORA DATA AND ASSIGN TO COUNTRIES
      d3.json('./data/mapdata.json', function (data) {
        var diasporaNumbers = data;

        for (var key in diasporaNumbers){
          if (diasporaNumbers.hasOwnProperty(key)){

          //MAKE SELECTION AND UPDATE DATA
          d3.select("#" + key).datum(function(d){
            d.diaspora = diasporaNumbers[key]; 
            return d;});
        }
      }
    });
    });


      //MOUSE EVENTS
      function mouseover (){
        var currentSelection = d3.select(this);


        currentSelection.style("opacity","0.8");
        d3.select("#tooltip")
        .style("visibility", "visible")
        .html("<p>"+ currentSelection.attr("id") + "</p>")
        .style("top", function () { return (d3.event.pageY + 10)+"px";})
        .style("left", function () { return (d3.event.pageX - 0)+"px";});
      }

      function mouseout() {
        var currentSelection = d3.select(this);

        if (currentSelection.classed("countryActive")){
          currentSelection.style("opacity","1");
        }else {
          d3.select(this).attr("class", "countryEU");  
          currentSelection.style("opacity","1");
        }

        d3.select("#tooltip").
        style("visibility", "hidden");
      }


    function onClick() {
      var initialClass = d3.select("#"+this.id).attr("class");
      //IF ALREADY ACTIVE, DISABLE ELSE MAKE ACTIVE
      if (initialClass === "countryActive"){
        d3.select(this).attr("class", "countryEU");
        d3.selectAll(".countryEU").transition().duration(easingDuration).ease("cubic").style("fill", "#217A89");
        d3.selectAll(".nrCountry").transition().duration(easingDuration).ease("cubic").style("opacity", 0);
        d3.select("#selectionTitle").transition().duration(easingDuration/2).ease("quad").style("fill", "#FFFFFF").remove();
      }else {
        //SET THIS AS ACTIVE COUNTRY
        d3.selectAll(".countryEU").transition().duration(easingDuration).ease("cubic").style("fill", "#217A89");
        d3.selectAll(".nrCountry").transition().duration(easingDuration).ease("cubic").style("opacity", 0).text("");
        d3.select(".countryActive").attr("class","countryEU");
        d3.select("#selectionTitle").transition().duration(easingDuration/2).ease("quad").style("fill", "#FFFFFF").remove();
        d3.select(this).attr("class", "countryActive").transition().duration(easingDuration).ease("exp").style("fill","#F47F5E");

        //SET SOME VARIABLES
        var activeCountry = this.id;console.log(activeCountry + " is active");
        var restEu = d3.selectAll(".countryEU").data();
        var restEuData = [];
        var activeDiaspora = 0;

        //POPULATE restEuData WITH DATA FROM DISABLED COUNTRIES
        for (var key in restEu){
          if (restEu.hasOwnProperty(key)){
            var obj = {};
            obj.host = restEu[key].properties.NAME;
            obj.people = restEu[key].diaspora[activeCountry];
            restEuData.push(obj);
          }
        }

        //SORT ARRAY DESCENDING
        restEuData.sort(function(a, b) {
          return parseFloat(b.people) - parseFloat(a.people);
        });

        //CALCULATE TOTAL DIASPORA FOR ACTIVE COUNTRY
        for (i = 0; i < restEuData.length; i++){
          activeDiaspora += parseFloat(restEuData[i].people);
        }

        //DISPLAY TITLE FOR SELECTED
        d3.select("#mapContainer")
          .append("text")
            .style("opacity", 0)
            .style("fill","#E7714A")
            .attr("id","selectionTitle")
            .attr("font-family","Open Sans", "HelveticaNeue", "Helvetica Neue")
            .attr("font-size","2.5em")
            .attr("x", 10)
            .attr("y", 50)
            .transition().duration(easingDuration).ease("quad").style("opacity", 1)
            .text(activeCountry);

        //MAKE A COLOR SCALE
        var color = d3.scale.linear()
                            .domain([5, 15, 35,60])
                            .range(['#8DA9D3','#3E649D','#3E649D','#3E649D']);

        //DISPLAY DIASPORA TEXT AND GO FOR HEATMAP
        for (var i = 0; i < restEuData.length; i++) {
          //CALCULATE % OF DIASPORA IN CURRENT ITERATION
          var diasporaPercentage = ((restEuData[i].people / activeDiaspora) * 100).toFixed(2);

          //CHANGE FILL COLOR BASED ON DIASPORA POPULATION
          d3.selectAll("#" + restEuData[i].host)
            .transition()
            .duration(easingDuration)
            .ease("cubic")
            .style("fill", color(diasporaPercentage));
          d3.selectAll("#nr" + restEuData[i].host)
            .transition()
            .duration(easingDuration)
            .ease("cubic")
            .style("opacity", 1)
            .text(d3.format(".2s")(restEuData[i].people));
        }
      }
    }
  }