// グラフデータ
let nodes = [
    { id: "A", data: "" },
    { id: "B", data: "" },
    { id: "C", data: "" },
    { id: "D", data: "" }
];

let links = [
    { source: "A", target: "B", data: "" },
    { source: "B", target: "C", data: "" },
    { source: "C", target: "D", data: "" },
    { source: "D", target: "A", data: "" }
];

// SVG要素の幅と高さ
const width = 800;
const height = 600;

// SVG要素を選択
const svg = d3.select("svg");

// フォースシミュレーションの作成
const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("center", d3.forceCenter(width / 2, height / 2));

// エッジに向きを持たせる関数
function addArrows() {
    svg.append("defs").selectAll("marker")
        .data(["arrow"])
        .enter().append("marker")
        .attr("id", "arrow")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10)
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("class", "arrow")
        .attr("d", "M0,-5L10,0L0,5");
}

// エッジを描画
let link = svg.selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link")
    .attr("marker-end", "url(#arrow)");

// 頂点を描画
let node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("circle")
    .attr("class", "node")
    .attr("r", 20)
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

// ラベルを描画
let label = svg.selectAll(".label")
    .data(nodes)
    .enter().append("text")
    .attr("class", "label")
    .text(d => d.id)
    .attr("dx", 0)
    .attr("dy", 5);

// ツールチップを表示する関数
function showTooltip(d) {
    const tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = `ID: ${d.id}<br>Data: ${d.data}`;
    tooltip.style.left = `${d3.event.pageX}px`;
    tooltip.style.top = `${d3.event.pageY}px`;
    tooltip.style.opacity = 1;
}

// ツールチップを非表示にする関数
function hideTooltip() {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.opacity = 0;
}

// シミュレーションの実行
simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    label
        .attr("x", d => d.x)
        .attr("y", d => d.y);
});

// 新しい頂点を追加する関数
function addNode() {
    const newNodeId = document.getElementById("nodeIdInput").value;
    const newNodeData = document.getElementById("nodeDataInput").value;
    if (newNodeId !== "") {
        const newNode = { id: newNodeId, data: newNodeData };
        nodes.push(newNode);
        restart();
    }
}

// 新しいエッジを追加する関数
function addEdge() {
    const sourceId = document.getElementById("sourceInput").value;
    const targetId = document.getElementById("targetInput").value;
    const newEdgeData = document.getElementById("edgeDataInput").value;
    if (sourceId !== "" && targetId !== "") {
        const newEdge = { source: sourceId, target: targetId, data: newEdgeData };
        links.push(newEdge);
        restart();
    }
}

// グラフの再描画関数
function restart() {
    link = link.data(links);
    link.exit().remove();
    link = link.enter().append("line").attr("class", "link").attr("marker-end", "url(#arrow)").merge(link);

    node = node.data(nodes);
    node.exit().remove();
    node = node.enter().append("circle").attr("class", "node").attr("r", 20).merge(node);

    label = label.data(nodes);
    label.exit().remove();
    label = label.enter().append("text").attr("class", "label").text(d => d.id).attr("dx", 0).attr("dy", 5).merge(label);

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}
