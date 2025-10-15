
// Variables for the visualization instances
let areachart, timeline;
let data;

// Start application by loading the data
loadData();

function loadData() {
    d3.json("data/star_dataset.csv"). then(data=>{
            
        data = prepareData(data)
        
        console.log('data loaded ')

        // TO-DO (Activity I): instantiate visualization objects
		areachart = new StarDisplayChart("stacked-area-chart", data.layers);

        // TO-DO (Activity I):  init visualizations
		areachart.initVis();

		minimap = new Minimap("timeline", data.years)
		minimap.initVis();

    });

}


// helper function - PROVIDE WITH TEMPLATE
function prepareData(data){

	return data
}

function brushed() {
}
