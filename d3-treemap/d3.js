// define the json file urls
const JSON_PLEDGES =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json";
const JSON_MOVIE_SALES =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json";
const JSON_GAME_SALES =
  "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json";

  // define the color scheme
const COLOR_SCHEME = [
  "#1f77b4",
  "#aec7e8",
  "#ff7f0e",
  "#ffbb78",
  "#2ca02c",
  "#98df8a",
  "#d62728",
  "#ff9896",
  "#9467bd",
  "#c5b0d5",
  "#8c564b",
  "#c49c94",
  "#e377c2",
  "#f7b6d2",
  "#7f7f7f",
  "#c7c7c7",
  "#bcbd22",
  "#dbdb8d",
  "#17becf",
  "#9edae5"
];

//load the data
queue()
  .defer(d3.json, JSON_PLEDGES)
  .defer(d3.json, JSON_MOVIE_SALES)
  .defer(d3.json, JSON_GAME_SALES)
  .await(ready);

// create the svg
const width = 800,
  height = 1000,
  legendMargin = 420;

var svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height);

const treemap = d3
  .treemap()
  .size([width, height-legendMargin])
  .paddingOuter(0);
//.round(true); // setting this to true will cause the test to fail based on not using exact sizing in test values. This would require using a fixed size instead of a changeable one.

//render after data has loaded
// function ready(error, pledgesData, movieData, gameData) {
//   // check the data
//   console.log("pledgesData: ", pledgesData);
//   console.log("movieData: ", movieData);
//   console.log("gameData: ", gameData);
// }

// create switch for different datasets
var currentJSON = JSON_GAME_SALES;
var urlParams = new URLSearchParams(window.location.search);
const DATASET = urlParams.get('dataset');

if (DATASET == "movies") {
  currentJSON = JSON_MOVIE_SALES;
} else if (DATASET == "pledges") {
  currentJSON = JSON_PLEDGES;
} else {
  currentJSON = JSON_GAME_SALES;
}

// render the chosen the dataset
d3.json(currentJSON, function(data) {
  var root = d3.hierarchy(data);

  root;
  treemap(root);

  // define the categories
  var CATEGORY = root.leaves().map(nodes => nodes.data.category);
  CATEGORY = CATEGORY.filter(
    (category, index, self) => self.indexOf(category) === index
  );

  // set the color scale
  var colorScale = d3
    .scaleOrdinal()
    .domain(CATEGORY)
    .range(COLOR_SCHEME);

  // test the color scale  
  // CATEGORY.forEach(e => {
  //   console.log(colorScale(e));
  // });

  // define the hovering tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip");

  // define the data used in the boxes
  var nodes = treemap(
    root
      .sum(d => d.value)
      .sort(function(a, b) {
        return b.height - a.height || b.value - a.value;
      })
  ).leaves();

  d3.select("svg g")
    .selectAll("rect")
    .data(root)
    .enter()
    .append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0);

  var nodes = d3
    .select("svg g")
    .selectAll("g")
    .data(nodes)
    .enter()
    .append("g")
    .attr("transform", d => "translate(" + [d.x0, d.y0] + ")");

  nodes
    .append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => {
      return d.data.category;
    })
    .attr("data-value", d => d.data.value)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => colorScale(d.data.category));

  nodes
    .on("mouseover", function(d) {
      tooltip
        .attr("data-value", d.data.value)
      tooltip.transition().style("opacity", 1);
      tooltip
        .html(
          "Name: " + d.data.name +
          "<br>Category: " + d.data.category +
          "<br>Value: " + d.data.value
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .style("opacity", 0);
      d3.select(this).style("opacity", 1);
    }); 

  nodes
    .append("text")
    .attr("class", "tile-text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 13 + i * 10)
    .text(d => d);

  // define the legend
  var legend = svg
    .selectAll("#legend")
    .data(CATEGORY)
    .enter()
    .append("g")
    .attr("id", "legend")
    .attr("transform", function(d, i) {
      return "translate("+ (0-(width/2))+", " + (height-40 - i * 20) + ")";
    });

  legend
    .append("rect")
    .attr("class", "legend-item")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", d => colorScale(d));

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(d => d);

});


