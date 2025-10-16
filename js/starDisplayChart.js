
/*
 * StarDisplayChart - ES6 Class
 * @param  parentElement 	-- the HTML element in which to draw the visualization
 * @param  data             -- the data the that's provided initially
 * @param  displayData      -- the data that will be used finally (which might vary based on the selection)
 *
 * @param  focus            -- a switch that indicates the current mode (focus or stacked overview)
 * @param  selectedIndex    -- a global 'variable' inside the class that keeps track of the index of the selected area
 */

class StarDisplayChart {

// constructor method to initialize StarDisplayChart object
constructor(parentElement, data) {
    this.parentElement = parentElement;
    this.data = data;
    this.displayData = [];
	this.get_pos();

	this.colours = ["#FF2400", "#FFFFFF", "#0000FF"]

	// Scale defined via http://www.vendian.org/mncharity/dir3/blackbody/UnstableURLs/bbr_color.html 
	this.colorScale = d3.scaleDiverging(d3.interpolateRdBu)
        .domain([3000, 40000])
		.clamp(true);

}

	/*
	 * Method that initializes the visualization (static content, e.g. SVG area or axes)
 	*/
	initVis(){
		let vis = this;

		vis.margin = {top: 40, right: 40, bottom: 60, left: 40};

		vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
		vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

		// SVG drawing area
		vis.svg = d3.select("#" + vis.parentElement).append("svg")
			.attr("width", vis.width + vis.margin.left + vis.margin.right)
			.attr("height", vis.height + vis.margin.top + vis.margin.bottom)
			.append("g")
			.attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

		// Scales and axes

		// Since distance is just relative to earth, we can arbitrarily set some stars to -dist to increase the effective space we have
		// to work with
		vis.x = d3.scaleLinear()
			.range([0, vis.width])
			.domain(d3.extent(vis.data, d => d.x_pos));

		vis.y = d3.scaleLinear()
			.range([vis.height, 0])
			.domain(d3.extent(vis.data, d => d.y_pos));

		vis.r = d3.scaleLinear()
			.range([0, vis.width / 100])
			.domain(d3.extent(vis.data, d => d.rad));

		vis.xAxis = d3.axisBottom()
			.scale(vis.x)
			.ticks(2);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y)
			.ticks(2);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.y(0) + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis")
			.attr("transform", "translate("+ vis.x(0)  + ", 0)");
        vis.wrangleData();
		
		let circles = vis.svg.selectAll("circle")
			.data(vis.data)
			.enter()
			.append("circle");      

		circles
			.attr("cx", function(d) {
				return vis.x(d.x_pos); 
			})
			.attr("cy", function(d) {
				return vis.y(d.y_pos); 
			})
			.attr("r", function(d) {
				return vis.r(d.rad)
			})
			.attr("fill", function(d) {
				if (d.temp > 10000)	{
					return "#0000FF"
				}	else	{
					return vis.colorScale(d.temp)
				}
				
			})
		
	}

	get_pos()	{
		// For each data point, defines their position on the chart using an offset
		for (let i = 0; i < this.data.length; i++)	{

			// Randomly determining x and y positions while keeping distance from center
			// TODO: seeding, for now any filters should just apply on the base data, never change it though
			let curr_offset = Math.random() * this.data[i].dist * -1;
			let reflect = Math.random();
			this.data[i].x_pos = this.data[i].dist + curr_offset

			if (reflect < 0.5)	{
				curr_offset *= -1
			}	
			this.data[i].y_pos = curr_offset
		}
	}

	get_colour()	{

	}

	/*
 	* Data wrangling
 	*/
	wrangleData(){
		let vis = this;
        
        //vis.displayData = ....;

		vis.updateVis();
	}

	/**
	 * Filters the displayed data
	 */
	filterDisplay()	{
		this.updateVis()
	}

	/*
	 * The drawing function - should use the D3 update sequence (enter, update, exit)
 	* Function parameters only needed if different kinds of updates are needed
 	*/
	updateVis(){
		let vis = this;
		vis.svg.select(".x-axis").call(vis.xAxis);
		vis.svg.select(".y-axis").call(vis.yAxis);
	}
}