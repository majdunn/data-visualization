d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  function(error, data) {
    if (error) throw error;

    // format the data to pass the tests
    data.forEach(function(d) {
      d.Place = +d.Place;
      var parsedTime = d.Time.split(":");
      d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
      console.log(d.Time);
    });
    
    var dataset = data;
    render(dataset);
    console.log(dataset);
  }
);

function render(dataset) {
  // set the dimensions of the canvas
  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
    width = window.innerWidth * 0.8 - margin.left - margin.right,
    height = window.innerHeight * 0.9 - margin.top - margin.bottom;

  // set the domain and range
  var minDate = d3.min(dataset, d => d.Year);
  var maxDate = d3.max(dataset, d => d.Year);
  var extentTime = d3.extent(dataset, d => d.Time);

  var xScale = d3
    .scaleLinear()
    .domain([minDate, maxDate])
    .range([0, width]);

  var yScale = d3
    .scaleTime()
    .domain(extentTime)
    .range([height, 0]);

  var color = d3.scaleOrdinal(["red", "blue"]);

  // define the axis
  var timeFormat = d3.timeFormat("%M:%S");

  var xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickFormat(d3.format("d"))
    .ticks(20);

  var yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(timeFormat);

  // define the tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "#F4F4F4")
    .style("padding", "5 15px")
    .style("border", "1px #333 solid")
    .style("border-radius", "5px")
    .style("opacity", "0");

  // add the SVG element
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "graph-svg-component")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the scatterplot
  svg
    .selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 8)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time)
    .style("fill", d => color(d.Doping != ""))
    .on("mouseover", function(d) {
      tooltip.attr("data-year", d.Year);
      tooltip.transition().style("opacity", 1);
      tooltip
        .html(d.Name + " (" + d.Nationality + ")<br />" + d.Doping)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function(d) {
      tooltip.attr("data-year", d.Year);
      tooltip.transition().style("opacity", 0);
      d3.select(this).style("opacity", 1);
    });

  // add the legend
  var legend = svg
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (height / 2 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", color);

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d) {
      if (d) return "Accused of doping";
      else {
        return "Not accused of doping";
      }
    });

  // add axes
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis);

  // add the axis labels
  svg
    .append("text")
    .attr("class", "x-axis-label")
    .attr("x", 0)
    .attr("y", 20)
    .style("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .text("MINUTES");

  svg
    .append("text")
    .attr("class", "y-axis-label")
    .attr("x", width)
    .attr("y", height - 10)
    .style("text-anchor", "end")
    .text("YEAR");
}
