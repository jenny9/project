var margin = {top: 50, left: 50, right: 500, bottom: 50};
var width = 1500;
var height = 400;
var dataArray = [10, 20, 30];


d3.csv("Data/channels/Ned1.csv", function(channelData) {


	// determine scaling
	var xScale1 = d3.scale.linear()
				.domain(d3.extent(channelData, function(d) { return d.Jaar; }))	
				.range([margin.left, width-margin.right]); 

	var yScale1 = d3.scale.linear()
				.domain(d3.extent(channelData, function(d) { return d.Aantal;}))
				.range([height-margin.top, margin.bottom])

	// make and scale axes
	var xAxis1 = d3.svg.axis()
				.ticks(11)
				.tickFormat(d3.format("d")) // remove commas
				.scale(xScale1);

	var	yAxis1 = d3.svg.axis()
				.ticks(10)
				.orient("left")
				.scale(yScale1);

	// make svg canvas 
	var canvas1 = d3.select("body")
				.append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g") // makes a group of all things of svg, allows to transform everything in group
				.attr("transform", "translate(20, 0)")

	// add axes to canvas
	canvas1.append("g")
		.call(xAxis1)
		.attr("transform", "translate(0, 350)");
	
	canvas1.append("g")
			.call(yAxis1)
			.attr("transform", "translate(50, 0)");

	// draw line through data
	var line = d3.svg.line()
			.x(function(d) {return xScale1(d.Jaar);})
			.y(function(d) {return yScale1(d.Aantal);});

	canvas1.append("path")
		.datum(channelData)
    	.attr("d", line)

	});

