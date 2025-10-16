
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
			.domain([-d3.max(vis.data, function(d)	{
						return d.dist;
					}),
					d3.max(vis.data, function(d)	{
						return d.dist;
					})]);

		vis.y = d3.scaleLinear()
			.range([0, vis.height])
			.domain([-d3.max(vis.data, function(d)	{
						return d.dist;
					}),
					d3.max(vis.data, function(d)	{
						return d.dist;
					})]);

		vis.r = d3.scaleLinear()
			.range([0, vis.width / 100])
			.domain([d3.min(vis.data, function(d)	{
					return d.rad;
					}),
					d3.max(vis.data, function(d)	{
						return d.rad;
					})]);

		vis.xAxis = d3.axisBottom()
			.scale(vis.x);

		vis.yAxis = d3.axisLeft()
			.scale(vis.y);

		vis.svg.append("g")
			.attr("class", "x-axis axis")
			.attr("transform", "translate(0," + vis.height + ")");

		vis.svg.append("g")
			.attr("class", "y-axis axis");
			
        vis.wrangleData();
		
		let circles = vis.svg.selectAll("circle")
			.data(vis.data)
			.enter()
			.append("circle");      

		circles
			.attr("cx", function(d) {
				return vis.x(d.dist); 
			})
			.attr("cy", function(d) {
				return 0; 
			})
			.attr("r", function(d) {
				console.log(vis.r(d.dist))
				return vis.r(d.rad)
			})
		
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
	}
}