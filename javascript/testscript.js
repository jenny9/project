var width = 100,
    height = 100;

var randomX = d3.random.normal(width / 2, 80),
    randomY = d3.random.normal(height / 2, 80);

var data = d3.range(2000).map(function() {
  return [
    randomX(),
    randomY()
  ];
});

var x = d3.scale.linear()
    .domain([0, width])
    .range([0, width]);
var y = d3.scale.linear()
    .domain([0, height])
    .range([height, 0]);

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
	.attr("transform", "translate(40, 0)")
	.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 40]).on("zoom", zoom));

var svg2 = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height)
//var group = svg.append("g")


var circle = svg.selectAll("circle")
    .data(data)
  .enter().append("circle")
    .attr("r", 2.5)
    .attr("transform", transform);


function zoom() {
	console.log("zoom")
  circle.attr("transform", transform);
}
function transform(d) {
  return "translate(" + x(d[0]) + "," + y(d[1]) + ")";
}
