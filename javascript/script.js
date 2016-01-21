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

// button options in graph 1
var optionText = ['Public', 'Commercial']
var lineOptions = ['Groups', 'All']

 
// button options in graph 2 
var buttonOptions = ['Channel', 'Time', 'Day']

// color schemes (colors generated with colorbrewer.org)
var colors = ['#b2df8a','#ff7f00','#fdbf6f','#e31a1c','#1f78b4','#6a3d9a','#33a02c','#fb9a99','#a6cee3'];
var weekdayColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628'];
var timeColors = ['#fff7fb', '#023858'];
var summedColors = ['#377eb8','#4daf4a']


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
	.attr("fill", "white")
	.attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");

// make group for legend1
var legend1 = canvas1.append("g")
	.attr("height", legend1Height)
	.attr("width", legend1Width)
	.attr("transform", "translate(" + (width1 - margin1.right + legendMargin) + ", 5)");

var colorButtonGroup = legend1.append("g")

var legend1Colors;
var legend1Text;
var lineRects;
var textLineButtons;

// add line buttons to legend1
var lineButtons = legend1.selectAll("rect.line")
		.data(lineOptions)
		.enter()
			.append("g")
			.attr("transform", function(d, i) { return "translate(" + (i * (legend1Width / 2 + 3)) + "," + (legend1Height + 10) + ")" }) 
			.attr("class", "buttonText");

// make array to remember which lines are drawn 
var displayedChannels;


var opacity; 

// toggle opacity of lines in legend 1 on click
function colorClick(d, i) {
		if (displayedChannels[i] == 1) {
			opacity = 0;
		}

		else {
			opacity = 1;
		}

		d3.select("#line" + i)
			.style("opacity", opacity);

		// remember if line is displayed
		displayedChannels[i] = displayedChannels[i] * -1;
		};

// add border to buttons on legend 1
lineRects = lineButtons.append("rect")
	.attr("width", legend1Width / 2 - 3)
	.attr("height", buttonHeight)
	.attr("fill", "#e1e1e1")
	.attr("stroke-width", 3)
	.attr("stroke", "black")


// add text to buttons
textLineButtons = lineButtons.append("text")
	.text(function(d) { return d })
	.attr("x", 3)
	.attr("y", 20)
	
// make border around legend1
var border1 = legend1.append("rect")
	.attr("height", legend1Height)
	.attr("width", legend1Width)
	.attr("fill", "none")
	.attr("stroke-width", 3)
	.attr("stroke", "black");

// makes legend according to data displayed
function makeLegendA(data, colorArray) {
	// add, remove or update color blocks on legend1 
	legend1Colors = colorButtonGroup.selectAll("rect")
		.data(data);

	legend1Colors.exit().remove();

	legend1Colors.enter()
		.append("rect")
			.attr("height", 20)
			.attr("width", 30)
			.attr("x", 90)
			.attr("y", function(d, i) { return legend1Height / 10 * (i + 1) - 15; })
	
	legend1Colors.attr("fill", function(d, i) { return colorArray[i]})
			.attr("class", "buttonText")
			.on("click", colorClick)

	// add, remove or update legend1Text to legend1
	legend1Text = colorButtonGroup.selectAll("text")
		.data(data);

	legend1Text.exit().remove();

	legend1Text.enter()
		.append("text")
			.attr("x", 5)
			.attr("y", function(d, i) { return legend1Height / 10 * (i + 1); })

	legend1Text.text(function(d) { return d });
	};

makeLegendA(channels, colors); 
	
var circles; 

function domain(i) {
	var jan1 = new Date("December 31," + (i + 2001) + " GMT");
	var dec31 = new Date("December 31," + (i + 2002) + " GMT");
	return [jan1, dec31];
	};

var x = d3.scale.linear()
   	.domain([margin1.left, width1 - margin1.right])
   	.range([margin1.left, width1 - margin1.right]);

var y = d3.scale.linear()
   	.domain([height1, 2 * height1])
   	.range([height1, 2 * height1]);

// draw x axis for this year
var xScale2 = d3.time.scale()
	.domain(domain(0))	
	.range([margin1.left, width1-margin1.right]); 

var yScale2 = d3.scale.linear()
	.domain([0, 9000000])
	.range([-margin1.bottom, -height1+margin1.top]);


// make svg canvas for year graph
var canvas2 = d3.select("body")
	.append("svg")
		.attr("width", width1)
		.call(d3.behavior.zoom().x(xScale2).y(yScale2).scaleExtent([1, 40]).on("zoom", zoom))
		.attr("height", height1)
			.append("g")
				.attr("transform", "translate(40," + height1 + ")");

	function zoom() {
 		 circles.attr("transform", transform);
		}

	function transform(d, i) {
  		return "translate(" + xScale2(d.Date) + "," + yScale2(d.Viewers) + ")";
		}

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
	.attr("class", "buttonText")

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
	.attr("id", function(d, i) { return "yearButton" + i})

var textYearButtons = yearButtonGroup.append("text")
	.text(function(d) {return d})
	.attr("x", 2)
	.attr("y", buttonHeight * 0.6)
	.attr("class", "buttonText");

// make var to store if button is pressed
var buttonPressed = -1; 

// load in all data
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
	.defer(d3.csv, "Data/years/2013.csv")

	.defer(d3.csv, "Data/channels/Ned1.csv")
	.defer(d3.csv, "Data/channels/Ned2.csv")
	.defer(d3.csv, "Data/channels/Ned3.csv")
	.defer(d3.csv, "Data/channels/RTL4.csv")
	.defer(d3.csv, "Data/channels/SBS 6.csv")
	.defer(d3.csv, "Data/channels/NICK.csv")
	.defer(d3.csv, "Data/channels/Tien.csv")
	.defer(d3.csv, "Data/channels/Ver.csv")
	.defer(d3.csv, "Data/channels/YRN.csv")

q1.awaitAll(function(error, files) {

	// separate year files from channel files
	var start = years.length 
	var channelFiles = []
	var yearFiles = []

	channels.forEach(function(d, i) {
		channelFiles.push(files[i + start])
		})
	
	years.forEach(function(d, i){
		yearFiles.push(files[i])
	})
	
	// convert string to int 
	channelFiles.forEach(function(d, i) {
		channelFiles[0].forEach(function(d, j){
			channelFiles[i][j].Jaar = +channelFiles[i][j].Jaar;
			channelFiles[i][j].Aantal = +channelFiles[i][j].Aantal;
			})
		});

	// determine scaling
	var xScale = d3.scale.linear()
		.domain(d3.extent(channelFiles[0], function(channelFiles) { return channelFiles.Jaar; }))	
		.range([margin1.left, width1-margin1.right]); 

	var yScale = d3.scale.linear()
		.domain([0, 50])
		.range([height1-margin1.top, margin1.bottom]);

	var line = d3.svg.line()
		.x(function(data) {return xScale(data.Jaar);})
		.y(function(data) {return yScale(data.Aantal);});

	var line2 = d3.svg.line()
		.x(function(data) {return xScale(data[0])})
		.y(function(data) {return yScale(data[1])})
	
	// draw lines of all data files
	function allLines(files, line, colors){
		var lines = canvas1.selectAll("path.dataline")
			.data(files)


		lines.exit().remove();

		lines.enter()
			.append("path")
			.attr("class", "dataline")
			.attr("fill", "none")
			.attr("stroke-width", "3")


		lines
			.attr("d", line)
			.attr("stroke", function(d, i) { return colors[i] })
			.attr("id", function(d, i) { return "line" + i })
			.style("opacity", 1);

			// set all lines to visible
			displayedChannels = [1, 1, 1, 1, 1, 1, 1, 1, 1];
		};

	allLines(channelFiles, line, colors);

	// sum data to display commercial and public
	var pub = []
	var com = []

	channelFiles[0].forEach(function(d, i) {
		// sum all public channels
		var temp = +channelFiles[0][i].Aantal + +channelFiles[1][i].Aantal + +channelFiles[2][i].Aantal;
		pub.push([+channelFiles[0][i].Jaar, temp]);

		temp = +channelFiles[3][i].Aantal + +channelFiles[4][i].Aantal + 
		+channelFiles[5][i].Aantal + +channelFiles[6][i].Aantal + 
		+channelFiles[7][i].Aantal + +channelFiles[8][i].Aantal;

		com.push([+channelFiles[0][i].Jaar, temp]);

	});

	var summedFiles = [pub, com];

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
		.attr("transform", "translate(0, 325)")
	
	canvas1.append("g")
		.call(yAxis)
		.attr("transform", "translate(" + margin1.left + ", 0)");

	var timeout; 
	var mouse; 
	var options = 1; 
	var currentYear;


	// make info box appear on mouse mouve 
	canvas1.on("mousemove", function(){
		mouse = d3.mouse(this);
	
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

			// if individual channels are displayed
			if (options == 1) {	
				for (var i = 0; i < channels.length; i++) {
					if (displayedChannels[i] == 1){
						infoText.push(channels[i] + " " + "<b>" + channelFiles[i][j].Aantal + "</b>");
						};
					};
				}
			// if group channels are displayed
			else {
				for (var i = 0; i < optionText.length; i++) {
					if (displayedChannels[i] == 1){
						infoText.push(optionText[i] + " " + "<b>" + summedFiles[i][j][1] + "</b>")
						}
					}
				}

			var info = d3.select("body").append("div")
			   	.html(infoText.join("<br>"))
			   	.style("position", "absolute")
			   	.style("left", xScale(year) + 100 + "px")
			   	.style("top", (height1 / 3) + "px")
			   	.style("opacity", 0.8)
			   	.attr("id", "info1text")
			   	.attr("class", "buttonText");

		    // display year in graph 2 
		    // only do this when year of mouse coordinate changes
		    if (j != currentYear){
		    	currentYear = j;
		   		displayYear(yearFiles, j);
		   		}
			}
		});

	var currentLineButton = d3.select(this).select("rect");

	lineButtons.on("click", function(d, i) {
		// remove infobox
		d3.selectAll("#info1text").remove();

		// decolor previous button
		currentLineButton.style("fill", "#E1E1E1")

		// color current button 
		currentLineButton = d3.select(this).select("rect")
		currentLineButton.style("fill", "#33a02c")
		
		if (i == 0){
			allLines(summedFiles, line2, summedColors);
			makeLegendA(optionText, summedColors);
			options = 0;
			}
		
		else if (i == 1){
			allLines(channelFiles, line, colors);
			makeLegendA(channels, colors);
			options = 1;
			}
		})
	
	var parseDate = d3.time.format("%d-%m-%Y").parse;
		
	// abbrevate millions, taken from source 1
	var formatValue = d3.format(".2s");
	 	
	// determine scaling 
	var xScale2 = d3.time.scale()
		.domain(domain(0))	
		.range([margin1.left, width1-margin1.right]); 

	var yScale2 = d3.scale.linear()
		.domain([0, 9000000])
		.range([-margin1.bottom, -height1+margin1.top]);


	canvas2.append("rect")
		.attr("width", width1)
		.attr("height", height1)
		
	// make axes
	var xAxis2 = d3.svg.axis()
		.ticks(d3.time.months)
		.tickFormat(d3.time.format("%b"))
		.scale(xScale2);

	var yAxis2 = d3.svg.axis()
		.ticks(10)
		.tickFormat(function(d) {return formatValue (d)})
		.orient("left")
		.scale(yScale2);

	// add axes to canvas
	canvas2.append("g")
		.call(xAxis2)
		.attr("transform", "translate(0, -" + margin1.bottom + ")");
		canvas2.append("g")
		.call(yAxis2)
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

	var currentButton;

	yearButtonGroup.on("click", displayYear)

	// prepare to make time scale for time coloring
	var parseTime = d3.time.format.utc("%Y-%m-%d-%H%M").parse
	var parseHour = d3.time.format.utc("%H:%M")
	var minTime = parseTime("2002-01-01-1200")
	var maxTime = parseTime("2002-01-01-2359")

	function displayYear(d, i) {
		// decolor buttons
		yearButtons.style("fill", "#E1E1E1")

		// color current button 
		d3.select("#yearButton" + i).style("fill", "#33a02c");


		// check if data is already converted
		if (active[i] == 0) {
			// remove Dutch point delimiters
			// make int from string
			yearFiles[i].forEach(function(files) {
				files.Date = parseDate(files.Date)
				files.Viewers = +files.Viewers.split('.').join('')
				});

			// remember data is converted
			active[i] = 1;
		}
			

		// xScale2
		circles = canvas2.selectAll("circle")
			.data(yearFiles[i])
		
		circles.enter()
			.append("circle")
				.attr("r", 7)
				.attr("fill", "#e1e1e1")
				.attr("stroke-width", 1)
				.attr("stroke", "#000000")
				.on("mouseover", tip.show)
				.on("mouseout", tip.hide)
				.attr("class", "circle")
				.attr("cx", 500) 	// starting position given to enable transition  when clicked first time
				.attr("cy", -200)
    			.attr("transform", transform);

		circles		
			.transition().duration(500)
			.attr("cy", function(d) {return yScale2(d.Viewers)})
			.attr("cx", function(d) {return xScale2(d.Date)});

		if (buttonPressed != -1) {
			colorCircles(d, buttonPressed)
		}

		currentButton = d3.select(this) 

		buttonGroup.on("click", function(d, i) {
			// decolor previous button
			buttons2.style("fill", "#E1E1E1");
			// color current button 
			currentButton = d3.select(this).select("rect");
			currentButton.style("fill", "#33a02c");
			colorCircles(d, i);
		});

		function colorCircles (d, i) {
			
			// if button 'Channel' is clicked
			if (i == 0) {

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

				buttonPressed = 0;
				}

			// if button 'Time' is clicked
			else if (i == 1) {

				// remove previous legend
				d3.selectAll(".legend2").remove();

				var colorScale = d3.time.scale()
					.domain([minTime, maxTime])
					.range(timeColors)

				circles.attr("fill", function(d) {
					return colorScale(parseTime("2002-01-01-" +d.Time))
					});

				var legendTimes = ["1200", "1400", "1600", "1800", "2000", "2200", "2300"] 
				
				legendTimes.forEach(function(d, i) {
					legendTimes[i] = parseTime("2002-01-01-" + legendTimes[i])
					})

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
								if (i == 0) {
									return "<" + parseHour(d) 
									}

								else {
									return parseHour(d)
									}
								})
							.attr("class", "buttonText")
							.attr("class", "legend2")

				buttonPressed = 1;
				}
			// if button 'Day' is clicked
			else if (i == 2) {

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

				buttonPressed = 2;

				}
			};

		};
	});

