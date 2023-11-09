function _1(md){return(
md`# HW2 Medium baseline`
)}

function _data(FileAttachment){return(
FileAttachment("vis2023-hw2.json").json()
)}

function _yCounts(){return(
[]
)}

function _years(data){return(
data.map(item => item.Year)
)}

function _5(yCounts,years,data)
{
  yCounts.length = 0; //將yCounts清空
  var minYear = Math.min(...years); //最早出生年
  var maxYear = Math.max(...years); //最晚出生年
  for (var y=minYear; y<=maxYear; y++) { 
    //所有年份都建立兩個Object，一個存放男性資料，一個存放女性資料
    yCounts.push({year:y, gender:"male", count:0}); 
    //Object包含：1. 出生年，2.男性，3.人數(設為0)
    yCounts.push({year:y, gender:"female", count:0}); 
    //Object包含：1. 出生年，2.女性，3.人數(設為0)
  }
  data.forEach (x=> {
    var i = (x.Year-minYear)*2 + (x.Gender== "男" ? 0 : 1); 
    yCounts[i].count++;
    //讀取data array，加總每個年份出生的人
  })
  return yCounts
}


function _settings(Inputs){return(
Inputs.form({
	mt: Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr: Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb: Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml: Inputs.range([0, 100], {label: "marginLeft", step: 1}),
})
)}

function _7(Plot,settings,yCounts){return(
Plot.plot({
  marginTop: settings.mt,
	marginRight: settings.mr,
	marginBottom: settings.mb,
	marginLeft: settings.ml,
  grid: true,
  y: {label: "count"},
  marks: [
    Plot.ruleY([0]),
    Plot.barY(yCounts, {x: "year", y: "count", fill: "gender", tip: true}),
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
  main.variable(observer("yCounts")).define("yCounts", _yCounts);
  main.variable(observer("years")).define("years", ["data"], _years);
  main.variable(observer()).define(["yCounts","years","data"], _5);
  main.variable(observer("viewof settings")).define("viewof settings", ["Inputs"], _settings);
  main.variable(observer("settings")).define("settings", ["Generators", "viewof settings"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","settings","yCounts"], _7);
  return main;
}
