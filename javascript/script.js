var margin1 = {top: 50, left: 50, right: 500, bottom: 50};
var width1 = 1500;
var height1 = 400;
var legendMargin = 20;
var legendWidth = margin1.right * 0.25;
var legendHeight = height1 - margin1.bottom - margin1.top;
var channels = ['Ned1', 'Ned2', 'Ned3', 'RTL4', 'SBS 6', 'NICK', 'Tien', 'Ver', 'YRN'];
var colors = ['red', 'blue', 'green', 'brown', 'purple', 'lime', 'black', 'magenta', 'gold'];

// make svg canvas for channel graph
var canvas1 = d3.select("body")
			.append("svg")
			.attr("width", width1)
			.attr("height", height1)
			.append("g")
			.attr("transform", "translate(20, 0)")

// make svg canvas for year graph
var canvas2 = d3.select("body")
			.append("svg")
			.attr("width", width1)
			.attr("height", height1)
			.append("g")
			.attr("transform", "translate(20," + height1 + ")")

// make canvas for legend
var legendCanvas = canvas1.append("svg")
					.attr("height", legendHeight)
					.attr("width", legendWidth)
					.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + "," + margin1.top + ")")
					.append("g");

// add color blocks to legend
var legend = legendCanvas.selectAll("rect")
			.data(channels)
			.enter()
				.append("rect")
				.attr("height", 10)
				.attr("width", 20)
				.attr("x", 75)
				.attr("y", function(d, i) { return legendHeight / 10 * (i + 1) - 10; })
				.attr("fill", function(d, i) { return colors[i]});

// add text to legend
var text = legendCanvas.selectAll("text")
			.data(channels)
			.enter()
			.append("text")
				.attr("x", 25)
				.attr("y", function(d, i) { return legendHeight / 10 * (i + 1); })
				.text(function(d) { return d });

// make border around legend
var border = legendCanvas.append("rect")
				.attr("height", legendHeight)
				.attr("width", legendWidth)
				.attr("fill", "none")
				.attr("stroke-width", 3)
				.attr("stroke", "black");

// makes line graph for channel data
d3.csv("Data/channels/Ned1.csv", function(channelData) {

	// determine scaling
	var xScale = d3.scale.linear()
				.domain(d3.extent(channelData, function(d) { return d.Jaar; }))	
				.range([margin1.left, width1-margin1.right]); 

	var yScale = d3.scale.linear()
				.domain(d3.extent(channelData, function(d) { return d.Aantal;}))
				.range([height1-margin1.top, margin1.bottom])

	// make and scale axes
	var xAxis = d3.svg.axis()
				.ticks(11)
				.tickFormat(d3.format("d")) // remove commas
				.scale(xScale);

	var	yAxis = d3.svg.axis()
				.ticks(10)
				.orient("left")
				.scale(yScale);

	// add axes to canvas
	canvas1.append("g")
		.call(xAxis)
		.attr("transform", "translate(0, 350)");
	
	canvas1.append("g")
			.call(yAxis)
			.attr("transform", "translate(50, 0)");

	// draw line through data
	var line = d3.svg.line()
			.x(function(d) {return xScale(d.Jaar);})
			.y(function(d) {return yScale(d.Aantal);});

	canvas1.append("path")
		.datum(channelData)
    	.attr("d", line)
    	.attr("fill", "none")
    	.attr("stroke", "red");

  	});

// make graph for year data
d3.csv("Data/years/2010.csv", function(yearData) {

});