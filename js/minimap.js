
/*
Minimap - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the timeline should use
 */

class Minimap {

	// constructor method to initialize Timeline object
	constructor(parentElement, data, mainChart){
		this._parentElement = parentElement;
		this._data = data;
		this._mainChart = mainChart;

		// No data wrangling, no update sequence
		this._displayData = data;
	}

	// create initVis method for Timeline class
	initVis() {

		// store keyword this which refers to the object it belongs to in variable vis
		let vis = this;

		vis.margin = {top: 0, right: 40, bottom: 30, left: 40};

		vis.width = document.getElementById(vis._parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis._parentElement).getBoundingClientRect().height  - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis._parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		const chartData = vis._mainChart.data;

		// scales on minimap based on the given data
		vis.x = d3.scaleLinear()
			.range([0, vis.width])
			.domain(d3.extent(chartData, d => d.x_pos));

		vis.y = d3.scaleLinear()
			.range([vis.height, 0])
			.domain(d3.extent(chartData, d => d.y_pos));

		vis.r = d3.scaleLinear()
			.range([0, 2]) 
			.domain(d3.extent(chartData, d => d.rad));

		// stars on the minimap
		vis.svg.selectAll("circle")
			.data(chartData)
			.enter()
			.append("circle")
			.attr("cx", d => vis.x(d.x_pos))
			.attr("cy", d => vis.y(d.y_pos))
			.attr("r", d => vis.r(d.rad))
			.attr("fill", d => {
				if (d.temp > 10000) {
					return "#0000FF";
				} else {
					return vis._mainChart.colorScale(d.temp);
				}
			})
			.attr("opacity", 0.6);

		vis.brush = d3.brush()
			.extent([[0, 0], [vis.width, vis.height]])
			.on("brush end", function(event) {
				if (event.selection) {
					const [[x0, y0], [x1, y1]] = event.selection;
					
					// convert the brush's pixel rectangle into x/y domains
					const xDomain = [vis.x.invert(x0), vis.x.invert(x1)];
					const yDomain = [vis.y.invert(y1), vis.y.invert(y0)]; 
					
					vis._mainChart.updateDomain(xDomain, yDomain);
				}
			});

		// add brush to svg
		vis.brushGroup = vis.svg.append("g")
			.attr("class", "brush")
			.call(vis.brush);
	}
}