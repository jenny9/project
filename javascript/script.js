var margin = {top: 50, left: 50, right: 50, bottom: 50};
var width = 1000;
var height = 400;

// makes date object from string
var toDate = d3.time.format("%d"-"%m"-"%Y")

// make svg for timeline 
var svgTimeline = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

// load in timeline dataset
d3.csv("years.csv", function(d) { 
	return {
		year: new Date (+d.Jaar, 0, 1),
		Ned1: +d.Ned1,
		Ned2: +d.Ned2,
		Ned3: +d.Ned3,
		RTL4: +d.RTL4,
		RTL5: +d.RTL5,
		SBS6: +d.SBS6,
		Tien: +d.Tien,
		YRN: +d.YRN,
		NICK: +d.NICK,
		Ver: +d.Ver	
		};
	});