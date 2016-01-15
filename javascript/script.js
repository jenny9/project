'use strict'
// size of graph canvas and legends
var margin1 = {top: 25, left: 25, right: 500, bottom: 25};
var width1 = 1500;
var height1 = 350;

var buttonHeight = 30;
var buttonWidth = 80;

var legendMargin = 20;
var legend1Width = margin1.right * 0.25;
var legend1Height = height1 - margin1.bottom - margin1.top - buttonHeight;
var legend2Width = buttonWidth + 20; 
var legend2Height = height1 / 2 - 10;

// size of buttons
var yearButtonHeight = 25;
var yearButtonWidth = 40;

// arrays of data files used
var channels = ['Ned1', 'Ned2', 'Ned3', 'RTL4', 'SBS 6', 'NICK', 'Tien', 'Ver', 'YRN'];
var years = ['2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];

// button options in graph 2 
var buttonOptions = ['Channel', 'Time', 'Day']
var lineOptions = ['Groups', 'All']

// color schemes
// colors generated with colorbrewer.org
var colors = ['#b2df8a','#ff7f00','#fdbf6f','#e31a1c','#1f78b4','#6a3d9a','#33a02c','#fb9a99','#a6cee3'];
var weekdayColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'];
var timeColors = ['#f7fbff', '#08306b'];
var summedColors = ['#377eb8','#4daf4a']

// make svg canvas for channel graph
var canvas1 = d3.select("body")
	.append("svg")
	.attr("width", width1)
	.attr("height", height1)
	.append("g")
	.attr("transform", "translate(40, 0)");

// make background for svg canvas
// neccisary for mouse over function
var background1 = canvas1.append("rect")
	.attr("width", width1 - margin1.right - margin1.left)
	.attr("height", height1 - margin1.bottom - margin1.top)
	.attr("fill", "white")
	.attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// make group for legend1
var legend1 = canvas1.append("g")
	.attr("height", legend1Height)
	.attr("width", legend1Width)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + ", 5)");

// add color blocks to legend1
var legend1Colors = legend1.selectAll("rect")
	.data(channels)
	.enter()
		.append("rect")
			.attr("height", 20)
			.attr("width", 30)
			.attr("x", 75)
			.attr("y", function(d, i) { return legend1Height / 10 * (i + 1) - 15; })
			.attr("fill", function(d, i) { return colors[i]})
			.attr("class", "buttonText");

// add legend1Text to legend1
var legend1Text = legend1.selectAll("text")
	.data(channels)
	.enter()
		.append("text")
			.attr("x", 25)
			.attr("y", function(d, i) { return legend1Height / 10 * (i + 1); })
			.text(function(d) { return d });

// add line buttons to legend1
var lineButtons = legend1.selectAll("rect.line")
	.data(lineOptions)
	.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(" + (i * (legend1Width / 2 + 3)) + "," + (legend1Height + 10) + ")" });


var lineRects = lineButtons.append("rect")
				.attr("width", legend1Width / 2 - 3)
				.attr("height", 40)
				.attr("fill", "white")
				.attr("stroke-width", 3)
				.attr("stroke", "black")
				.attr("class", "buttonText")

// add text to buttons
var textLineButtons = lineButtons.append("text")
	.text(function(d) { return d })
	.attr("x", 3)
	.attr("y", 25)
	.attr("class", "buttonText");

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
	files[0].forEach(function() {
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

	var line2 = d3.svg.line()
		.x(function(summedFiles) {return xScale(summedFiles[0])})
		.y(function(summedFiles) {return yScale(summedFiles[1])})
	
	// draw lines of all data files
	function allLines(){
		 canvas1.selectAll("path.data")
			.data(files)
			.enter()
			.append("path")
			.attr("d", line)
			.attr("class", "dataline")
			.attr("fill", "none")
			.attr("stroke-width", "3")
			.attr("stroke", function(d, i) { return colors[i] })
			.attr("id", function(d, i) { return "line" + i });
		};


	allLines();

	// sum data to display commercial and public
	var pub = []
	var com = []

	files[0].forEach(function(d, i) {
		// sum all public channels
		var temp = +files[0][i].Aantal + +files[1][i].Aantal + +files[2][i].Aantal;
		pub.push([+files[0][i].Jaar, temp]);

		temp = +files[3][i].Aantal + +files[4][i].Aantal + 
		+files[5][i].Aantal + +files[6][i].Aantal + 
		+files[7][i].Aantal + +files[8][i].Aantal;

		com.push([+files[0][i].Jaar, temp]);

	});

	var summedFiles = [pub, com];
	console.log(summedFiles)

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
	var mouse; 
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
					.attr("stroke", "#555555")
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
			    	.attr("id", "info1text")
			    	.attr("class", "buttonText");
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

		d3.select("#line" + i)
			.style("opacity", opacity);

		// remember line is not displayed
		displayedChannels[i] = displayedChannels[i] * -1;
		});

	lineButtons.on("click", function(d, j) {
		if (j == 0){
			d3.selectAll(".dataline").remove();
			d3.select("#info1text").remove();

		 	canvas1.selectAll("path.data")
				.data(summedFiles)
				.enter()
				.append("path")
					.attr("d", line2)
					.attr("class", "dataline2")
					.attr("fill", "none")
					.attr("stroke-width", "3")
					.attr("stroke", function(d, i) { return summedColors[i] })
					.attr("id", function(d, i) { return "line" + i })
			}
		else if (j == 1){

			d3.selectAll(".dataline2").remove();
			allLines();

			}
		})
	});

// make svg canvas for year graph
var canvas2 = d3.select("body")
	.append("svg")
		.attr("width", width1)
		.attr("height", height1)
			.append("g")
				.attr("transform", "translate(40," + height1 + ")");

// make group for legend2box
var legend2box = canvas2.append("g")
	.attr("height", height1)
	.attr("width", legend2Width)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + "," + (-height1 + 3) + ")");

// make group element for all buttons of legend2box
var buttonGroup = legend2box.selectAll("g")
	.data(buttonOptions)
	.enter()
		.append("g")
			.attr("transform", function(d, i) {return "translate (10," + (i * 40 + 10) + ")"});

// make buttons on legend2box
var buttons2 = buttonGroup.append("rect")
	.attr("height", buttonHeight)
	.attr("width", buttonWidth)
	.attr("fill", "#E1E1E1")
	.attr("stroke-width", 2)
	.attr("stroke", "black")
	.attr("class", "buttonText")

var textLegend2 = buttonGroup.append("text")
	.text(function(d) { return d })
	.attr("x", buttonWidth * 0.1)
	.attr("y", buttonHeight * 0.5 + 6)
	.attr("class", "buttonText");

// make border around buttons on legend2box
var border2a = legend2box.append("rect")
	.attr("height", legend2Height - 35)
	.attr("width", legend2Width)
	.attr("fill", "none")
	.attr("stroke-width", 3)
	.attr("stroke", "black"); 

// make border around legend info on legend2box
var border2b = legend2box.append("rect")
	.attr("height", legend2Height + 30)
	.attr("width", legend2Width)
	.attr("fill", "none")
	.attr("stroke-width", 3)
	.attr("stroke", "black")
	.attr("y", legend2Height - 30)

// make group for year buttons
var chooseYear = canvas2.append("g")
	.attr("height", 100)
	.attr("width", 100)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin + legend2Width) + "," + (-height1 + 2) + ")");

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
	.attr("class", "buttonText")
	.attr("id", function(d, i) {return "yearButton" + i})

var textYearButtons = yearButtonGroup.append("text")
	.text(function(d) {return d})
	.attr("x", 2)
	.attr("y", buttonHeight * 0.6)
	.attr("class", "buttonText");


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

	function domain(i) {
		var jan1 = new Date("December 31," + (i + 2001) + " GMT");
		var dec31 = new Date("December 31," + (i + 2002) + " GMT");
		return [jan1, dec31];
		};
		
	// abbrevate millions, taken from source 1
	var formatValue = d3.format(".2s");
	 	
	// determine scaling 
	var xScale = d3.time.scale()
		.domain(domain(0))	
		.range([margin1.left, width1-margin1.right]); 

	var yScale = d3.scale.linear()
		.domain([0, 9000000])
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
	var formatDay = d3.time.format("%A")

	// make informaton box to show on mouse over	
	var tip = d3.tip()
		.html(function(d){ 
			return "<div class='tooltip'>" + d.Title + "<br>" + formatDay(d.Date) + " " 
			+ formatDate(d.Date) + "<br>" + d.Time + "<br>" + d.Channel + "<br>" + 
			d.Viewers + " viewers</div>" }); 

	canvas2.call(tip);

	// make array to remember which year data is already loaded
	var active = new Uint8Array(years.length);

	var circles; 

	yearButtonGroup.on("click", function(d, i) {
		// remove previous displayed graph
		canvas2.selectAll("circle").remove();
		
		// remove displayed legend 
		d3.selectAll(".legend2").remove();

		// color current button 
		yearButtons.style("fill", "#E1E1E1")
		d3.select("#yearButton" + i).style("fill", "#33a02c");

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
			
		// draw x axis for this year
		var xScale = d3.time.scale()
				.domain(domain(i))	
				.range([margin1.left, width1-margin1.right]); 

		circles = canvas2.selectAll("circle")
			.data(files[i])
			.enter()
				.append("circle")
					.attr("r", 6)
					.attr("fill", "#e1e1e1")
					.attr("stroke-width", 1)
					.attr("stroke", "#000000")
					.attr("cy", function(d) {return yScale(d.Viewers)})
					.attr("cx", function(d) {return xScale(d.Date)})
					.on("mouseover", tip.show)
					.on("mouseout", tip.hide)
					.attr("class", "circle");

		buttonGroup.on("click", function(d, j) {
			// if button 'Channel' is clicked
			if (j == 0) {

				d3.selectAll(".legend2").remove();

				circles.attr("fill", function(d) { 
					var color = channels.indexOf(d.Channel)
					return colors[color];
					});

				var legend2 = legend2box.selectAll("rect.info")
					.data(channels)
					.enter()
						.append("rect")
						.attr("width", 10)
						.attr("height", 10)
						.attr("x", 10)
						.attr("y", function(d, k) { return k * 20 + legend2Height - 20})
						.attr("fill", function(d, k) { return colors[k]})
						.attr("class", "legend2");

				var legend2Text = legend2box.selectAll("text.info")
					.data(channels)
					.enter()
						.append("text")
						.attr("x", 25)
						.attr("y", function(d, k) {return k * 20 + legend2Height - 10})
						.text(function(d) {return d})
						.attr("class", "buttonText")
						.attr("class", "legend2")

				}
			// if button 'Time' is clicked
			else if (j == 1) {

				// remove previous legend
				d3.selectAll(".legend2").remove();

				var colorScale = d3.scale.linear()
					.domain([1200, 2359])
					.range(timeColors)

				circles.attr("fill", function(d) {
					d.Time = +d.Time
					return colorScale(d.Time)
					});

				var legendTimes = [1200, 1400, 1600, 1800, 2000, 2200, 2300] 
			
				var legend2 = legend2box.selectAll("rect.info")	
					.data(legendTimes)
					.enter()
					.append("rect")
					.attr("width", 10)
					.attr("height", 10)
					.attr("x", 5)
					.attr("y", function(d, k) {return k * 25 + legend2Height - 15})
					.attr("fill", function(d) {return colorScale(d)})	
					.attr("stroke-width", 1)
					.attr("stroke", "black")
					.attr("class", "legend2")

				var legend2Text = legend2box.selectAll("text.info")
					.data(legendTimes)
					.enter()
					.append("text")
					.attr("x", 20)
					.attr("y", function(d, k) {return k * 25 + legend2Height - 5})
					.text(function(d, i) {
						if (i == 0){ return "<" + d / 100 + "h"}
						else {return d / 100 + "h"}
						})
					.attr("class", "buttonText")
					.attr("class", "legend2")
				}
			// if button 'Day' is clicked
			else if (j == 2) {

				// remove previous legend
				d3.selectAll(".legend2").remove();

				var selectDay = d3.time.format("%w");

				circles.attr("fill", function(d) {
					var color = selectDay(d.Date)
					color = +color;
					return weekdayColors[color];
					});


				var legend2 = legend2box.selectAll("rect.info")
					.data(weekdayColors)
					.enter()
						.append("rect")
						.attr("width", 10)
						.attr("height", 10)
						.attr("x", 5)
						.attr("y", function(d, k) { return k * 25 + legend2Height - 15})
						.attr("fill", function(d, k) { return weekdayColors[k]})
						.attr("class", "legend2");

				var weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

				var legend2Text = legend2box.selectAll("text.info")
					.data(weekdayColors)
					.enter()
						.append("text")
						.attr("x", 20)
						.attr("y", function(d, k) {return k * 25 + legend2Height - 5})
						.text(function(d, k) {return weekDays[k]})
						.style("font-size", "14px")
						.attr("class", "buttonText")
						.attr("class", "legend2")

				}
			});

		});
	});