slider = function () {
    // MODULE GLOBAL VARIABLES AND HELPER FUNCTIONS CAN BE PLACED
    // HERE
    var weeks2019;
    var sliderTime;
    var gTime;
    var date;

    // window.onload = function () {
    //     initSlider();
    // };

    function playSlider() {

    }

    function getDate() {
        return d3.timeFormat('%Y-%m-%d')(sliderTime.value());
    }

    // Code inspired/provided by https://github.com/johnwalley/d3-simple-slider v1.5.4 Copyright 2019 John Walley
    function initSlider() {
        weeks2019 = d3.range(0, 53).map(function (d) {
            return new Date(2019, 0, 1 + 7 * d);
        });

        sliderTime = d3
            .sliderBottom()
            .min(d3.min(weeks2019))
            .max(d3.max(weeks2019))
            .step(28)
            .width(1020 - margin.left - margin.right)
            .tickFormat(d3.timeFormat('%m-%d'))
            .tickValues(weeks2019)
            .displayValue(false)
            .on('onchange', val => {
                d3.select('p#value').text(d3.timeFormat('%Y-%m-%d')(val));
                date = d3.timeFormat('%Y-%m-%d')(val);

                var filtered = dataset.filter(function (d) {
                    for (var i = 0; i < dataset.length; i++) {
                        return d['date'] === date;
                    }
                })
                updateGraph(filtered)
            });

        gTime = d3
            .select('div#slider')
            .append('svg')
            .attr('width', 1100 - margin.left - margin.right)
            .attr('height', 132 - margin.top - margin.bottom)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);
        gTime.selectAll("text").attr("dx", "-10px").attr("dy", "-16px");

        //initializes date shown on screen
        // d3.select('p#value').text(d3.timeFormat('%Y-%m-%d')(sliderTime.value()));
        // sliderDate = d3.timeFormat('%Y-%m-%d')(sliderTime.value());
        console.log("initSlider")

    }

    return {
        getDate: getDate
    }

}();