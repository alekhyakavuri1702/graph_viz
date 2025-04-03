import React, { useState, useEffect } from "react";
import * as d3 from "d3";

const GraphDashboard = () => {
  const [numNodes, setNumNodes] = useState(5);
  const [graphType, setGraphType] = useState("random");

  useEffect(() => {
    drawGraph();
  }, [numNodes, graphType]);

  const drawGraph = () => {
    d3.select("#graph-container").selectAll("*").remove();
    const svg = d3.select("#graph-container")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500)
      .style("display", "block")
      .style("margin", "auto");

    const nodes = d3.range(numNodes).map((d) => ({ id: d }));
    let links = [];

    if (graphType === "tree") {
      for (let i = 1; i < nodes.length; i++) {
        links.push({ source: Math.floor(i / 2), target: i });
      }
    } else if (graphType === "circular") {
      links = nodes.map((d, i) => ({ source: i, target: (i + 1) % nodes.length }));
    } else if (graphType === "bipartite") {
      const half = Math.floor(numNodes / 2);
      links = d3.range(half).map((d) => ({ source: d, target: d + half }));
    } else if (graphType === "complete") {
      links = [];
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          links.push({ source: i, target: j });
        }
      }
    } else if (graphType === "cycle") {
      links = nodes.map((d, i) => ({ source: i, target: (i + 1) % nodes.length }));
    } else if (graphType === "planar") {
      for (let i = 0; i < numNodes - 1; i++) {
        links.push({ source: i, target: i + 1 });
      }
    } else {
      links = d3.range(numNodes - 1).map(() => ({
        source: Math.floor(Math.random() * numNodes),
        target: Math.floor(Math.random() * numNodes),
      }));
    }

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(80))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(250, 250));

    const link = svg.selectAll(".link")
      .data(links)
      .enter().append("line")
      .attr("stroke", "red")
      .attr("stroke-width", 2);

    const node = svg.selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("r", 10)
      .attr("fill", "darkred")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("transition", "0.3s")
      .on("mouseover", function () {
        d3.select(this).style("stroke", "black").style("stroke-dasharray", "4 4");
      })
      .on("mouseout", function () {
        d3.select(this).style("stroke-dasharray", "0");
      });

    simulation.on("tick", () => {
      link.attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-screen">
      <h1 className="text-2xl font-bold mb-4 transition-transform transform hover:scale-110 text-center">
        Graph Visualization
      </h1>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="mr-2">Number of Nodes:</label>
          <input type="number" value={numNodes} onChange={(e) => setNumNodes(+e.target.value)} className="border p-2 text-center" />
        </div>
        <div>
          <label className="mr-2">Graph Type:</label>
          <select value={graphType} onChange={(e) => setGraphType(e.target.value)} className="border p-2">
            <option value="random">Random</option>
            <option value="tree">Tree</option>
            <option value="circular">Circular</option>
            <option value="bipartite">Bipartite</option>
            <option value="complete">Complete</option>
            <option value="cycle">Cycle</option>
            <option value="planar">Planar</option>
          </select>
        </div>
      </div>
      <button onClick={drawGraph} className="bg-red-600 text-white p-2 rounded shadow-lg hover:bg-red-800 transition">
        Generate Graph
      </button>
      <div id="graph-container" className="mt-4 border flex justify-center items-center p-6 w-[500px] h-[500px]"></div>
    </div>
  );
};

export default GraphDashboard;
