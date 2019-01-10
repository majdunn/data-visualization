// define the json file urls
const JSON_COUNTY =
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
const JSON_EDU =
  "https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";

// yellow color scheme
const COLOR_SCHEME = [
  "#ffffb2",
  "#fee391",
  "#fec44f",
  "#fe9929",
  "#ec7014",
  "#cc4c02",
  "#8c2d04"
];


// purple color scheme
// const COLOR_SCHEME = ["#EED4CF","#D2A7ED","#AC7EF8","#805AF0","#503AD8","#1C1FB0"];
// testing different color schemes for fun
// const COLOR_SCHEME = ["#EED4CF","#1C1FB0"];
// const COLOR_SCHEME = ["#ff4040","#ff423d","#ff453a","#ff4838","#fe4b35","#fe4e33","#fe5130","#fd542e","#fd572b","#fc5a29","#fb5d27","#fa6025","#f96322","#f96620","#f7691e","#f66c1c","#f56f1a","#f47218","#f37517","#f17815","#f07c13","#ee7f11","#ed8210","#eb850e","#e9880d","#e88b0c","#e68e0a","#e49209","#e29508","#e09807","#de9b06","#dc9e05","#d9a104","#d7a403","#d5a703","#d2aa02","#d0ad02","#ceb001","#cbb301","#c9b600","#c6b800","#c3bb00","#c1be00","#bec100","#bbc300","#b8c600","#b6c900","#b3cb01","#b0ce01","#add002","#aad202","#a7d503","#a4d703","#a1d904","#9edc05","#9bde06","#98e007","#95e208","#92e409","#8ee60a","#8be80c","#88e90d","#85eb0e","#82ed10","#7fee11","#7cf013","#78f115","#75f317","#72f418","#6ff51a","#6cf61c","#69f71e","#66f920","#63f922","#60fa25","#5dfb27","#5afc29","#57fd2b","#54fd2e","#51fe30","#4efe33","#4bfe35","#48ff38","#45ff3a","#42ff3d","#40ff40","#3dff42","#3aff45","#38ff48","#35fe4b","#33fe4e","#30fe51","#2efd54","#2bfd57","#29fc5a","#27fb5d","#25fa60","#22f963","#20f966","#1ef769","#1cf66c","#1af56f","#18f472","#17f375","#15f178","#13f07c","#11ee7f","#10ed82","#0eeb85","#0de988","#0ce88b","#0ae68e","#09e492","#08e295","#07e098","#06de9b","#05dc9e","#04d9a1","#03d7a4","#03d5a7","#02d2aa","#02d0ad","#01ceb0","#01cbb3","#00c9b6","#00c6b8","#00c3bb","#00c1be","#00bec1","#00bbc3","#00b8c6","#00b6c9","#01b3cb","#01b0ce","#02add0","#02aad2","#03a7d5","#03a4d7","#04a1d9","#059edc","#069bde","#0798e0","#0895e2","#0992e4","#0a8ee6","#0c8be8","#0d88e9","#0e85eb","#1082ed","#117fee","#137cf0","#1578f1","#1775f3","#1872f4","#1a6ff5","#1c6cf6","#1e69f7","#2066f9","#2263f9","#2560fa","#275dfb","#295afc","#2b57fd","#2e54fd","#3051fe","#334efe","#354bfe","#3848ff","#3a45ff","#3d42ff","#4040ff","#423dff","#453aff","#4838ff","#4b35fe","#4e33fe","#5130fe","#542efd","#572bfd","#5a29fc","#5d27fb","#6025fa","#6322f9","#6620f9","#691ef7","#6c1cf6","#6f1af5","#7218f4","#7517f3","#7815f1","#7c13f0","#7f11ee","#8210ed","#850eeb","#880de9","#8b0ce8","#8e0ae6","#9209e4","#9508e2","#9807e0","#9b06de","#9e05dc","#a104d9","#a403d7","#a703d5","#aa02d2","#ad02d0","#b001ce","#b301cb","#b600c9","#b800c6","#bb00c3","#be00c1","#c100be","#c300bb","#c600b8","#c900b6","#cb01b3","#ce01b0","#d002ad","#d202aa","#d503a7","#d703a4","#d904a1","#dc059e","#de069b","#e00798","#e20895","#e40992","#e60a8e","#e80c8b","#e90d88","#eb0e85","#ed1082","#ee117f","#f0137c","#f11578","#f31775","#f41872","#f51a6f","#f61c6c","#f71e69","#f92066","#f92263","#fa2560","#fb275d","#fc295a","#fd2b57","#fd2e54","#fe3051","#fe334e","#fe354b","#ff3848","#ff3a45","#ff3d42","#ff4040"];

// load the data
queue()
  .defer(d3.json, JSON_COUNTY)
  .defer(d3.json, JSON_EDU)
  .await(ready);

// create the svg
var width = 960,
  height = 600;
var svg = d3
  .select("svg")
  .attr("width", width)
  .attr("height", height);

// create the path
var path = d3.geoPath();

// define the legend variables
var keyWidth = 300,
  keyHeight = 10;

// render after data has loaded
function ready(error, countyData, eduData) {
  // check the data
  // console.log("countyData: ", countyData);
  // console.log("eduData: ", eduData);

  // get the  min and max bachelor values
  var minBachelor = d3.min(eduData, d => d.bachelorsOrHigher);
  var maxBachelor = d3.max(eduData, d => d.bachelorsOrHigher);

  // define the colorScale
  var colorScale = d3
    .scaleQuantize()
    .domain([minBachelor, maxBachelor])
    .range(COLOR_SCHEME);

  // create the legend
  // return quantize thresholds for the key
  function findThreshold() {
    var thresholdMap = colorScale.range().map(function(color) {
      var d = colorScale.invertExtent(color);
      if (d[0] == null) d[0] = x.domain()[0];
      if (d[1] == null) d[1] = x.domain()[1];
      console.log("d:", d);
      return d;
    });
    a = [minBachelor];
    for (var i = 0; i < thresholdMap.length; i++) {
      var num = Math.round(thresholdMap[i][1] * 10) / 10;
      a.push(num);
      console.log("num: ", num);
    }
    //a.pop();
    return a;
  }
  var threshold = findThreshold();
  console.log("thresholds: ", threshold);

  // define the legend scale
  var legendX = d3
    .scaleLinear()
    .domain([minBachelor, maxBachelor])
    .range([0, keyWidth]);

  // define the legend axis
  var legendAxis = d3
    //.scale(legendX)
    .axisBottom(legendX)
    .tickSize(15)
    //.ticks(0,100,threshold.length)
    .tickValues(threshold)
    .tickFormat(n => n + "%");

  // define the toolip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("id", "tooltip");

  // create the map
  svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("class", "county")
    .attr("data-fips", d => {
      var attrData = eduData.filter(c => c.fips == d.id);
      return attrData[0].fips;
    })
    .attr("data-education", d => {
      var attrData = eduData.filter(c => c.fips == d.id);
      console.log("attrData:", attrData);
      return attrData[0].bachelorsOrHigher;
    })
    .style("fill", d => {
      var attrData = eduData.filter(c => c.fips == d.id);
      return colorScale(attrData[0].bachelorsOrHigher);
    })
    .on("mouseover", function(d) {
      attrData = eduData.filter(c => c.fips == d.id);
      tooltip
        .attr("data-fips", attrData[0].fips)
        .attr("data-education", attrData[0].bachelorsOrHigher);
      tooltip.transition().style("opacity", 1);
      tooltip
        .html(
          attrData[0].area_name +
            " " +
            attrData[0].state +
            "<br />Percentage: " +
            attrData[0].bachelorsOrHigher +
            "%"
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
      d3.select(this).style("opacity", 0.5);
    })
    .on("mouseout", function(d) {
      attrData = eduData.filter(c => c.fips == d.id);
      tooltip
        .attr("data-fips", attrData[0].fips)
        .attr("data-education", attrData[0].bachelorsOrHigher)
        .transition()
        .style("opacity", 0);
      d3.select(this).style("opacity", 1);
    });

  // add the borders
  svg
    .append("path")
    .attr("class", "county-borders")
    .attr(
      "d",
      path(
        topojson.mesh(countyData, countyData.objects.counties, function(a, b) {
          return a !== b;
        })
      )
    );

  svg
    .append("path")
    .attr("class", "state-borders")
    .attr(
      "d",
      path(
        topojson.mesh(countyData, countyData.objects.states, function(a, b) {
          return a !== b;
        })
      )
    );

  svg
    .append("path")
    .attr("class", "nation-borders")
    .attr(
      "d",
      path(
        topojson.mesh(countyData, countyData.objects.counties, function(a, b) {
          return a === b;
        })
      )
    );

  // display the axis
  var legend = d3
    .select("svg")
    .append("g")
    .attr("transform", "translate(550,20)")
    .attr("width", keyWidth)
    .attr("height", keyHeight)
    .attr("class", "legend")
    .attr("id", "legend")
    .call(legendAxis);

  // display the legend
  legend
    .selectAll("rect")
    .data(threshold)
    .enter()
    .insert("rect", ".tick")
    .attr("height", keyHeight)
    .attr("width", keyWidth / (threshold.length - 1))
    .attr("x", d => {
      console.log("d: ", d);
      console.log("legendX(d): ", legendX(d));
      return legendX(d);
    })
    .attr("fill", (d, i) => COLOR_SCHEME[i]);

  legend
    .append("text")
    .attr("fill", "#000")
    .attr("font-weight", "bold")
    .attr("text-anchor", "start")
    .attr("y", -6)
    .text("Percentage of adults with a Bachelor Degree");
}
