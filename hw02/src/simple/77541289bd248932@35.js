function _1(md){return(
md`# HW2 Simple baseline`
)}

function _data(FileAttachment){return(
FileAttachment("vis2023-hw2.json").json()
)}

function _settings(Inputs){return(
Inputs.form({
	mt: Inputs.range([0, 100], {label: "marginTop", step: 1}),
	mr: Inputs.range([0, 100], {label: "marginRight", step: 1}),
	mb: Inputs.range([0, 100], {label: "marginBottom", step: 1}),
	ml: Inputs.range([0, 100], {label: "marginLeft", step: 1}),
})
)}

function _4(Plot,settings,data){return(
Plot.plot({
	marginTop: settings.mt,
	marginRight: settings.mr,
	marginBottom: settings.mb,
	marginLeft: settings.ml,
	y: {grid: true, label: "count"},
	marks: [
		Plot.rectY(data, Plot.binX({y:"count"}, { x:"Year", interval:1, fill:"Year", tip: true })),
		Plot.gridY({ interval: 1, stroke: "white", strokeOpacity: 0.5 })
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
  main.variable(observer("viewof settings")).define("viewof settings", ["Inputs"], _settings);
  main.variable(observer("settings")).define("settings", ["Generators", "viewof settings"], (G, _) => G.input(_));
  main.variable(observer()).define(["Plot","settings","data"], _4);
  return main;
}
