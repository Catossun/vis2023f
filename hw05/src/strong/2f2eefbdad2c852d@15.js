function _1(md){return(
md`# HW05 Strong`
)}

function _group_11(FileAttachment){return(
FileAttachment("Group_11.json").json()
)}

function _randomMemberScore(group_11){return(
() => {
  group_11.children[0].children.forEach((element, index) => {
    element.Hw1_score = parseInt(Math.random() * 11);
    element.Hw2_score = parseInt(Math.random() * 11);
    element.Hw3_score = parseInt(Math.random() * 11);
    element.Hw4_score = parseInt(Math.random() * 11);
    element.Hw5_score = parseInt(Math.random() * 11);
    element.Hw6_score = parseInt(Math.random() * 11);
    element.Hw7_score = parseInt(Math.random() * 11);
    element.Hw8_score = parseInt(Math.random() * 11);
    element.Hw9_score = parseInt(Math.random() * 11);
    element.Hw10_score = parseInt(Math.random() * 11);
  })
}
)}

function _url_list(){return(
[
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/01.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/11.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/12.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/21.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/22.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/31.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/32.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/41.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/42.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/51.svg",
  "https://tjhsieh.github.io/c/vis/vis2023f/syllabus/grade/svg10/52.svg"
]
)}

function _drag(d3){return(
simulation => {
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended); 
}
)}

function _strong(randomMemberScore,d3,group_11,drag,url_list,invalidation)
{
  // 指定圖表的尺寸。
  const width = 2000;
  const height = 400;
  randomMemberScore();

  // 計算圖形並啟動力模擬。
  const root = d3.hierarchy(group_11);
  const links = root.links();
  const nodes = root.descendants();
  
  const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
      .force("charge", d3.forceManyBody().strength(-700))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  // 創建容器 SVG。
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

  // 添加連結。
  const link = svg.append("g")
      .attr("stroke", "#00f")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  
  const linkForce = d3.forceLink(links)
    .id(d => d.id)
    .distance(1000) // 增加連結的距離
    .strength(1); // 可選：設定連結的強度

  // 設定節點的顏色，根據階層關係選擇不同的顏色
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // 使用 D3 的顏色比例尺
  
  // 添加節點。
  const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("transform", d => `translate(${d.x},${d.y})`) // 定位節點
      .call(drag(simulation))
      .on("click", toggleNode) // 添加點擊事件處理程序
      

  // 添加節點外框
  const circleRadius = 20; // 調整圓圈半徑大小
  node.append("circle")
      .attr("r", circleRadius)
      .attr("fill", "white") // 內部填充顏色
      .attr("stroke", d => colorScale(d.depth)) // 外框顏色根據節點深度
      .attr("stroke-width", 3);
  
  // 在節點外框周圍添加多個圖片
  const numImages = 10; // 圖片的數量
  const imageRadius = circleRadius + 10; // 圖片環繞外框的半徑
  const imageWidth = 20; // 圖片的寬度
  const imageHeight = 20; // 圖片的高度
  const imagesGroup = node.append("g"); // 新增一個 <g> 元素用於包裝圖片
  
  for (let i = 0; i < numImages; i++) {
      const angle = ((i / numImages) * 2 * Math.PI); // 逆時鐘排列，角度方向不變
      const x = imageRadius * Math.sin(angle); // 調整 x 座標的計算
      const y = -imageRadius * Math.cos(angle); // 調整 y 座標的計算
      imagesGroup.append("image")
          .attr("xlink:href", d => {
              if (d.data.leval == 3) { // 如果有子節點，顯示子節點的資訊
                  const score = parseInt(d.data[`Hw${i + 1}_score`]);
                  return url_list[score];
              }
          })
          .attr("x", x - imageWidth / 2) // 調整 x 位置，使圖片居中
          .attr("y", y - imageHeight / 2) // 調整 y 位置，使圖片居中
          .attr("width", imageWidth)
          .attr("height", imageHeight);
  }


  
  //設定圖片大小
  const size_offset = 1.2;//控制內圖片大小
  
  // 計算偏移量
  const offset = size_offset / 2;//控制內圖片放置位置的偏移量
  
  // 添加內圖
  node.append("image")
    .attr("x", -(circleRadius * offset)) // 將圖片的左上角放在圓圈框的左上角
    .attr("y", -(circleRadius * offset)) // 將圖片的左上角放在圓圈框的左上角
    .attr("width", circleRadius * size_offset) // 設置圖片寬度為圓圈直徑的兩倍
    .attr("height", circleRadius * size_offset) // 設置圖片高度為圓圈直徑的兩倍
    .attr("href",d => d.data.image_url);

   //添加節點文字說明 
  node.append("title")
        .text(d => {
        if (d.data.leval == 1) { // 如果沒有子節點，顯示父節點的資訊
          return d.data.Name;
        } else if(d.data.leval == 2){
          return  "組別 : "+d.data.Group+
                  "\n組長 : "+d.data.Teamleadername+
                  "\n隊名 : "+d.data.Teamname+
                  "\n團隊里程數 : "+d.data.Team_Mileage;
        }else if(d.data.leval == 3){ // 如果有子節點，顯示子節點的資訊
          return  "系所 : "+d.data.Department+
                  "\n學號 : "+d.data.Classnumber+
                  "\n姓名 : "+d.data.Name+
                  "\n個人里程數 : "+d.data.Personal_Mileage+
                  "\n作業1成績 : "+d.data.Hw1_score+
                  "分\n作業2成績 : "+d.data.Hw2_score+
                  "分\n作業3成績 : "+d.data.Hw3_score+
                  "分\n作業4成績 : "+d.data.Hw4_score+
                  "分\n作業5成績 : "+d.data.Hw5_score+
                  "分\n作業6成績 : "+d.data.Hw6_score+
                  "分\n作業7成績 : "+d.data.Hw7_score+
                  "分\n作業8成績 : "+d.data.Hw8_score+
                  "分\n作業9成績 : "+d.data.Hw9_score+
                  "分\n作業10成績 : "+d.data.Hw10_score+"分";
        }
      }
  );//加入要顯示的資訊 

  
 // 設定節點初始位置在畫布的中間
  nodes.forEach(node => {
    node.y = 0; // 將y座標設定在畫布的中間
  });

  // 更新力模擬的y方向力，讓節點向下運動
  simulation.force("y", d3.forceY().strength(0.1).y(d => d.depth * 30)); // 調整動力的方向和大小
  
  simulation.on("tick", () => {
    node.attr("transform", d => `translate(${d.x},${d.y})`); // 更新節點位置
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
  });
  //實現點擊收縮擴張功能
  function toggleNode(event, d) {
    if (d.data.leval == 1) {
      // 切換其他節點和連接的顯示
      var trans = true;
      nodes.forEach(node => {
        if (node.data.leval == 2) {
          node.collapsed = !node.collapsed;
          trans = node.collapsed;
        }else if(node.data.leval == 3 && trans) {
          node.collapsed = trans;
        }
      });
    }else if (d.data.leval == 2) {
      // 切換其他節點和連接的顯示
      var G = d.data.Group;
      nodes.forEach(node => {
        if (node.data.leval > 2 && node.data.Group == G) {
          node.collapsed = !node.collapsed;
        }
      });
    } 
    update();
  }
  
  function update() {
     node.attr("transform", d => `translate(${d.x},${d.y})`);
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    // 更新節點顯示
    node.style("display", d => d.collapsed ? "none" : null);
    link.style("display", d => d.target.collapsed ? "none" : null);
  }
  invalidation.then(() => simulation.stop());

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["Group_11.json", {url: new URL("../Group_11.json", import.meta.url), mimeType: "application/json", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer("group_11")).define("group_11", ["FileAttachment"], _group_11);
  main.variable(observer("randomMemberScore")).define("randomMemberScore", ["group_11"], _randomMemberScore);
  main.variable(observer("url_list")).define("url_list", _url_list);
  main.variable(observer("drag")).define("drag", ["d3"], _drag);
  main.variable(observer("strong")).define("strong", ["randomMemberScore","d3","group_11","drag","url_list","invalidation"], _strong);
  return main;
}
