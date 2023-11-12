function _1(md){return(
md`# HW2 Strong baseline`
)}

function _data(FileAttachment){return(
FileAttachment("vis2023-hw2.json").json()
)}

function _cLabel(){return(
["牡羊座","金牛座","雙子座","巨蟹座","獅子座","處女座","天秤座","天蠍座","射手座","摩羯座","水瓶座","雙魚座"]
)}

function _result(){return(
[]
)}

function _5(result,cLabel,data)
{
  result.length = 0;
  for (var y = 0; y < 12; y++) { 
    result.push({constellation: cLabel[y], gender:"male", count:0}); 
    result.push({constellation: cLabel[y], gender:"female", count:0}); 
  }
  data.forEach (x=> {
    var i = x.Constellation * 2 + (x.Gender== "男" ? 0 : 1); 
    result[i].count++;
  })
  return result
}


function _6(md){return(
md`## Bar Chart`
)}

function _7(Plot,result){return(
Plot.plot({
  grid: true,
  y: {label: "Count"},
  x: {label: "星座"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(result, {x: "constellation", y: "count", fill: "gender", tip: true}),
  ]
})
)}

function _8(md){return(
md`## Histogram `
)}

function _9(Plot,data){return(
Plot.plot({
  grid: true,
  y: {label: "Count"},
  x: {label: "星座"},
  marks: [
    Plot.rectY(data, Plot.binX({y:"count"}, { x:"Constellation", interval:1, fill:"Gender", tip: true })),
		Plot.gridY({ interval: 1, stroke: "black", strokeOpacity: 0.5 })
  ]
})
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["vis2023-hw2.json", {url: new URL("../data.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("data")).define("data", ["FileAttachment"], _data);
  main.variable(observer("cLabel")).define("cLabel", _cLabel);
  main.variable(observer("result")).define("result", _result);
  main.variable(observer()).define(["result","cLabel","data"], _5);
  main.variable(observer()).define(["md"], _6);
  main.variable(observer()).define(["Plot","result"], _7);
  main.variable(observer()).define(["md"], _8);
  main.variable(observer()).define(["Plot","data"], _9);
  return main;
}
