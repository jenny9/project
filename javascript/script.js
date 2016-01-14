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

var yearButtonHeight = 25;
var yearButtonWidth = 80;

var channels = ['Ned1', 'Ned2', 'Ned3', 'RTL4', 'SBS 6', 'NICK', 'Tien', 'Ver', 'YRN'];
var years = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];
var buttonOptions = ['Channel', 'Time', 'Day']
var colors = ['red', 'blue', 'green', 'brown', 'purple', 'lime', 'black', 'magenta', 'gold'];

var mouse = [0,0]

// make svg canvas for channel graph
var canvas1 = d3.select("body")
	.append("svg")
	.attr("width", width1)
	.attr("height", height1)
	.append("g")
	.attr("transform", "translate(40, 0)");

// make background for svg canvas
var background1 = canvas1.append("rect")
	.attr("width", width1 - margin1.right - margin1.left)
	.attr("height", height1 - margin1.bottom - margin1.top)
	.attr("fill", "#E1E1E1")
	.attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// make group for legend1
var legend1 = canvas1.append("g")
	.attr("height", legend1Height)
	.attr("width", legend1Width)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + "," + margin1.top + ")");

// add color blocks to legend1
var legend1Colors = legend1.selectAll("rect")
	.data(channels)
	.enter()
		.append("rect")
			.attr("height", 20)
			.attr("width", 30)
			.attr("x", 75)
			.attr("y", function(d, i) { return legend1Height / 10 * (i + 1) - 15; })
			.attr("fill", function(d, i) { return colors[i]});

// add legend1Text to legend1
var legend1Text = legend1.selectAll("text")
	.data(channels)
	.enter()
		.append("text")
			.attr("x", 25)
			.attr("y", function(d, i) { return legend1Height / 10 * (i + 1); })
			.text(function(d) { return d });

// make border around legend1
var border1 = legend1.append("rect")
	.attr("height", legend1Height)
	.attr("width", legend1Width)
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
	files[0].forEach(function(files) {
		files.Jaar = +files.Jaar;
		files.Aantal = +files.Aantal;
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
		.attr("stroke", function(d, i) { return colors[i] });

	// make array to remember which lines are drawn 
	var displayedChannels = [1, 1, 1, 1, 1, 1, 1, 1, 1];

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
			timeout = clearTimeout;
	
			if (mouse[0] > margin1.left & mouse[0] < (width1 - margin1.right)) {
				// remove previous infobox
				d3.select("#info1text").remove();
				d3.select("#info1line").remove();

				var year = Math.round(xScale.invert(mouse[0]));
				var j = year - 2002;

				// draw vertical line
				var verticalLine = canvas1.append("line")
					.attr("x1", xScale(year))
					.attr("y1", margin1.top)
					.attr("x2", xScale(year))
					.attr("y2", height1 - margin1.bottom)
					.attr("stroke-width", 2)
					.attr("stroke", "white")
					.attr("id", "info1line");

				var infoText = ["<u>" + year + "</u>"]
				
				// add info of displayed channels to infobox
				for (var i = 0; i < channels.length; i++) {

					if (displayedChannels[i] == 1){
						infoText.push(channels[i] + " " + "<b>" + files[i][j].Aantal + "</b>");
					};
				};

			    var info = d3.select("body").append("div")
			    	.html(infoText.join("<br>"))
			    	.style("position", "absolute")
			    	.style("left", xScale(year) + 100 + "px")
			    	.style("top", (height1 / 3) + "px")
			    	.style("opacity", 0.8)
			    	.attr("id", "info1text");
				}

			}, 50);
		});

 
	// toggle opacity of lines in legend 1 on click
	var opacity; 

	legend1Colors.on("click", function(d, i) {
		if (displayedChannels[i] == 1) {
			opacity = 0;
		}

		else {
			opacity = 1;
		}

		canvas1.select("path:nth-child(" + (i + 3) + ")") // first two children of path are the axes, third is the background
			.style("opacity", opacity);

		// remember line is not displayed
		displayedChannels[i] = displayedChannels[i] * -1;


		});

	});

// make svg canvas for year graph
var canvas2 = d3.select("body")
	.append("svg")
		.attr("width", width1)
		.attr("height", height1)
			.append("g")
				.attr("transform", "translate(40," + height1 + ")");


// make group for legend2
var legend2 = canvas2.append("g")
	.attr("height", legend2Height)
	.attr("width", legend2Width)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + "," + (-height1 + margin1.top) + ")");

// make group for year buttons
var chooseYear = canvas2.append("g")
	.attr("height", 100)
	.attr("width", 100)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin + legend2Width) + "," + -height1 + ")");

// make group element for all buttons of legend 2
var buttonGroup = legend2.selectAll("g")
	.data(buttonOptions)
	.enter()
		.append("g")
			.attr("transform", function(d, i) {return "translate (20," + (i * 55 + 10) + ")"});

// make buttons on legend 2
var buttons2 = buttonGroup.append("rect")
	.attr("height", buttonHeight)
	.attr("width", buttonWidth)
	.attr("fill", "none")
	.attr("stroke-width", 2)
	.attr("stroke", "black")

var textLegend2 = buttonGroup.append("text")
	.text(function(d) { return d })
	.attr("x", buttonWidth * 0.1)
	.attr("y", buttonHeight * 0.5);

// make border around legend 2
var border2 = legend2.append("rect")
	.attr("height", legend2Height)
	.attr("width", legend2Width)
	.attr("fill", "none")
	.attr("stroke-width", 3)
	.attr("stroke", "black"); 

// make group for all year buttons 
var yearButtonGroup = chooseYear.selectAll("g")
	.data(years)
	.enter()
		.append("g")
			.attr("transform", function(d, i) {return "translate (20," + (i * 28) + ")"});

var yearButtons = yearButtonGroup.append("rect")
	.attr("height", yearButtonHeight)
	.attr("width", yearButtonWidth)
	.attr("fill", "#E1E1E1")
	.attr("stroke-width", 2)
	.attr("stroke", "black")

var textYearButtons = yearButtonGroup.append("text")
	.text(function(d) {return d})
	.attr("x", 2)
	.attr("y", buttonHeight * 0.5);


// load in all year data
var q1 = queue()
	.defer(d3.csv, "Data/years/2002.csv")
	.defer(d3.csv, "Data/years/2003.csv")
	.defer(d3.csv, "Data/years/2004.csv")
	.defer(d3.csv, "Data/years/2005.csv")
	.defer(d3.csv, "Data/years/2006.csv")
	.defer(d3.csv, "Data/years/2007.csv")
	.defer(d3.csv, "Data/years/2008.csv")
	.defer(d3.csv, "Data/years/2009.csv")
	.defer(d3.csv, "Data/years/2010.csv")
	.defer(d3.csv, "Data/years/2011.csv")
	.defer(d3.csv, "Data/years/2012.csv")
	.defer(d3.csv, "Data/years/2013.csv");

q1.awaitAll(function(error, files) {
	
	var parseDate = d3.time.format("%d-%m-%Y").parse;
	var jan1 = new Date("December 31, 2001 GMT");
	var dec31 = new Date("December 31, 2002 GMT");
		
		// abbrevate millions, taken from source 1
		var formatValue = d3.format(".2s");
	 	
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

		// prepare to alter date object
		var formatDate = d3.time.format("%d-%m");

		// make informaton box to show on mouse over	
		var tip = d3.tip()
			.html(function(d){ 
				return "<div class='tooltip'>" + d.Title + "<br>" + formatDate(d.Date) + 
				"<br>" + d.Time + "<br>" + d.Channel + "<br>" + 
				d.Viewers + " viewers</div>" }); 

		canvas2.call(tip);

		// make array to remember which year data is already loaded
		var active = new Uint8Array(years.length);

	yearButtons.on("click", function(d, i) {
		// remove previous displayed graph
		canvas2.selectAll("circle").remove();
		
		// color current button 
		yearButtons.style("fill", "#E1E1E1")
		d3.select(this).style("fill", "gold");

		// check if data is already converted
		if (active[i] == 0) {
			// remove Dutch point delimiters
			// make int from string
			files[i].forEach(function(files) {
				files.Date = parseDate(files.Date)
				files.Viewers = +files.Viewers.split('.').join('')
				});

			// remember data is converted
			active[i] = 1;
		}

		var jan1 = new Date("December 31," + (i + 2001) + " GMT");
		var dec31 = new Date("December 31," + (i + 2002) + " GMT");
		
		// draw x axis for this year
		var xScale = d3.time.scale()
				.domain([jan1, dec31])	
				.range([margin1.left, width1-margin1.right]); 

		canvas2.selectAll("circle")
		.data(files[i])
		.enter()
			.append("circle")
				.attr("r", 5)
				.attr("fill", "#E1E1E1")
				.attr("stroke-width", 2)
				.attr("stroke", "black")
				.attr("cy", function(d) {return yScale(d.Viewers)})
				.attr("cx", function(d) {return xScale(d.Date)})
				.on("mouseover", tip.show)
				.on("mouseout", tip.hide);
		});
	});