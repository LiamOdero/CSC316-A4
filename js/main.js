
// Variables for the visualization instances
let areachart, timeline;
let data;

let RADIUS_EARTH = 6378;
let SUN_LUMINOSITY = 3.83e26

// Start application by loading the data
loadData();

function loadData() {
    d3.csv("data/star_dataset.csv"). then(data=>{
            
        data_cleaned = prepareData(data)
        
		console.log(data_cleaned)
        console.log('data loaded ')

		areachart = new StarDisplayChart("stacked-area-chart", data_cleaned);

		areachart.initVis();
		
		minimap = new Minimap("timeline", data.years, areachart)
		minimap.initVis();

		d3.select("#reset-brush-btn").on("click", () => {
			minimap.resetBrush();
		});

		d3.select("#full-extent-btn").on("click", () => {
			minimap.setFullExtent();
		});
    });

}

function prepareData(data){
	data_cleansed = [];
	data.forEach(e => {
		data_cleansed.push({name: e.Source, 
							dist: +e.Dist, 
							lum: (e["Lum-Flame"]) ? + e["Lum-Flame"] * SUN_LUMINOSITY : NaN, 
							rad: +e.Rad * RADIUS_EARTH,
							temp: +e.Teff})
	});

	data_cleansed.sort(function(a, b)	{
		return b.dist - a.dist;
	})

	for (let i = 0; i < data_cleansed.length; i++)	{
		if (i % 2 == 1)	{
			data_cleansed[i].dist *= -1
		}
	}

	return data_cleansed
}

function brushed() {

}
