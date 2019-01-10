// load the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  function(error, data) {
    var dataset = data.data;
    render(dataset);
  }
);

function render(dataset) {
  // set the dimensions of the canvas
  var margin = { top: 20, right: 20, bottom: 70, left: 40 },
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  // set the domain and range
  var minTime = new Date(d3.min(dataset, d => d[0]));
  var maxTime = new Date(d3.max(dataset, d => d[0]));

  var x = d3
    .scaleTime()
    .domain([minTime, maxTime])
    .range([0, width]);
  //console.log("minTime, maxTime: ", minTime, maxTime);

  var y = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, d => d[1])])
    .range([height, 0]);
  //console.log("d3.max(data, d => d[1])]: ", d3.max(dataset, d => d[1]));

  // define the axis
  var xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks(10);

  var yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(10);

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

  // Add bar chart
  svg
    .selectAll("bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => i * (width / dataset.length))
    .attr("y", d => y(d[1]))
    .attr("width", width / dataset.length)
    .attr("height", d => height - y(d[1]))
    .attr("data-date", d => d[0])
    .attr("data-gdp", d => d[1])
    .on("mouseover", function(d) {
      tooltip.attr("data-date", d[0]);
      tooltip.transition().style("opacity", 1);
      tooltip
        .html("Date: " + d[0] + "<br />" + "Billions: " + d[1])
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function(d) {
      tooltip.attr("data-date", d[0]);
      tooltip.transition().style("opacity", 0);
      d3.select(this).style("opacity", 1);
    });

  // add axis
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .call(yAxis);
}
