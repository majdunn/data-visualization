// get the data
d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  function(error, data) {
    if (error) throw error;

    data.monthlyVariance.forEach(function(d) {
      d.month -= 1;
    });
    var baseTemp = data.baseTemperature;
    var dataset = data.monthlyVariance;
    render(dataset);
    console.log("baseTemp:", baseTemp);
  }
);

function render(dataset) {
  // set the dimensions of the canvas
  var margin = { top: 20, right: 20, bottom: 200, left: 90 },
    width = window.innerWidth * 0.9 - margin.left - margin.right,
    height = window.innerHeight * 0.9 - margin.top - margin.bottom;

  // set the domain and range
  var month = [
    "December",
    "November",
    "October",
    "September",
    "August",
    "July",
    "June",
    "May",
    "April",
    "March",
    "February",
    "January"
  ];

  //   var extentYear = d3.extent(dataset, d => d.year);
  //   var extentMonth = d3.extent(dataset, d => d.month - 1);
  var minVariance = d3.min(dataset, d => d.variance);
  var maxVariance = d3.max(dataset, d => d.variance);
  //var extentTime = d3.extent(dataset, d => d.Time);
  var scaleMonth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  var xScale = d3
    .scaleBand()
    .rangeRound([0, width])
    .padding(0)
    .domain(dataset.map(d => d.year));

  var yScale = d3
    .scaleBand()
    .rangeRound([0, height])
    .domain(scaleMonth);

  console.log("scaleMonth:", scaleMonth);

  var colorScale = d3
    .scaleQuantile(minVariance, maxVariance)
    .domain(dataset.map(d => d.variance))
    .range([
      "#2c7bb6",
      "#00a6ca",
      "#00ccbc",
      "#90eb9d",
      "#ffff8c",
      "#f9d057",
      "#f29e2e",
      "#e76818",
      "#d7191c"
    ]);

  // define the axis
  var month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  var xAxis = d3
    .axisBottom()
    .scale(xScale)
    .tickValues(xScale.domain().filter(year => year % 10 === 0));
  //.tickSize(10, 1);
  // .tickFormat(d3.format("d"))
  // .ticks(.5);

  var yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat((d, i) => month[i]);

  var legendAxis = d3
    .axisBottom()
    .ticks(8)
    .scale(colorScale)
    .tickValues(colorScale.domain())
    .tickFormat(d3.format(".1f"));

  // define the toolip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "darkslategray")
    .style("color", "white")
    .style("padding", "20px")
    .style("border", "1px #333 solid")
    .style("border-radius", "5px")
    .style("opacity", "0");

  // add the SVG element
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "graph")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add the heatmap
  svg
    .selectAll(".cell")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.month))
    .attr("width", d => xScale.bandwidth(d.year))
    .attr("height", d => yScale.bandwidth(d.month))
    .attr("data-year", d => d.year)
    .attr("data-month", d => d.month)
    .attr("data-temp", d => 8.66 + d.variance)
    .style("fill", d => colorScale(d.variance))
    .on("mouseover", function(d) {
      tooltip.attr("data-year", d.year);
      tooltip.transition().style("opacity", 1);
      tooltip
        .html(
          "Date: " +
            month[d.month] +
            " " +
            d.year +
            "<br />Temperature: " +
            (8.66 + d.variance).toFixed(2) +
            "<br />Variance: " +
            d.variance
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function(d) {
      tooltip.attr("data-year", d.year);
      tooltip.transition().style("opacity", 0);
      d3.select(this).style("opacity", 1);
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

  // add the legend
  var legend = svg
    .append("g")
    .attr("id", "legend")
    .attr("width", width - margin.left - margin.right)
    .attr("height", 200)
    .attr(
      "transform",
      "translate(" + margin.left + "," + (height + margin.top + 20) + ")"
    )
    .selectAll(".legend")
    .data(
      colorScale.range().map(function(color) {
        var d = colorScale.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
      })
    )
    .enter();

  legend
    .append("rect")
    .attr("x", (d, i) => i * 50)
    .attr("width", 50)
    .attr("height", 50)
    .style("fill", d => colorScale(d[0]));

    legend
    .append("text")
    .attr("x", (d, i) => i * 50)
    .text(d => d[0].format(".1f"));
}
