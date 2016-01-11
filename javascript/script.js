'use strict'

var margin1 = {top: 25, left: 25, right: 500, bottom: 25};
var width1 = 1500;
var height1 = 350;

var buttonHeight = 40;
var buttonWidth = 80;

var legendMargin = 20;
var legend1Width = margin1.right * 0.25;
var legend1Height = height1 - margin1.bottom - margin1.top - buttonHeight;
var legend2Width = margin1.right * 0.25; 
var legend2Height = 0.5 * height1;

var channels = ['Ned1', 'Ned2', 'Ned3', 'RTL4', 'SBS 6', 'NICK', 'Tien', 'Ver', 'YRN'];
var years = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];
var buttonOptions = ['Channel', 'Time', 'Category']
var colors = ['red', 'blue', 'green', 'brown', 'purple', 'lime', 'black', 'magenta', 'gold'];

var mouse = [0,0]

// make svg canvas for channel graph
var canvas1 = d3.select("body")
			.append("svg")
			.attr("width", width1)
			.attr("height", height1)
			.append("g")
			.attr("transform", "translate(40, 0)")

// make svg canvas for year graph
var canvas2 = d3.select("body")
			.append("svg")
			.attr("width", width1)
			.attr("height", height1)
			.append("g")
			.attr("transform", "translate(40," + height1 + ")")

// make canvas for legend1
var legend1Canvas = canvas1.append("svg")
					.attr("height", legend1Height)
					.attr("width", legend1Width)
					.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + "," + margin1.top + ")");

// make canvas for legend2
var legend2Canvas = canvas2.append("svg")
					.attr("height", legend2Height)
					.attr("width", legend2Width)
					.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + "," + (-height1 + margin1.top) + ")")
					.append("g"); 

// add color blocks to legend1
var buttons1 = legend1Canvas.selectAll("rect")
			.data(channels)
			.enter()
				.append("rect")
				.attr("height", 20)
				.attr("width", 30)
				.attr("x", 75)
				.attr("y", function(d, i) { return legend1Height / 10 * (i + 1) - 15; })
				.attr("fill", function(d, i) { return colors[i]});

// add legend1Text to legend1
var legend1Text = legend1Canvas.selectAll("text")
			.data(channels)
			.enter()
			.append("text")
				.attr("x", 25)
				.attr("y", function(d, i) { return legend1Height / 10 * (i + 1); })
				.text(function(d) { return d });

// make border around legend1
var border1 = legend1Canvas.append("rect")
			.attr("height", legend1Height)
			.attr("width", legend1Width)
			.attr("fill", "none")
			.attr("stroke-width", 3)
			.attr("stroke", "black");

// make group element for buttons of legend 2
var buttonGroup = legend2Canvas.selectAll("g")
			.data(buttonOptions)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {return "translate (20," + (i * 55 + 10) + ")"});

// make buttons on legend 2
var legend2 = buttonGroup.append("rect")
				.attr("height", buttonHeight)
				.attr("width", buttonWidth)
				.attr("fill", "none")
				.attr("stroke-width", 3)
				.attr("stroke", "black")

var textLegend2 = buttonGroup.append("text")
					.text(function(d) { return d })
					.attr("x", buttonWidth * 0.1)
					.attr("y", buttonHeight * 0.5);

// make border around legend 2
var border2 = legend2Canvas.append("rect")
		.attr("height", legend2Height)
		.attr("width", legend2Width)
		.attr("fill", "none")
		.attr("stroke-width", 3)
		.attr("stroke", "black"); 

// load in all channel data
var q1 = queue()
	.defer(d3.csv, "Data/channels/Ned1.csv")
	.defer(d3.csv, "Data/channels/Ned2.csv")
	.defer(d3.csv, "Data/channels/Ned3.csv")
	.defer(d3.csv, "Data/channels/RTL4.csv")
	.defer(d3.csv, "Data/channels/SBS 6.csv")
	.defer(d3.csv, "Data/channels/NICK.csv")
	.defer(d3.csv, "Data/channels/Tien.csv")
	.defer(d3.csv, "Data/channels/Ver.csv")
	.defer(d3.csv, "Data/channels/YRN.csv");

// makes line graph for channel data
q1.awaitAll(function(error, files) {

	// convert string to int 
	files.forEach(function(files) {
		files[0].Jaar = +files[0].Jaar;
		files[0].Aantal = +files[0].Aantal;
	});

	// determine scaling
	var xScale = d3.scale.linear()
				.domain(d3.extent(files[0], function(files) { return files.Jaar; }))	
				.range([margin1.left, width1-margin1.right]); 

	var yScale = d3.scale.linear()
				.domain([0, 50])
				.range([height1-margin1.top, margin1.bottom]);

	var line = d3.svg.line()
			.x(function(files) {return xScale(files.Jaar);})
			.y(function(files) {return yScale(files.Aantal);});
	
	// draw lines of all data files
	var lines1 = canvas1.selectAll("path")
		.data(files)
		.enter()
		.append("path")
		.attr("d", line)
		.attr("fill", "none")
		.attr("stroke-width", "2")
		.attr("stroke", function(d, i) { return colors[i] })

	// make and scale axes
	var xAxis = d3.svg.axis()
				.tickFormat(d3.format("d")) // remove commas
				.scale(xScale);

	var	yAxis = d3.svg.axis()
				.ticks(10)
				.orient("left")
				.scale(yScale);

	// add axes to canvas
	canvas1.append("g")
		.call(xAxis)
		.attr("transform", "translate(0, 325)");
	
	canvas1.append("g")
			.call(yAxis)
			.attr("transform", "translate(" + margin1.left + ", 0)");

	var timeout; 

	// make info box appear on mouse mouve 
	canvas1.on("mousemove", function(){
		mouse = d3.mouse(this);

		// wait a while before drawing infobox
		timeout = setTimeout(function(){
			timeout = 0;
	
			if (mouse[0] > 0 & mouse[0] < (width1 - margin1.right)) {

				// remove previous infobox
				canvas1.select("#info1rect").remove();
				canvas1.select("#info1text").remove();

				var infoX = Math.round(xScale.invert(mouse[0]));

				canvas1.append("rect")
					.attr("width", 75)
					.attr("height", 50)
			    	.attr("fill", "#E0E0E0")
			    	.attr("x", mouse[0] + 15)
			    	.attr("y", mouse[1])
			    	.attr("id", "info1rect")

			    canvas1.append("text")
			    	.text(infoX)
			    	.attr("x", mouse[0] + 30)
			    	.attr("y", mouse[1] + 30)
			    	.attr("id", "info1text")
				}

			}, 1);
		})

 
	// make lines appear or dissapear when clicked on corresponding part in legend 1
	// code taken from http://code.tutsplus.com/tutorials/building-a-multi-line-chart-using-d3js-part-2--cms-22973 
	buttons1.on("click", function(d, i) {
		var active = files.active ? false : true;
		var opacity = active ? 0 : 1;

		canvas1.select("path:nth-child(" + (i + 2) + ")") // first two children of path are the axes
			.style("opacity", opacity) 

		files.active = active
});

	});

// makes date object from string 

var toDate = d3.time.format("%d-%m-%Y").parse;
var jan1 = new Date('December 31, 2012 GMT');
var dec31 = new Date('December 31, 2013 GMT')

d3.csv("Data/years/2013.csv", function(yearData) {

	// abbrevate millions, taken from source 1
	var formatValue = d3.format(".2s");

	// remove Dutch point delimiters
	yearData.forEach(function(d) {
		d.Date = toDate(d.Date)
		d.Viewers = +d.Viewers.split('.').join('')
	})
 	
	// determine scaling 
	var xScale = d3.time.scale()
				.domain([jan1, dec31])	
				.range([margin1.left, width1-margin1.right]); 

	var yScale = d3.scale.linear()
				.domain([0, 10000000])
				.range([-margin1.bottom, -height1+margin1.top]);

	// make axes
	var xAxis = d3.svg.axis()
				.ticks(d3.time.months)
				.tickFormat(d3.time.format("%b"))
				.scale(xScale);

	var yAxis = d3.svg.axis()
				.ticks(10)
				.tickFormat(function(d) {return formatValue (d)})
				.orient("left")
				.scale(yScale);

	// add axes to canvas
	canvas2.append("g")
		.call(xAxis)
		.attr("transform", "translate(0, -" + margin1.bottom + ")");

	canvas2.append("g")
		.call(yAxis)
		.attr("transform", "translate(" + margin1.left + ", 0)");

	canvas2.selectAll("circle")
			.data(yearData)
			.enter()
				.append("circle")
				.attr("r", 5)
				.attr("fill", "none")
				.attr("stroke-width", 2)
				.attr("stroke", "black")
				.attr("cy", function(d) {return yScale(d.Viewers)})
				.attr("cx", function(d) {return xScale(d.Date)});
			});
