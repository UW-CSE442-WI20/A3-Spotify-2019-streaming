
// globals
var countriesList = ["ca", "dk", "gr", "is", "mx", "ph", "sv",
    "ar", "ch", "do", "gt", "it", "my", "pl", "th",
    "at", "cl", "ec", "hk", "jp", "pt", "tr",
    "au", "co", "hn", "nl", "py", "tw",
    "be", "cr", "es", "hu", "no", "ro", "us",
    "fi", "id", "nz", "se", "uy",
    "bo", "cz", "fr", "ie", "pa", "sg", "vn",
    "br", "de", "gb", "il", "pe", "sk", "global"];

var countriesName = ["Canada", "Denmark", "Greece", "Iceland", "Mexico", "Philippines", "El Salvador",
    "Argentina", "Switzerland", "Dominican Republic", "Guatemala", "Italy", "Malaysia", "Poland", "Thailand",
    "Austria", "Chile", "Ecuador", "Hong Kong", "Japan", "Portugal", "Turkey",
    "Australia", "Columbia", "Honduras", "Netherlands", "Paraguay", "Taiwan",
    "Belgium", "Costa Rica", "Spain", "Hungary", "Norway", "Romania", "United States",
    "Finland", "Indonesia", "New Zealand", "Sweden", "Uruguay",
    "Bolivia", "Czech Republic", "France", "Ireland", "Panama", "Singapore", "Vietnam",
    "Brazil", "Germany", "United Kingdom", "Israel", "Peru", "Slovakia", "global"];
var Countries = (countriesName).slice(0).sort();

var barPadding = 1;
var margin = {
    top: 15,
    right: 25,
    bottom: 30,
    left: 10
};
var w = 1200 - margin.left - margin.right;
var h = 612 - margin.top - margin.bottom;

//set x and y ranges
var y = d3.scaleBand()
.range([h, 0])
.padding(0.1);

var x = d3.scaleLinear()
.range([0, w]);


var dataset = [];
var barDataset;
var songNames;


//--------------------------------// end globals

function init() {
    // load global data
    d3.csv("streamsglobal10.csv").then(function (data) {
        slider.initSlider();
        initGraph();

        dataset = data;
        var filtered = data.filter(function (d) {
            return d["date"] === slider.getDate();
        })
        
        updateGraph(filtered);

        // update graph based on country dropdown
        var countryDropdown = d3.select("#vis-container-country")
            .insert("select", "svg")
            .on("change", function () {
                var country = d3.select(this).property("value");
                var index = countriesName.indexOf(country);
                var fileName = "streams" + countriesList[index] + "10.csv";

                // load new csv, and update graph
                d3.csv(fileName).then(function (data) {
                    dataset = data;
                    var filtered = data.filter(function (d) {
                        return d["date"] === slider.getDate();
                    })
                    updateGraph(filtered);
                });
            });

        // populate the country dropdown
        countryDropdown.selectAll("option")
            .data(Countries)
            .enter().append("option")
            .attr("value", function (d) { return d; })
            .attr("selected", function (d) {
                return d === "Global";
            })
            .text(function (d) {
                return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
            });
    });
}

function initGraph() {
    svg = d3.select("div#graph")
        .append("svg")
        .attr("width", w + margin.left + margin.right)
        .attr("height", h + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bars = svg.selectAll("rect")
        .data([[], [], [], [], [], [], [], [], [], []]);

    // create the bars
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("width", function (d) { return x(d[0]); })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("fill", function () {
            return "rgb(30, 215, 96)";
        })
        .attr("height", y.bandwidth());

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("color", "white")
        .call(d3.axisBottom(x));
    // .ticks(10));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickFormat(""));

}

function updateSVG(fullSongNames, barDataset, artistNames, songNames) {
    svg.selectAll("text").remove();

    // update and add the x Axis
    svg.selectAll("g").remove();
    svg.append("g")
        .attr("transform", "translate(0," + h + ")")
        .attr("color", "white")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y).tickSize(0).tickFormat(""));

    svg.selectAll("title").remove();
    svg.selectAll("rect")
        .append("title")
        .text(function (d) {
            var i = 10 - parseInt(d[1]);
            // NOTE: date is slider date (not dropdown date)
            return "\"" + fullSongNames[i] + "\" by " + artistNames[i] + ": "
                + d[0] + " streams on " + slider.getDate();
        })

    svg.selectAll("text.value")
        .data(barDataset)
        .enter()
        .append("text")
        .text(function (d) {
            return songNames[parseInt(d[1]) - 1];
        })
        .attr("text-anchor", "end")
        .attr("y", function (d, i) {
            return (9 - i) * (h / barDataset.length) + 27;
        })
        .attr("x", function (d) {
            var index = d[1];
            var streams = barDataset[index - 1][0];
            return x(streams) - 8;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "14px")
        .attr("font-weight", 550)
        .attr("fill", "black")
}

function updateBars(barDataset) {
    var bars = svg.selectAll("rect")
        .data(barDataset);

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("width", function (d) { return x(d[0]); })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("fill", function (d) {
            return "rgb(0, 0, " + (d[0] * 10) + ")";
        })
        .attr("height", y.bandwidth())
        .merge(bars)	//Update…
        .attr("x", function (d, i) {
            return x(d[1]);
        })
        .attr("y", function (d) {
            return y(d[1]);
        })
        .attr("width", function (d) { return x(d[0]); })
        .attr("height", y.bandwidth());
}


function updateGraph(filtered) {
    barDataset = [[]];
    songNames = [""];
    var fullSongNames = [""];
    artistNames = [""];

    for (var i = 0; i < filtered.length; i++) {
        var arrayObj = [parseInt(filtered[i].Streams), (10 - i) + ""];
        var name = filtered[i]["Track Name"];
        fullSongNames[i] = name;
        if (filtered[i]["Track Name"].length > 30) {
            name = name.substring(0, 31) + "...";
        }
        songNames[i] = name;
        artistNames[i] = filtered[i]["Artist"];
        barDataset[i] = arrayObj;
    }

    // Scale the range of the data in the domains
    x.domain([0, d3.max(barDataset, function (d) { return d[0]; })])
    y.domain(d3.range(1, barDataset.length + 1));

    updateBars(barDataset)
    updateSVG(fullSongNames, barDataset, artistNames, songNames);
}


slider = function () {
    var sliderTime;
    var date;

    function playSlider() {

    }

    function getDate() {
        return d3.timeFormat("%Y-%m-%d")(sliderTime.value());
    }

    // Code inspired/provided by https://github.com/johnwalley/d3-simple-slider v1.5.4 Copyright 2019 John Walley
    function initSlider() {
        var weeks2019 = d3.range(0, 53).map(function (d) {
            return new Date(2019, 0, 1 + 7 * d);
        });

        sliderTime = d3
            .sliderBottom()
            .min(d3.min(weeks2019))
            .max(d3.max(weeks2019))
            .step(28)
            .width(1240 - margin.left - margin.right)
            .tickFormat(d3.timeFormat("%m-%d"))
            .tickValues(weeks2019)
            .displayValue(false)
            .on("onchange", val => {
                d3.select("p#value").text(d3.timeFormat("%Y-%m-%d")(val));
                date = d3.timeFormat("%Y-%m-%d")(val);

                var filtered = dataset.filter(function (d) {
                    for (var i = 0; i < dataset.length; i++) {
                        return d["date"] === date;
                    }
                })

                updateGraph(filtered)
            });

        var gTime = d3
            .select("div#slider")
            .append("svg") 
            .attr("width", 1350 - margin.left - margin.right)
            .attr("height", 132 - margin.top - margin.bottom)
            .append("g")
            .attr("transform", "translate(30,30)");

        gTime.call(sliderTime);
        gTime.selectAll("text").attr("dx", "-10px").attr("dy", "-16px");

        // show date at very beginning
        d3.select("p#value").text(d3.timeFormat("%Y-%m-%d")(sliderTime.value()));
    }

    return {
        getDate: getDate,
        initSlider: initSlider
    }

}();

init();
