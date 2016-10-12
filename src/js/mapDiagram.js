    function drawMap () {

      var center, countries, height, path, projection, scale, svg, width, mapData;
      width = 960;
      height = 600;
      center = [18,63];
      scale = 750;
      projection = d3.geo.mercator().scale(scale).translate([width / 2, 0]).center(center);
      path = d3.geo.path().projection(projection);
      svg = d3.select("#mapDiagram").append("svg").attr("height", height).attr("width", width).style("display","block")
        .style("margin","auto");
      countries = svg.append("g");


      //IMPORT DATA AND DRAW THE MAP
      d3.json("./data/map.json", function(data) {
        countries.selectAll(".country")
        .data(topojson.feature(data, data.objects.collection).features)
        .enter()
        .append("path")
        .attr("class","country")
        .attr("d", path)
        .attr("id", function (d) {return d.properties.NAME;})
        .filter(function (d) {if (d.properties.EU_MEMBER === "1") {return d;}})
        .attr("class", "countryEU")
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("click", onClick);
      });

      //IMPORT DIASPORA DATA AND ASSIGN TO COUNTRIES
      d3.json('./data/mapdata.json', function (data) {
        var diasporaNumbers = data;

        for (var key in diasporaNumbers){
          if (diasporaNumbers.hasOwnProperty(key)){
            //MAKE SELECTION AND UPDATE DATA (UPDATE WHEN INTEGRATING)
            d3.select("#" + key).datum(function(d){
              d.diaspora = diasporaNumbers[key]; 
              return d;});
          }
        }
      });



      //MOUSE EVENTS
      function mouseover (){
        var currentSelection = d3.select(this);

        if (currentSelection.classed("countryActive")){
        }else {
        }
        currentSelection.style("opacity","0.8");
        d3.select("#tooltip")
        .text(currentSelection.attr("id"));
      }

      function mouseout() {
        var currentSelection = d3.select(this);

        if (currentSelection.classed("countryActive")){
          currentSelection.style("opacity","1");
        }else {
          d3.select(this).attr("class", "countryEU");  
          currentSelection.style("opacity","1");
        }
        d3.select("#tooltip").text("");
        d3.select("#population").text("");
      }



    // var colors = ["#002aff","#ff0000"];

    // var heatmapColor = d3.scale.linear()
    //                      .domain(d3.range(0, 1, 1.0 / (colors/length - 1)))
    //                      .range(colors);
    // var c = d3.scale.linear().domain(d3.extent(dataset)).range([0, 1]);



    function onClick() {
      var initialClass = d3.select("#"+this.id).attr("class");
      //IF ALREADY ACTIVE DISABLE ELSE MAKE ACTIVE
      if (initialClass === "countryActive"){
        d3.select(this).attr("class", "countryEU");
      }else {
        //SET THIS AS ACTIVE COUNTRY
        d3.select(".countryActive").attr("class","countryEU");
        d3.select(this).attr("class", "countryActive");

        var activeDiaspora;
        var activeCountry = this.id;console.log(activeCountry + " is active");
        var restEU = d3.selectAll(".countryEU");

        //MAKE A DATASET WITH 

        for (var key in restEU){
          if (restEU.hasOwnProperty(key)){
          }
        }

      }
    }
  }