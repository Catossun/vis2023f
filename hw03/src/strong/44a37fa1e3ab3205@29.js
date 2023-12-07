function _1(md){return(
md`# HW03 Strong Baseline`
)}

function _userdata(FileAttachment){return(
FileAttachment("UserData.json").json()
)}

function _LivePlace_column(userdata){return(
userdata.map(row => row["LivingPlaceFirst"])
)}

function _LivePlace_uniqueValues(LivePlace_column){return(
[...new Set(LivePlace_column)].sort()
)}

function _LivePlace_counts(LivePlace_uniqueValues,LivePlace_column)
{
  const arr = LivePlace_uniqueValues.map(val => ({
    value: val,
    count: LivePlace_column.filter(v => v === val).length
  }));
  return arr.sort((a, b) => a.count - b.count);
}


function _scaleCount(LivePlace_uniqueValues,LivePlace_counts){return(
(county) => {
  if (!LivePlace_uniqueValues.includes(county)) return 0;
  return LivePlace_counts.findIndex(t => t.value === county) + 5;
}
)}

function _returnCount(LivePlace_uniqueValues,LivePlace_counts){return(
(county) => {
  if (!LivePlace_uniqueValues.includes(county)) return 0;
  return LivePlace_counts.find(t => t.value === county).count;
}
)}

function _tw(d3){return(
d3.json("https://cdn.jsdelivr.net/npm/taiwan-atlas/towns-10t.json")
)}

function _twCountyHandler(tw)
{
  tw.objects.counties.geometries.forEach((element) => {
    if (element.properties.COUNTYNAME === "台東縣") {
      element.properties.COUNTYNAME = "臺東縣";
    } else if (element.properties.COUNTYNAME === "台中市") {
      element.properties.COUNTYNAME = "臺中市";
    } else if (element.properties.COUNTYNAME === "台北市") {
      element.properties.COUNTYNAME = "臺北市";
    } else if (element.properties.COUNTYNAME === "台南市") {
      element.properties.COUNTYNAME = "臺南市";
    }
  });
  return "處理台與臺的關係"
}


function _topojson(require){return(
require("topojson-client@3")
)}

function _bgColor(Inputs){return(
Inputs.color({ label: "background color", value: "#cccccc" })
)}

function _strokeColor(Inputs){return(
Inputs.color({ label: "stroke color", value: "#CCCC00" })
)}

function _strokeOpacity(Inputs){return(
Inputs.range([0, 1], {
  step: 0.01,
  label: "stroke opacity"
})
)}

function _chart(d3,LivePlace_uniqueValues,topojson,tw,DOM,bgColor,strokeColor,strokeOpacity,scaleCount,returnCount)
{
  const color = d3.scaleQuantize([0, LivePlace_uniqueValues.length + 10], d3.schemeBlues[9]);
  
  const width = 300;
  const height = 260;
  const offsetX = 0.25;
  const offsetY = -0.7;
  const scale = 3500;

  const bboxCenter = (bbox) => [
    (bbox[0] + bbox[2]) / 2 + offsetX,
    (bbox[1] + bbox[3]) / 2 + offsetY
  ];
  const projection = d3
    .geoMercator()
    .center(bboxCenter(topojson.bbox(tw)))
    .translate([width / 2, height / 2])
    .scale(scale);

  const path = d3.geoPath().projection(projection);

  const svg = d3
    .select(DOM.svg(width, height))
    .style("width", "100%")
    .style("height", "auto")
    .style("background-color", bgColor);

  const details = svg
    .append("g")
    .selectAll("path")
    .data(topojson.feature(tw, tw.objects.counties).features);

  svg
    .append("path")
    .datum(topojson.mesh(tw, tw.objects.counties, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke", strokeColor)
    .attr("stroke-linejoin", "round")
    .attr("stroke-width", 0.5)
    .attr("opacity", strokeOpacity)
    .attr("d", path);

  details
    .enter()
    .append("path")
    .attr("fill", (d) => {
      return color(scaleCount(d.properties.COUNTYNAME));
    })
    .attr("d", path)
    .append("title")
    .text(d => d.properties.COUNTYNAME + ", " + `${returnCount(d.properties.COUNTYNAME)}`);

  svg.append("g");
  
  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["UserData.json", {url: new URL("../json/UserData.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("userdata")).define("userdata", ["FileAttachment"], _userdata);
  main.variable(observer("LivePlace_column")).define("LivePlace_column", ["userdata"], _LivePlace_column);
  main.variable(observer("LivePlace_uniqueValues")).define("LivePlace_uniqueValues", ["LivePlace_column"], _LivePlace_uniqueValues);
  main.variable(observer("LivePlace_counts")).define("LivePlace_counts", ["LivePlace_uniqueValues","LivePlace_column"], _LivePlace_counts);
  main.variable(observer("scaleCount")).define("scaleCount", ["LivePlace_uniqueValues","LivePlace_counts"], _scaleCount);
  main.variable(observer("returnCount")).define("returnCount", ["LivePlace_uniqueValues","LivePlace_counts"], _returnCount);
  main.variable(observer("tw")).define("tw", ["d3"], _tw);
  main.variable(observer("twCountyHandler")).define("twCountyHandler", ["tw"], _twCountyHandler);
  main.variable(observer("topojson")).define("topojson", ["require"], _topojson);
  main.variable(observer("viewof bgColor")).define("viewof bgColor", ["Inputs"], _bgColor);
  main.variable(observer("bgColor")).define("bgColor", ["Generators", "viewof bgColor"], (G, _) => G.input(_));
  main.variable(observer("viewof strokeColor")).define("viewof strokeColor", ["Inputs"], _strokeColor);
  main.variable(observer("strokeColor")).define("strokeColor", ["Generators", "viewof strokeColor"], (G, _) => G.input(_));
  main.variable(observer("viewof strokeOpacity")).define("viewof strokeOpacity", ["Inputs"], _strokeOpacity);
  main.variable(observer("strokeOpacity")).define("strokeOpacity", ["Generators", "viewof strokeOpacity"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","LivePlace_uniqueValues","topojson","tw","DOM","bgColor","strokeColor","strokeOpacity","scaleCount","returnCount"], _chart);
  return main;
}
