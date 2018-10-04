
var svg = d3.select("svg");
var svg2 = d3.select("#svg2");

var padding = {top:150, right:50, left:100, bottom:70};
var charArea = {
    "width": parseInt(svg.style("width"))-padding.left-padding.right,
    "height": parseInt(svg.style("height"))-padding.top-padding.bottom-50
};


var colors = d3.schemeCategory10;
var colors2 = ["#4E3530", "#CC2919", "#BD661F", "#BEB66C"];
// get the data
d3.csv("coffee_data.csv", function(error, data) {
    if (error) throw error;

    var dataSet = [
        {region:'Central', sales: 0},
        {region:'East', sales: 0},
        {region:'South', sales: 0},
        {region:'West', sales: 0}
    ]
    var dataSet2 = [
        {category:'Coffee', sales: 0},
        {category:'Tea', sales: 0},
        {category:'Espresso', sales: 0},
        {category:'Herbal Tea', sales: 0}
    ]
    data.forEach(function(d) {
        if (d.region == "Central") {
            dataSet[0] = {region:'Central', sales: dataSet[0].sales + parseInt(d.sales)};
        } else if (d.region == "East") {
            dataSet[1] = {region:'East', sales: dataSet[1].sales + parseInt(d.sales)};
        } else if (d.region == "South") {
            dataSet[2] = {region:'South', sales: dataSet[2].sales + parseInt(d.sales)};
        } else if (d.region == "West") {
            dataSet[3] = {region:'West', sales: dataSet[3].sales + parseInt(d.sales)};
        }
        if (d.category == "Coffee") {
            dataSet2[0] = {category:'Coffee', sales: dataSet2[0].sales + parseInt(d.sales)};
        } else if (d.category == "Tea") {
            dataSet2[1] = {category:'Tea', sales: dataSet2[1].sales + parseInt(d.sales)};
        } else if (d.category == "Espresso") {
            dataSet2[2] = {category:'Espresso', sales: dataSet2[2].sales + parseInt(d.sales)};
        } else if (d.category == "Herbal Tea") {
            dataSet2[3] = {category:'Herbal Tea', sales: dataSet2[3].sales + parseInt(d.sales)};
        }

    });
    var maximum = Math.max(d3.max(dataSet, function(d,i) { return d.sales}), d3.max(dataSet2, function(d,i) { return d.sales}));
    var yScale = d3.scaleLinear()
        .domain([0, maximum])
        .range([charArea.height, 0]).nice();
    var xScale = d3.scaleBand().domain(dataSet.map(function(d) {return d.region})).range([0, charArea.width]).padding(.2);
    
    var y2Scale = d3.scaleLinear()
        .domain([0, maximum])
        .range([charArea.height, 0]).nice();
    var x2Scale = d3.scaleBand().domain(dataSet2.map(function(d) {return d.category})).range([0, charArea.width]).padding(.2);
    
    //Title
    var label = svg.append("text")             
        .attr("transform",
              "translate(" + (charArea.width/2 + 60) + " ," + 
                             (100) + ")")
        .style("text-anchor", "middle")
        .text("Coffee Sales by Region (USD)");

    var label2 = svg2.append("text")             
        .attr("transform",
              "translate(" + (charArea.width/2 + 60) + " ," + 
                             (100) + ")")
        .style("text-anchor", "middle")
        .text("aaCoffee Sales by Product (USD)");

    var xAxis=svg.append("g")
        .classed("xAxis", true)
        .attr('transform', 'translate('+padding.left+','+(charArea.height + padding.top)+')'
        )
        .call(d3.axisBottom(xScale));

    var xlabel = svg.append("text")             
        .attr("transform",
              "translate(" + (charArea.width/2 + 80) + " ," + 
                             (charArea.height + padding.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Region");

    var x2Axis=svg2.append("g")
        .classed("x2Axis", true)
        .attr('transform', 'translate('+padding.left+','+(charArea.height + padding.top)+')'
        )
        .call(d3.axisBottom(x2Scale));

    var x2label = svg2.append("text")             
        .attr("transform",
              "translate(" + (charArea.width/2 + 80) + " ," + 
                             (charArea.height + padding.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Product");

    //var formatAxis = d3.format(".0k");
    var yAxisFn=d3.axisLeft(yScale);
    var yAxis=svg.append("g")
        .classed("yAxis", true)
        .attr('transform', 'translate('+padding.left+','+padding.top+')')
        ;
    yAxisFn(yAxis);


    var y2AxisFn=d3.axisLeft(y2Scale);
    var y2Axis=svg2.append("g")
        .classed("y2Axis", true)
        .attr('transform', 'translate('+padding.left+','+padding.top+')');
    y2AxisFn(y2Axis);

// text label for the y axis
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - padding.left + 120)
        .attr("x",0 - (charArea.height / 2) - 150)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Coffee Sales (USD)"); 
    // text label for the y2 axis
    svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - padding.left + 120)
    .attr("x",0 - (charArea.height / 2) - 150)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("aCoffee Sales (USD)"); 

    var rectGrp=svg.append("g")
        .attr('transform', 'translate('+padding.left+','+padding.top+')'
    );

    rectGrp.selectAll("rect").data(dataSet).enter()
        .append("rect")
        .attr("width", xScale.bandwidth())
        .attr("height", function(d,i) {
            return charArea.height-yScale(d.sales);
        })
        .attr("x", function(d,i) {
            return xScale(d.region);
        })
        .attr("y", function(d,i) {
            return yScale(d.sales);
        })
        .attr("fill", function(d, i) {
            return colors[i];
        });
    var rect2Grp=svg2.append("g")
        .attr('transform', 'translate('+padding.left+','+padding.top+')'
    );
    rect2Grp.selectAll("rect").data(dataSet2).enter()
        .append("rect")
        .attr("width", x2Scale.bandwidth())
        .attr("height", function(d,i) {
            return charArea.height-y2Scale(d.sales);
        })
        .attr("x", function(d,i) {
            return x2Scale(d.category);
        })
        .attr("y", function(d,i) {
            return y2Scale(d.sales);
        })
        .attr("fill", function(d, i) {
            return colors2[i];
        });
  
});