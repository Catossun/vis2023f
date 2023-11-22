function _1(md){return(
md`# HW04`
)}

function _artist(FileAttachment){return(
FileAttachment("artist-1.csv").csv()
)}

function _innerCircleQuestion(artist){return(
Object.keys(artist[0])[1]
)}

function _outerCircleQuestion(artist){return(
Object.keys(artist[0])[15]
)}

function _buildHierarchy(){return(
function buildHierarchy(csv) {
  // Helper function that transforms the given CSV into a hierarchical format.
  const root = { name: "root", children: [] };
  for (let i = 0; i < csv.length; i++) {
    const sequence = csv[i][0];
    const size = +csv[i][1];
    if (isNaN(size)) {
      // e.g. if this is a header row
      continue;
    }
    const parts = sequence.split("-");
    let currentNode = root;
    for (let j = 0; j < parts.length; j++) {
      const children = currentNode["children"];
      const nodeName = parts[j];
      let childNode = null;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        let foundChild = false;
        for (let k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = { name: nodeName, children: [] };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = { name: nodeName, value: size };
        children.push(childNode);
      }
    }
  }
  return root;
}
)}

function _data(artist,innerCircleQuestion,outerCircleQuestion,buildHierarchy)
{
  // 提取內外圈問題的答案
  var innerCircleAnswer = artist.map(row => row[innerCircleQuestion]);
  var outerCircleAnswer = artist.map(row => row[outerCircleQuestion]);

  // 將內外圈答案結合，形成新的答案陣列
  var combinedAnswers = innerCircleAnswer.map((innerAns, index) => innerAns + '-' + outerCircleAnswer[index]);

  // 重新格式化答案，將其轉換為符合特定模式的陣列
  var reformattedAnswers = combinedAnswers.map(item => {
    const [prefix, values] = item.split('-');
    const splitValues = values.split(';').map(value => value.trim());
    return splitValues.map(value => `${prefix}-${value}`);
  }).reduce((acc, curr) => acc.concat(curr), []);

  // 計算每個重新格式化答案的出現次數
  var answerCounts = {};
  reformattedAnswers.forEach(reformattedAns => {
    answerCounts[reformattedAns] = (answerCounts[reformattedAns] || 0) + 1;
  });

  // 轉換為CSV格式的數據
  var csvData = Object.entries(answerCounts).map(([answer, count]) => [answer, String(count)]);
  
  // 建立包含層次結構的數據
  return buildHierarchy(csvData);
}


function _width(){return(
640
)}

function _radius(width){return(
width / 2
)}

function _partition(d3,radius){return(
data =>
  d3.partition().size([2 * Math.PI, radius * radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  )
)}

function _mousearc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(radius)
)}

function _color(d3){return(
d3
  .scaleOrdinal()
  .domain(["工作室", "替代空間", "美術館", "減少包裝材及文宣印製", "使用無毒媒材、再生材料、廢物利用素材等", "工作場所、活動展場的節約能源"])
  //.range(d3.schemePaired)
  .range(["#8E354A","#E16B8C","#DC9FB4","#0D5661","#33A6B8","#81C7D4"])
  .unknown("#BEBEBE")
)}

function _arc(d3,radius){return(
d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(1 / radius)
  .padRadius(radius)
  .innerRadius(d => Math.sqrt(d.y0))
  .outerRadius(d => Math.sqrt(d.y1) - 1)
)}

function _breadcrumbWidth(){return(
75
)}

function _breadcrumbHeight(){return(
30
)}

function _breadcrumbPoints(breadcrumbWidth,breadcrumbHeight){return(
function breadcrumbPoints(d, i) {
  const tipWidth = 10;
  const points = [];
  points.push("0,0");
  points.push(`${breadcrumbWidth},0`);
  points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
  points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
  points.push(`0,${breadcrumbHeight}`);
  if (i > 0) {
    // Leftmost breadcrumb; don't include 6th vertex.
    points.push(`${tipWidth},${breadcrumbHeight / 2}`);
  }
  return points.join(" ");
}
)}

function _16(htl){return(
htl.html`<style>
.tooltip {
  padding: 8px 12px;
  color: white;
  border-radius: 6px;
  border: 2px solid rgba(255,255,255,0.5);
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.2);
  pointer-events: none;
  transform: translate(-50%, -100%);
  font-family: "Helvetica", sans-serif;
  background: rgba(20,10,30,0.6);
  transition: 0.2s opacity ease-out, 0.1s border-color ease-out;
}
</style>`
)}

function _breadcrumb(d3,breadcrumbWidth,breadcrumbHeight,sunburst,breadcrumbPoints,color)
{
  const svg = d3
    .create("svg")
    .attr("viewBox", `0 0 ${breadcrumbWidth * 10} ${breadcrumbHeight}`)
    .style("font", "12px sans-serif")
    .style("margin", "5px");

  const g = svg
    .selectAll("g")
    .data(sunburst.sequence)
    .join("g")
    .attr("transform", (d, i) => `translate(${i * breadcrumbWidth}, 0)`);

    g.append("polygon")
      .attr("points", breadcrumbPoints)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white");

    g.append("text")
      .attr("x", (breadcrumbWidth + 10) / 2)
      .attr("y", 15)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .text(d => {
        if(d.data.name === "減少包裝材及文宣印製") {
          return "減少包裝";
        }
        else if(d.data.name === "使用無毒媒材、再生材料、廢物利用素材等") {
          return "使用再生材料";
        }
        else if(d.data.name === "工作場所、活動展場的節約能源") {
          return "節約能源";
        }
        else if(d.data.name.length > 6)
        {
          return "其他答案";
        }
        return d.data.name;
      });

  svg
    .append("text")
    .text(sunburst.percentage > 0 ? sunburst.percentage + "%" : "")
    .attr("x", (sunburst.sequence.length + 0.5) * breadcrumbWidth)
    .attr("y", breadcrumbHeight / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle");

  return svg.node();
}


function _sunburst(partition,data,d3,radius,innerCircleQuestion,outerCircleQuestion,width,color,arc,mousearc)
{
  const root = partition(data);
  const svg = d3.create("svg");
  // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
  const element = svg.node();
  element.value = { sequence: [], percentage: 0.0 };

  // 使用foreignObject插入HTML
  const fo = svg
    .append("foreignObject")
    .attr("x", `${radius+50}px`)
    .attr("y", -10)
    .attr("width", radius*2)
    .attr("height", 350);
  
  const div = fo
    .append("xhtml:div")
    .style("color","#555")
    .style("font-size", "25px")
    .style("font-family", "Arial");

  d3.selectAll("div.tooltip").remove(); // clear tooltips from before
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", `tooltip`)
    .style("position", "absolute")
    .style("opacity", 0)

  const label = svg
    .append("text")
    .attr("text-anchor", "middle");
    //.style("visibility", "hidden");

  label//內圈問題
    .append("tspan")
    .attr("class", "question1")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-6em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(innerCircleQuestion);

  label//外圈問題
    .append("tspan")
    .attr("class", "question2")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-4em")
    .attr("font-size", "2.5em")
    .attr("fill", "#BBB")
    .text(outerCircleQuestion);

  label//答案
    .append("tspan")
    .attr("class", "sequence")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", `${radius*2+50}px`)
    .attr("dy", "-1em")
    .attr("font-size", "2.5em")
    .text("");

  label//占比%數
    .append("tspan")
    .attr("class", "percentage")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "0em")
    .attr("font-size", "5em")
    .attr("fill", "#555")
    .text("");

  label//數量
    .append("tspan")
    .attr("class", "dataValue")
    .attr("x", 0)
    .attr("y", 0)
    .attr("dx", 0)
    .attr("dy", "2em")
    .attr("font-size", "2em")
    .attr("fill", "#555")
    .text("");

  svg
    .attr("viewBox", `${-radius} ${-radius} ${width*2.2} ${width}`)
    .style("max-width", `${width*2}px`)
    .style("font", "12px sans-serif");

  const path = svg
    .append("g")
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("fill", d => color(d.data.name))
    .attr("d", arc);

  svg
    .append("g")
    .attr("fill", "none")
    .attr("pointer-events", "all")
    .on("mouseleave", () => {
      path.attr("fill-opacity", 1);
      //tooltip.text("");
      //label.style("visibility", null);
      // Update the value of this view
      element.value = { sequence: [], percentage: 0.0 };
      element.dispatchEvent(new CustomEvent("input"));
    })
    .selectAll("path")
    .data(
      root.descendants().filter(d => {
        // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
        return d.depth && d.x1 - d.x0 > 0.001;
      })
    )
    .join("path")
    .attr("d", mousearc)
    .on("mouseover", (_evt, d) => {
      if(d.data.name === "減少包裝材及文宣印製") {
        tooltip
        .style("opacity", 1)
        .html(`減少包裝<br><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.844 511.844" xml:space="preserve" width="64px" height="64px" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#9ED36A;" d="M426.526,0H85.31C73.58,0,63.981,9.599,63.981,21.329v469.178c0,11.747,9.599,21.337,21.329,21.337 h341.216c11.747,0,21.338-9.59,21.338-21.337V21.329C447.863,9.599,438.273,0,426.526,0z"></path> <g> <path style="fill:#8AC054;" d="M234.592,53.319h-63.98c-5.889,0-10.661,4.772-10.661,10.661s4.772,10.661,10.661,10.661h63.98 c5.889,0,10.668-4.772,10.668-10.661S240.481,53.319,234.592,53.319z"></path> <path style="fill:#8AC054;" d="M341.238,53.319h-63.98c-5.896,0-10.677,4.772-10.677,10.661s4.78,10.661,10.677,10.661h63.98 c5.874,0,10.653-4.772,10.653-10.661S347.113,53.319,341.238,53.319z"></path> <path style="fill:#8AC054;" d="M127.961,74.642c5.889,0,10.661-4.772,10.661-10.661S133.85,53.32,127.961,53.32h-63.98v21.322 H127.961z"></path> <path style="fill:#8AC054;" d="M383.883,53.319c-5.889,0-10.653,4.772-10.653,10.661s4.765,10.661,10.653,10.661h63.98V53.319 H383.883z"></path> </g> <rect x="127.962" y="128.652" style="fill:#FB6D51;" width="255.92" height="319.24"></rect> <rect x="245.262" y="292.192" style="fill:#8AC054;" width="21.321" height="113.04"></rect> <path style="fill:#9ED36A;" d="M268.707,383.883c-4.233,0-7.459-1.078-9.583-3.201c-3.296-3.297-4.093-9.576-2.179-17.199 c2.396-9.559,8.77-20.024,17.502-28.74c11.418-11.435,25.352-18.525,36.363-18.525c4.219,0,7.451,1.062,9.576,3.201 c3.295,3.297,4.107,9.576,2.171,17.198c-2.374,9.544-8.763,20.025-17.495,28.741C293.66,376.791,279.727,383.883,268.707,383.883z"></path> <path style="fill:#8AC054;" d="M327.932,311.874c-4.281-4.28-10.279-6.326-17.121-6.326c-13.339,0-29.99,7.731-43.908,21.634 c-21.087,21.088-27.944,48.423-15.315,61.044c4.288,4.28,10.263,6.311,17.12,6.311c13.332,0,29.982-7.716,43.916-21.634 C333.695,351.83,340.553,324.495,327.932,311.874z M311.483,336.538c-2.421,7.139-7.357,14.698-13.948,21.29 c-10.638,10.622-22.149,15.402-28.827,15.402c-0.906,0-1.547-0.109-1.938-0.188c-0.273-1.172-0.477-4.343,1.266-9.498 c2.405-7.122,7.365-14.683,13.941-21.273c10.637-10.639,22.148-15.402,28.834-15.402l0,0l0,0c0.906,0,1.547,0.094,1.938,0.188 C313.014,328.213,313.217,331.399,311.483,336.538z"></path> <path style="fill:#F5BA45;" d="M299.346,233.624c3.905-8.841,2.25-19.549-4.998-26.789c-7.248-7.247-17.947-8.911-26.789-5.006 c-5.701-7.803-15.808-11.707-25.703-9.06s-16.69,11.09-17.729,20.696c-9.606,1.039-18.041,7.834-20.697,17.729 c-2.647,9.896,1.258,20.002,9.06,25.703c-3.905,8.841-2.234,19.549,5.006,26.797c7.248,7.232,17.947,8.903,26.789,4.998 c5.701,7.811,15.807,11.715,25.704,9.06c9.895-2.655,16.689-11.091,17.736-20.712c9.591-1.031,18.025-7.826,20.682-17.714 C311.061,249.432,307.156,239.325,299.346,233.624z"></path> <path style="fill:#FECD57;" d="M311.436,230.383c2.094-11.122-1.358-22.907-9.559-31.092c-6.561-6.561-15.277-10.177-24.571-10.177 c-2.202,0-4.39,0.203-6.514,0.609c-6.248-5.382-14.308-8.443-22.681-8.443c-3.038,0-6.068,0.398-9.013,1.188 c-11.184,2.999-20.064,11.473-23.821,22.149c-10.668,3.757-19.15,12.637-22.149,23.813c-2.991,11.184-0.086,23.109,7.271,31.709 c-2.077,11.114,1.367,22.899,9.56,31.085c6.561,6.56,15.292,10.184,24.571,10.184c2.21,0,4.389-0.203,6.521-0.609 c6.248,5.373,14.308,8.451,22.681,8.451l0,0c3.029,0,6.068-0.406,9.012-1.203c11.185-2.983,20.072-11.48,23.821-22.134 c10.669-3.78,19.15-12.652,22.149-23.829C321.714,250.901,318.809,238.974,311.436,230.383z M298.111,256.563 c-1.421,5.326-6.076,9.294-11.543,9.888l-8.528,0.921l-0.938,8.545c-0.577,5.467-4.562,10.106-9.88,11.527 c-1.148,0.312-2.319,0.469-3.49,0.469c-4.266,0-8.318-2.062-10.841-5.514l-5.061-6.936l-7.857,3.483 c-1.718,0.75-3.546,1.124-5.444,1.124c-3.585,0-6.959-1.39-9.497-3.936c-3.89-3.89-5.014-9.888-2.788-14.926l3.475-7.856 l-6.935-5.062c-4.452-3.257-6.482-9.013-5.053-14.339c1.429-5.318,6.068-9.294,11.543-9.88l8.536-0.922l0.922-8.536 c0.593-5.482,4.561-10.122,9.888-11.543c1.148-0.312,2.319-0.469,3.491-0.469c4.265,0,8.31,2.062,10.841,5.521l5.062,6.928 l7.856-3.468c1.718-0.758,3.546-1.141,5.436-1.141c3.593,0,6.967,1.391,9.513,3.929c3.874,3.897,4.998,9.903,2.781,14.94 l-3.469,7.857l6.936,5.061C297.503,245.48,299.533,251.243,298.111,256.563z"></path> <path style="fill:#E5E8EC;" d="M266.582,245.261c0,5.89-4.771,10.661-10.66,10.661s-10.661-4.771-10.661-10.661 c0-5.889,4.772-10.668,10.661-10.668C261.811,234.593,266.582,239.372,266.582,245.261z"></path> </g></svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "使用無毒媒材、再生材料、廢物利用素材等") {
        tooltip
        .style("opacity", 1)
        .html(`再生材料<br><svg height="64px" width="64px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.843 511.843" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path style="fill:#9ED36A;" d="M418.165,194.234c0,0-28.991-166.449-120.557-179.195c-56.14-7.81-108.952,19.213-116.855,75.321 l0,0c-7.732,56.124,30.225,81.709,90.191,75.977C362.979,157.558,418.165,194.234,418.165,194.234z"></path> <path style="fill:#9ED36A;" d="M269.961,475.602c0,0,158.639,58.092,215.465-14.824c34.833-44.705,37.832-103.952-6.795-138.848 l0,0c-44.752-34.756-85.88-14.699-110.919,40.112C329.318,446.126,269.961,475.602,269.961,475.602z"></path> <path style="fill:#9ED36A;" d="M100.808,204.106c0,0-129.632,108.341-94.893,194.003c21.29,52.531,71.103,84.756,123.65,63.543l0,0 c52.468-21.369,55.655-67.026,20.712-116.105C96.653,270.242,100.808,204.106,100.808,204.106z"></path> </g> <g> <path style="fill:#8AC054;" d="M304.387,89.859l0.016-0.016c-2.686-1.593-66.558-38.738-127.398-14.886 c-38.52,15.12-66.402,50.859-82.865,106.249c0,0.016-0.016,0.031-0.016,0.047s0,0.031-0.016,0.031l0,0 c-0.953,3.265-0.359,6.936,1.952,9.778c3.718,4.561,10.435,5.249,15.011,1.531c1.718-1.406,2.89-3.249,3.483-5.233l0,0 c14.48-48.75,38.066-79.882,70.119-92.503c51.062-20.087,108.295,12.996,108.874,13.34l0,0c3.733,2.203,8.592,1.984,12.152-0.906 c4.562-3.717,5.248-10.434,1.531-14.995C306.418,91.281,305.449,90.484,304.387,89.859z"></path> <path style="fill:#8AC054;" d="M443.251,201.482c0,0-0.016-0.016-0.03-0.031c-0.016-0.016-0.016-0.016-0.031-0.031l0,0 c-2.344-2.468-5.812-3.765-9.436-3.187c-5.811,0.937-9.762,6.404-8.825,12.215c0.359,2.203,1.358,4.139,2.78,5.639v0.016 c34.989,36.911,50.141,72.884,45.049,106.953c-8.123,54.279-65.402,87.301-65.98,87.629l0,0c-3.764,2.141-6.014,6.451-5.295,10.98 c0.938,5.811,6.42,9.764,12.23,8.826c1.281-0.203,2.453-0.641,3.531-1.234l0,0c2.732-1.531,66.822-38.254,76.586-102.891 C500.016,285.456,482.989,243.438,443.251,201.482z"></path> <path style="fill:#8AC054;" d="M252.949,470.884c-2.092-0.796-4.264-0.89-6.279-0.406l0,0 c-49.454,11.841-88.208,6.967-115.152-14.464c-42.956-34.178-42.909-100.298-42.893-100.953h-0.016 c0.047-4.344-2.562-8.436-6.857-10.076c-5.498-2.093-11.668,0.672-13.761,6.17c-0.453,1.219-0.672,2.453-0.688,3.672l0,0 c-0.047,3.123-0.281,77.008,50.813,117.775c21.29,16.996,48.032,25.523,79.882,25.523c16.495,0,34.38-2.295,53.577-6.888h0.016 c0.016-0.016,0.031-0.016,0.031-0.016h0.016c3.312-0.797,6.186-3.155,7.483-6.576C261.213,479.147,258.448,472.977,252.949,470.884 z"></path> </g> </g></svg>`)
        .style("border-color", color(d.data.name));
      }
      else if(d.data.name === "工作場所、活動展場的節約能源") {
        tooltip
        .style("opacity", 1)
        .html(`節約能源<br><svg height="64px" width="64px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 511.844 511.844" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <polygon style="fill:#FFD2A6;" points="426.463,195.378 252.126,27.976 85.403,195.378 85.403,490.538 426.463,490.538 "></polygon> <polygon style="fill:#EC5564;" points="29.163,227.415 255.953,0 482.681,226.118 452.533,256.266 255.906,60.31 59.31,257.563 "></polygon> <path style="fill:#8CC153;" d="M149.001,266.419c0,0-4.514,70.9,28.718,104.921c20.377,20.854,53.789,21.26,74.665,0.922l0,0 c20.813-20.385,21.188-53.797,0.82-74.664C219.972,263.576,149.001,266.419,149.001,266.419z"></path> <path style="fill:#79AA41;" d="M248.205,362.53c-3.265-4.874-8.028-11.2-14.159-18.744c-10.247-12.652-20.744-24.415-21.189-24.899 l0,0c-1.819-2.03-4.412-3.373-7.349-3.545c-5.873-0.328-10.911,4.17-11.239,10.043c-0.164,2.938,0.883,5.671,2.702,7.701 c16.183,18.119,34.811,41.254,36.739,46.814c-0.289-0.828-0.656-3.89,1.391-6.904l17.635,11.98 C258.015,377.197,252.11,368.372,248.205,362.53z"></path> <path style="fill:#A0D468;" d="M359.438,230.852c0,0-91.082,7.123-128.359,55.607c-22.86,29.727-17.323,72.338,12.355,95.237l0,0 c29.764,22.806,72.36,17.214,95.213-12.512C375.947,320.699,359.438,230.852,359.438,230.852z"></path> <path style="fill:#8CC153;" d="M310.936,301.69c-0.968-5.795-6.467-9.716-12.262-8.748c-1.577,0.266-3.014,0.875-4.264,1.734v-0.016 c-1,0.688-24.578,17.042-45.244,46.471c-27.694,39.457-36.871,83.662-26.523,127.852l20.76-4.858 c-9.005-38.426-1.328-75.492,22.812-110.169c18.448-26.477,40.051-41.566,40.27-41.723l-0.016-0.016 C309.78,309.953,311.654,305.906,310.936,301.69z"></path> <path style="fill:#7F4545;" d="M447.77,469.217c0-11.715-9.591-21.322-21.307-21.322H85.403c-11.723,0-21.321,9.607-21.321,21.322 v21.321c0,11.716,9.599,21.306,21.321,21.306h341.06c11.716,0,21.307-9.59,21.307-21.306L447.77,469.217L447.77,469.217z"></path> </g></svg>`)
        .style("border-color", color(d.data.name));
      }
      else
      {
        tooltip
        .style("opacity", 1)
        .html(`${d.data.name}`)
        .style("border-color", color(d.data.name));
      }
    })
    .on("mousemove", (evt, d) => {
      tooltip
        .style("top", evt.pageY - 10 + "px")
        .style("left", evt.pageX + 10 + "px");
    })
    .on("mouseout", () => {
      tooltip.style("opacity", 0);
    })
    .on("mouseenter", (event, d) => {
      // Get the ancestors of the current segment, minus the root

      //introduce
      if(d.data.name === "工作室")
      {
        div
          .html("<ul><li>定義：藝術家創作藝術品的私人空間。它可以是一個房間、一棟建築或任何專為藝術製作而設的場所。</li><li>功能：用於藝術家進行創作，例如繪畫、雕塑或任何其他形式的藝術。</li><li>特色：它是一個私密的空間，藝術家可以在這裡自由地實驗、嘗試並發展他們的技巧和創意。</li></ul>");
      }
      else if(d.data.name === "替代空間")
      {
        div
          .html("<ul><li>定義：非傳統和非商業的展示空間。可以是臨時或長期的存在，但不同於傳統的美術館和畫廊。</li><li>功能：提供一個展示非主流、實驗性或邊緣藝術的場所。這些空間通常更加開放、靈活，能夠接受更多風格和形式的藝術品。</li><li>特色：是藝術家、策展人或社群自組、自發的，對於藝術家來說，這樣的空間提供了更多的自由和可能性。</li></ul>");
      }
      else if(d.data.name === "美術館")
      {
        div
          .html("<ul><li>定義：為了展示、保護和研究藝術品而設立的公共或私人機構。</li><li>功能：除了展示藝術品，美術館也負責藝術品的保護、修復、研究和教育等功能。</li><li>特色：通常有較為正式和嚴謹的運作模式。它們可能有長期或特定主題的展覽，且會對藝術品有一定的選擇和評價標準。</li></ul>");
      }
      else
      {
        div.html("");
      }
      
      //dataValue
      label
        .style("visibility", null)
        .select(".dataValue")
        .text("計數："+d.value);
      
      //question
      if(d.depth-1 === 0)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#000");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#BBB");
      }
      else if(d.depth-1 === 1)
      {
        label
          .style("visibility", null)
          .select(".question1")
          .attr("fill", "#BBB");
        label
          .style("visibility", null)
          .select(".question2")
          .attr("fill", "#000");
      }
      
      const sequence = d
        .ancestors()
        .reverse()
        .slice(1);
      // Highlight the ancestors
      path.attr("fill-opacity", node =>
        sequence.indexOf(node) >= 0 ? 1.0 : 0.3
      );
      label
        .style("visibility", null)
        .select(".sequence")
        //.style("visibility", "visible")
        .attr("fill", sequence => color(d.data.name))
        .text(d.data.name);
      const percentage = ((100 * d.value) / root.value).toPrecision(3);
      label
        .style("visibility", null)
        .select(".percentage")
        .text(percentage + "%");

      /*tooltip
        .text(d.data.name);*/
      
      // Update the value of this view with the currently hovered sequence and percentage
      element.value = { sequence, percentage };
      element.dispatchEvent(new CustomEvent("input"));
    });     

  return element;
}


function _19(md){return(
md`# 結論

## 從上圖中，我們可以看出：

- 填寫這份問卷的人大多數為藝術工作者。
- 他們通常以行動或計劃在進行推動永續事務。
`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["artist-1.csv", {url: new URL("./artist-1.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("artist")).define("artist", ["FileAttachment"], _artist);
  main.variable(observer("innerCircleQuestion")).define("innerCircleQuestion", ["artist"], _innerCircleQuestion);
  main.variable(observer("outerCircleQuestion")).define("outerCircleQuestion", ["artist"], _outerCircleQuestion);
  main.variable(observer("buildHierarchy")).define("buildHierarchy", _buildHierarchy);
  main.variable(observer("data")).define("data", ["artist","innerCircleQuestion","outerCircleQuestion","buildHierarchy"], _data);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("radius")).define("radius", ["width"], _radius);
  main.variable(observer("partition")).define("partition", ["d3","radius"], _partition);
  main.variable(observer("mousearc")).define("mousearc", ["d3","radius"], _mousearc);
  main.variable(observer("color")).define("color", ["d3"], _color);
  main.variable(observer("arc")).define("arc", ["d3","radius"], _arc);
  main.variable(observer("breadcrumbWidth")).define("breadcrumbWidth", _breadcrumbWidth);
  main.variable(observer("breadcrumbHeight")).define("breadcrumbHeight", _breadcrumbHeight);
  main.variable(observer("breadcrumbPoints")).define("breadcrumbPoints", ["breadcrumbWidth","breadcrumbHeight"], _breadcrumbPoints);
  main.variable(observer()).define(["htl"], _16);
  main.variable(observer("breadcrumb")).define("breadcrumb", ["d3","breadcrumbWidth","breadcrumbHeight","sunburst","breadcrumbPoints","color"], _breadcrumb);
  main.variable(observer("viewof sunburst")).define("viewof sunburst", ["partition","data","d3","radius","innerCircleQuestion","outerCircleQuestion","width","color","arc","mousearc"], _sunburst);
  main.variable(observer("sunburst")).define("sunburst", ["Generators", "viewof sunburst"], (G, _) => G.input(_));
  main.variable(observer()).define(["md"], _19);
  return main;
}
