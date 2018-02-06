angular.module('app').service('contentGraphService', contentGraphService)

function contentGraphService() {
  var vm = this

  //these are recieved from toolbar on graph gen click
  vm.threshold = null;
  vm.currentBfw = null;
  vm.bfwDesign = null;

  vm.initRatiosGraph = function() {

    vm.margin = {
        top: 5,
        right: 50,
        bottom: 20,
        left: 50
      },
      width = 800 - vm.margin.left - vm.margin.right,
      height = 300 - vm.margin.top - vm.margin.bottom;

    widthProb = 800 - vm.margin.left - vm.margin.right,
      heightProb = 150 - vm.margin.top - vm.margin.bottom;

    // parse the date / time
    vm.parseTime = d3.timeParse("%Y");
    // define x and y plot scale
    vm.x = d3.scaleTime().range([0, width]);
    vm.y = d3.scaleLinear().range([height, 0]);

    // define the line
    vm.valueline = d3.line()
      .x(function(d) {
        return vm.x(d.year);
      })
      .y(function(d) {
        return vm.y(d.val);
      });
    vm.svgRatios = d3.select("#d3ratios").append("svg")
      .attr("width", width + vm.margin.left + vm.margin.right)
      .attr("height", height + vm.margin.top + vm.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + vm.margin.left + "," + vm.margin.top + ")");

    vm.svgProbability = d3.select("#d3probability").append("svg")
      .attr("width", widthProb + vm.margin.left + vm.margin.right)
      .attr("height", heightProb + vm.margin.top + vm.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + vm.margin.left + "," + vm.margin.top + ")");
  }

  vm.updateRatiosGraph = function() {
    console.log("---from updateRatiosGraph---")
    console.log("currentBfw", vm.currentBfw)

    console.log("hello from updateRatiosGraph ", vm.threshold)
    vm.clearGraphs()
    vm.gMinMax;
    vm.gThresh = vm.threshold

    vm.startYear = 2014
    vm.endYear = 2090

    vm.arrYears = []
    for (let i = vm.startYear; i <= vm.endYear; i++) {
      vm.arrYears.push(vm.parseTime(i))
    }

    vm.x.domain(d3.extent(vm.arrYears, function(d) {
      return d;
    }));

    vm.gMinMax = d3.extent(vm.arrYears, function(d) {
      return d;
    })

    // y.domain([minMax[0] - gPadding, minMax[1] + gPadding]);
    vm.y.domain([0.65, 1.35]);
    vm.y.domain([0.65 * vm.currentBfw, 1.35 * vm.currentBfw]);

    var areaPath = []
    d3.csv("./contentGraph/ratio00.csv", function(error, data) {
      if (error) throw error;

      //for each object, make it an array per value line
      let valueLines = []
      for (valueLineObj of data) {
        let valueLine = []
        for (key in valueLineObj) {
          if (key !== "") valueLine.push({
            year: key,
            val: valueLineObj[key]
          })
        }
        valueLines.push(valueLine)
      }

      //format data in value lines (do bankful width mult here)
      for (let i = 0; i < valueLines.length; i++) {
        valueLines[i].forEach(function(d) {
          d.year = vm.parseTime(d.year);
          d.val = parseFloat(d.val) * vm.currentBfw;
        });
      }
      console.log("******", valueLines)


      //figure out min and max at each year for all value lines
      //(used for shading and eventually, range setting)
      let valsEachYear = []
      let valsAllYears = []

      for (let j = 0; j < valueLines[0].length; j++) {
        for (let k = 0; k < valueLines.length; k++) {
          valsEachYear.push(valueLines[k][j])
        }

        valsAllYears.push(valsEachYear)
        valsEachYear = []
      }

      //build min and max valueLines
      let minVals = []
      let maxVals = []

      let yearVals = []
      for(year of valsAllYears) {
        //make into an array of just it's values
        for(obj of year) {
          yearVals.push(obj.val)
        }

        minVals.push({year: year[0].year, val: Math.min(...yearVals) })
        maxVals.push({year: year[0].year, val: Math.max(...yearVals) })

        yearVals = []
      }

      //build areaPath from minVals and maxVals
      for (let i=0; i < minVals.length; i++) {
        areaPath.push({
          year: minVals[i].year,
          val0: minVals[i].val,
          val1: maxVals[i].val
        })
      }

      var area = d3.area()
        .curve(d3.curveBasis)
        .x(function(d) {
          return vm.x(d.year);
        })
        .y0(function(d) {
          return vm.y(d.val0);
        })
        .y1(function(d) {
          return vm.y(d.val1);
        });

      //add area
      vm.svgRatios.append("g")
        .append("path")
        // .datum(areaPath)
        .attr("class", "area")
        .attr("d", function(d) {
          return area(areaPath);
        });

        // for visual check valueLines against fill
        // for(let i=0; i < valueLines.length; i++) {
        //   vm.svgRatios.append("path")
        //     .data([valueLines[i]])
        //     .attr("class", "line")
        //     .attr("d", vm.valueline);
        // }


      // Add thereshold line
      vm.svgRatios.append("line")
        .attr("class", "threshline")
        .attr("x1", vm.x(vm.gMinMax[0]))
        .attr("y1", vm.y(vm.gThresh))
        .attr("x2", vm.x(vm.gMinMax[1]))
        .attr("y2", vm.y(vm.gThresh))
        // Add the X Axis
        vm.svgRatios.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(vm.x).ticks(20));

        // Add the Y Axis
        vm.svgRatios.append("g")
          .call(d3.axisLeft(vm.y).ticks(20));

    });



    //mean line
    let meanLine = []
    d3.csv("./contentGraph/ratiomean.csv", function(error, data) {
      if (error) throw error;

      //build mean line
      for (obj of data) {
        meanLine.push({
          year: obj[""],
          val: obj[0]
        })
      }

      //format values in valueLine
      for (obj of meanLine) {
        obj.year = vm.parseTime(obj.year)
        obj.val = parseFloat(obj.val)*vm.currentBfw
      }

      //plot mean line
      data = meanLine
      vm.svgRatios.append("path")
        .data([data])
        .attr("class", "meanline")
        .attr("d", vm.valueline);
    })
  }

  vm.updateProbabilityGraph = function() {
    let width = 800 - vm.margin.left - vm.margin.right
    let height = 150 - vm.margin.top - vm.margin.bottom

    // parse the date / time
    vm.parseTimeProb = d3.timeParse("%Y");

    // define x and y plot scale
    vm.xProb = d3.scaleTime().range([0, width]);
    vm.yProb = d3.scaleLinear().range([height, 0]);

    // define the line
    vm.valuelineProb = d3.line()
      .x(function(d) {
        return vm.xProb(d.year);
      })
      .y(function(d) {
        return vm.yProb(d.val);
      });

    vm.gMinMaxProb;
    vm.gThreshProb = vm.threshold/vm.currentBfw //verify this division with AM
    vm.gPaddingProb = 0.05

    vm.startYearProb = 2014
    vm.endYearProb = 2090
    vm.numYears = (vm.endYear + 1) - vm.startYear
    vm.arrYearsProb = []
    for (let i = vm.startYearProb; i <= vm.endYearProb; i++) {
      vm.arrYearsProb.push(vm.parseTimeProb(i))
    }

    vm.xProb.domain(d3.extent(vm.arrYearsProb, function(d) {
      return d;
    }));

    vm.gMinMaxProb = d3.extent(vm.arrYearsProb, function(d) {
      return d;
    })

    vm.yProb.domain([0.0, 1.0]);
    d3.csv("./contentGraph/ratio00.csv", function(error, data) {
      if (error) throw error;

      //for each object, make it an array as above for each value line
      let valueLines = []
      for (valueLineObj of data) {
        let valueLine = []
        for (key in valueLineObj) {
          if (key !== "") valueLine.push({
            year: key,
            val: valueLineObj[key]
          })
        }
        valueLines.push(valueLine)
      }

      // get probability (for each date, in each line,
      // count how many values are above thresh and divide by total valuelines to get y for that date)
      //for each "year slot" check all values in all lines for that year
      let probLine = []
      for (i = 0; i < vm.numYears; i++) {
        console.log("Snarf")
        let valsAbove = 0;
        for (valueLine of valueLines) {
          if (valueLine[i].val > vm.gThreshProb) {
            valsAbove++
          }
        }
        let yearVal = vm.parseTimeProb(parseInt(valueLine[i].year))
        //why can't i call date key year?
        probLine.push({
          year: yearVal,
          val: valsAbove / valueLines.length
        })
      }

      //plot probability line
      data = probLine
      console.log("probline: ", probLine)
      vm.svgProbability.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", vm.valuelineProb);
    });

    // Add the X Axis
    vm.svgProbability.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(vm.xProb).ticks(20));

    // Add the Y Axis
    vm.svgProbability.append("g")
      .call(d3.axisLeft(vm.yProb).ticks(10));

    // d3.select('text').attr("dy", '1em')
    // d3.select('text').attr("fill", '#FF0000')

  }

  vm.clearGraphs = function() {
    //also set style
    // g text {
    //   fill: #FF0000
    //   y: 9
    //   dy: 0.71em
    // }
    // vm.svgProbability.axisLeft.text.
    while (vm.svgRatios._groups[0][0].lastChild) {
      vm.svgRatios._groups[0][0].removeChild(vm.svgRatios._groups[0][0].lastChild);
    }
    while (vm.svgProbability._groups[0][0].lastChild) {
      vm.svgProbability._groups[0][0].removeChild(vm.svgProbability._groups[0][0].lastChild);
    }
  }


}
