//-----------------------------------------------------------------------------
//
// IMPRISONED DIASPORA CHORD
//
//-----------------------------------------------------------------------------





function drawChordDiagram () {
  
  //DYNAMIC WIDTH
  var margin = {top: 10, left: 25, right: 25, bottom: 10},
      boxWidth = parseInt(d3.select('#chordDiagram').style('width')),
      boxWidth = boxWidth - margin.left - margin.right,
      boxRatio = 0.75,
      boxHeight = boxWidth * boxRatio;

  render ();


  function render () {
    //CREATE DATA MATRIX AND MAP DATA
    //--------------------------------------
    d3.csv('data/chord-data.csv', function (error, data) {
      var mpr = chordMpr(data);

      mpr.addValuesToMap('isfrom')
         .setFilter(function (row, a, b) {
          return (row.isfrom === a.name && row.goesto === b.name);
        })
         .setAccessor(function (recs, a, b) {
          if (!recs[0]) return 0;
          return +recs[0].count;
        });

      drawChords(mpr.getMatrix(), mpr.getMap());
    });


    //  DRAW THE CHORD DIAGRAM
    //---------------------------------------------------------------------------
    function drawChords (matrix, mmap) {
      var r1 = boxHeight / 2, r0 = r1 - 100;

      var fill = d3.scale
                   .ordinal()
                   .domain(d3.range(28))
                   .range(
                    ["#dc448f", "#449a2b", "#8132ab", "#a469dc", "#3a7524", "#b542a8", "#449357", "#4d47af", "#a97a20", "#5c75e3",
                     "#d05b23", "#6282ca", "#ce3c37", "#318d76", "#d03f5f", "#315f2b", "#9b2e6b", "#798842", "#724e95", "#5c5d1b",
                     "#b2659a", "#8b6a34", "#3e6ca1", "#b86d3e", "#8a394a", "#8d3f1c", "#bc615d"]);

      var chord = d3.layout
                    .chord()
                    .padding(0.04)
                    .sortSubgroups(d3.descending)
                    .sortChords(d3.descending);

      var arc = d3.svg
                  .arc()
                  .innerRadius(r0 + 10)
                  .outerRadius(r0 + 30);

      var svg = d3.select("#chordDiagram").append("svg:svg")
                  .attr("width", boxWidth)
                  .attr("height", boxHeight)
                  .attr("id","chordContainer")
                  .style("display","block")
                  .style("margin","auto")
                .append("svg:g")
                  .attr("id", "circle")
                  .attr("transform", "translate(" + boxWidth / 2 + "," + boxHeight / 2 + ")");

      svg.append("circle").attr("r", r0 + 20);

      var rdr = chordRdr(matrix, mmap);
      chord.matrix(matrix);

      var g = svg.selectAll("g.group")
                 .data(chord.groups())
               .enter().append("svg:g")
                 .attr("class", "group")
                 .on("mouseover", mouseOverGroup)
                 .on("mousemove", mouseMoveGroup)
                 .on("mouseout", mouseOutGroup)
                 .on("click", onClickGroup);

      g.append("svg:path").style("fill", function(d) { return fill(d.index); }).attr("d", arc);

      g.append("svg:text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("class", "selectDisallow")
        .style("font-family", "Open Sans, HelveticaNeue, Helvetica Neue, Helvetica, Arial, sans-serif;")
        .style("font-size", "0.6em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" + "translate(" + (r0 + 36) + ")" + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return rdr(d).gname; });

      var chordPaths = svg.selectAll("path.chord")
                          .data(chord.chords())
                          .enter().append("svg:path")
                          .attr("class", "chord")
                          .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
                          .style("fill", function(d) { return fill(d.target.index); })
                          .attr("d", d3.svg.chord().radius(r0))
                          .on("mouseover", mouseOverChord)
                          .on("mousemove", mouseMoveChord)
                          .on("mouseout", mouseOutChord);

      function chordTip (d) {
        var p = d3.format(".2%");
        return "Prisoner Relationship<br/>" + d.sname + " &rightarrow; " + d.tname + " : " + d.svalue + 
        (d.sname === d.tname ? "": ("<br/>" + d.sname + " &leftarrow; " +d.tname + " : " + d.tvalue));
      }

      function groupTip (d) {
        var p = d3.format(".1%"), q = d3.format(",.3r");
        return d.gname + " has " +q(d.gvalue) + " citizens in EU prisons" + 
        "<br/>" + "This is " + p(d.gvalue/d.mtotal) + " of the total EU expat prison population.";
      }



      // MOUSE EVENTS
      //-----------------------------------------------------------------------


      //GROUPS BEHAVIOR
      //------------------------------------
      function mouseOverGroup(d, i) {
        d3.select("#tooltip")
          .style("opacity", 0)
          .style("visibility", "visible")
          .html(groupTip(rdr(d)))
          .style("top", function () { return (d3.event.pageY + 50)+"px";})
          .style("left", function () { return (d3.event.pageX - 130)+"px";});

        d3.select("#tooltip")
          .transition()
          .duration(400)
          .ease("cubic")
            .style("opacity", 1);

        d3.select(this).select("text").style("font-weight","900");

         chordPaths.classed("fade", function(p) {
           return p.source.index != i && p.target.index != i;
         });
      }

      function mouseMoveGroup (d) {
        d3.select("#tooltip")
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY + 20) + "px");
      }

      function mouseOutGroup (d) {
        d3.select("#tooltip").style("visibility", "hidden");
        d3.selectAll(".fade")
          .transition()
          .duration(500)
          .ease("cubic")
          .style("opacity", 0.8);
        d3.selectAll("fade")
          .style("visibility", "hidden")
          .classed("fade", false);
        d3.select(this).select("text").style("font-weight","500");
      }

      function onClickGroup (d, i) {
        //Keep chord selected
      }


      //CHORDS BEHAVIOR
      //------------------------------------
      function mouseOverChord (d) {
        //FILL SHAPE 100%
        d3.select(this)
        .transition()
        .duration(250)
        .ease("cubic")
        .style("fill-opacity", 1);
        //VISIBLE TOOLTIP
        d3.select("#tooltip")
        .style("visibility", "visible")
        .html(chordTip(rdr(d)))
        .style("top", function () { return (d3.event.pageY + 50)+"px";})
        .style("left", function () { return (d3.event.pageX - 130)+"px";});
      }

      function mouseMoveChord (d) {
        d3.select("#tooltip")
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY + 20) + "px");
      }

      function mouseOutChord (d) {
        d3.select(this)
        .transition()
        .duration(100)
        .ease("cubic")
        .style("fill-opacity", 0.8); //Set opacity back to normal
        
        d3.select("#tooltip").
        style("visibility", "hidden");
      }
    }
  }//end render

}//end drawChordDiagram