angular.module('app').service('contentGraphService', contentGraphService)
contentGraphService.$inject = ['commonService']

function contentGraphService(commonService) {
  var vm = this

  // vm.prob = "-"
  vm.threshold = null;
  vm.currentBfw = null;
  // vm.bfwDesign = null;
  vm.designLifetime = commonService.defaultDesignLifetime;

  vm.firstFailYear = "-"
  vm.prob = "-"

  vm.initRatiosGraph = function(lat, lng, currentBfw, designLifetime, threshold) {
    console.log("hello from initRatiosGraph")
    vm.threshold = threshold
    vm.designLifetime = vm.getDesignEndYear(designLifetime)
    // vm.designLifetime = commonService.getDesignEndYear(designLifetime)
    vm.currentBfw = currentBfw
    // commonService.startYear = startYear
    // commonService.endYear = endYear

    vm.margin = {
        top: 5,
        right: 20,
        bottom: 40,
        left: 50
      },
      vm.width = 900 - vm.margin.left - vm.margin.right,
      vm.height = 350 - vm.margin.top - vm.margin.bottom;

      vm.widthProb = 900 - vm.margin.left - vm.margin.right,
      vm.heightProb = 175 - vm.margin.top - vm.margin.bottom;

    // parse the date / time
    vm.parseTime = d3.timeParse("%Y");
    // define x and y plot scale
    vm.x = d3.scaleTime().range([0, vm.width]);
    vm.y = d3.scaleLinear().range([vm.height, 0]);

    // define the line
    vm.valueline = d3.line()
      .x(function(d) {
        return vm.x(d.year);
      })
      .y(function(d) {
        return vm.y(d.val);
      });

    vm.svgRatios = d3.select("#d3ratios").append("svg")
      .attr("width", vm.width + vm.margin.left + vm.margin.right)
      .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + vm.margin.left + "," + vm.margin.top + ")");

    vm.svgProbability = d3.select("#d3probability").append("svg")
      .attr("width", vm.widthProb + vm.margin.left + vm.margin.right)
      .attr("height", vm.heightProb + vm.margin.top + vm.margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + vm.margin.left + "," + vm.margin.top + ")");
  }

  vm.getDesignEndYear = function(designLifetime) {
    let designEndYear = (new Date()).getFullYear() + parseInt(designLifetime)
    return designEndYear
  }


  vm.updateRatiosGraph = function(cb) {
    vm.clearGraphs()
    vm.gMinMax;
    vm.gThresh = vm.threshold

    commonService.startYear = commonService.startYear
    commonService.endYear = commonService.endYear

    vm.arrYears = []
    for (let i = commonService.startYear; i <= commonService.endYear; i++) {
      vm.arrYears.push(vm.parseTime(i))
    }

    vm.x.domain(d3.extent(vm.arrYears, function(d) {
      return d;
    }));

    vm.gMinMax = d3.extent(vm.arrYears, function(d) {
      return d;
    })

    // vm.y.domain([0.65, 1.35]);
    // vm.y.domain([0.65 * vm.currentBfw, 1.35 * vm.currentBfw]);

    var areaPath = []
    d3.csv("./contentGraph/ratio00.csv", function(error, data) {
      if (error) throw error;
      var rangeMin
      var rangeMax
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

      //format data in value lines (do bankfull width mult here)
      for (let i = 0; i < valueLines.length; i++) {
        valueLines[i].forEach(function(d) {
          d.year = vm.parseTime(d.year);
          d.val = parseFloat(d.val) * vm.currentBfw;
        });
      }



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
      for (year of valsAllYears) {
        //make into an array of just it's values
        for (obj of year) {
          yearVals.push(obj.val)
        }

        minVals.push({
          year: year[0].year,
          val: Math.min(...yearVals)
        })
        maxVals.push({
          year: year[0].year,
          val: Math.max(...yearVals)
        })

        yearVals = []
      }

      //minVals, maxVals now contain objects representing value lines of min and max date values in format: [{year, val}...]
      //so get just min and max vals into min and max arrays to get just max and min vals to set y axis rangeMin
      let minValsJustValues = []
      let maxValsJustValues = []
      for (let i = 0; i < maxVals.length; i++) {
        minValsJustValues.push(minVals[i].val)
        maxValsJustValues.push(maxVals[i].val)
      }
      console.log("min: ", minValsJustValues)
      console.log("max: ", maxValsJustValues)

      rangeMin = Math.min(...minValsJustValues)
      rangeMax = Math.max(...maxValsJustValues)
      // vm.y.domain([0.65, 1.35]);
      // console.log("min max vals: ", minVals, maxVals)
      console.log("rangemin, max: ", rangeMin, rangeMax)
      // vm.y.domain([0.65 * vm.currentBfw, 1.35 * vm.currentBfw]);
      // vm.y.domain([rangeMin, rangeMax]);
      vm.y.domain([rangeMin, rangeMax]);


      //build areaPath from minVals and maxVals
      for (let i = 0; i < minVals.length; i++) {
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
        .attr("class", "color-graph-fill")
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

      vm.genMeanLine()

      // Add the X Axis
      vm.svgRatios.append("g")
        .attr("transform", "translate(0," + vm.height + ")")
        .call(d3.axisBottom(vm.x).ticks(20).tickSize(0).tickPadding(5))
        .append("text")
        .attr("transform", "translate(8)")
        .attr("y", 27)
        // .attr("dy", "0.71em")
        .style("font-sccize", "0.75rem")
        // .attr("fill", "#000")
        .text("Year");



      // Add the Y Axis
      vm.svgRatios.append("g")
        // .call(d3.axisLeft(vm.y).ticks(20).tickSize(0).tickPadding(5))
        .call(d3.axisLeft(vm.y).tickSize(0).tickPadding(5).tickValues(d3.range(rangeMin, rangeMax, 1)))
        .append("text")
        .attr("transform", "translate(-28) rotate(-90)")
        .attr("y", 0)
        // .attr("dy", "-1.75rem")
        .style("font-size", "0.75rem")
        // .style("padding", "0.5rem")
        .attr("fill", "#000")
        .text("Bankfull Width (ft)");

      // add the Y gridlines
      vm.svgRatios.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + vm.height + ")")
        .call(make_x_gridlines(vm.x)
          .tickSize(-vm.height)
          .tickFormat("")
        )

      // Add axis-left and axis-right lines

      //left
      vm.svgRatios.append("line")
        .attr("class", "axis-line")
        .attr("x1", vm.x(vm.gMinMax[0]))
        .attr("y1", vm.y(vm.y.domain()[0]))
        .attr("x2", vm.x(vm.gMinMax[0]))
        .attr("y2", vm.y(vm.y.domain()[1]))

      //right
      vm.svgRatios.append("line")
        .attr("class", "axis-line")
        .attr("x1", vm.x(vm.gMinMax[1]))
        .attr("y1", vm.y(vm.y.domain()[0]))
        .attr("x2", vm.x(vm.gMinMax[1]))
        .attr("y2", vm.y(vm.y.domain()[1]))

      cb()


    });


    //mean line
    vm.genMeanLine = function() {
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
          obj.val = parseFloat(obj.val) * vm.currentBfw
        }

        //plot mean line
        data = meanLine
        vm.svgRatios.append("path")
          .data([data])
          .attr("class", "color-graph-ratio-line")
          .attr("d", vm.valueline);
        // Add thereshold line
        vm.svgRatios.append("line")
          .attr("class", "color-graph-ratio-thresh")
          .attr("x1", vm.x(vm.gMinMax[0]))
          .attr("y1", vm.y(vm.gThresh))
          .attr("x2", vm.x(vm.gMinMax[1]))
          .attr("y2", vm.y(vm.gThresh))

      })
    }

  }

  vm.getProbFailureNum = function(probLine) {
    //get vals up to lifetime into array
    let upToLifetimeVals = []
    // let i = 0
    let designLifetimeYear = vm.parseTime(vm.designLifetime)

    for (let i = 0; i < probLine.length; i++) {
      if (probLine[i].year <= designLifetimeYear) {
        upToLifetimeVals.push(probLine[i].val)
      }
    }


    //get differences of vals in upToLifetimeVals from 1 into array
    let difVals = []
    for (let i = 0; i < upToLifetimeVals.length; i++) {
      difVals.push(parseFloat((1 - upToLifetimeVals[i]).toFixed(4)))
    }

    //multiply those values together
    // difVals = [1,2,3,4,5]
    // difVals=[0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9,0.9]
    let prod = difVals[0]


    if (difVals.length > 1) {
      for (let i = 1; i < difVals.length; i++) {
        prod = parseFloat((prod * difVals[i]).toFixed(4))
      }
    }
    if (difVals.length === 1) {
      prod = difVals[0]
    }
    if (difVals.length === 0) {
      prod = 0
    }

    // document.getElementById('prob-ind').innerHTML = (((1 - prod) * 100)).toFixed(2) + '%'
    vm.prob = (((1 - prod) * 100)).toFixed(2) + '%'
    console.log("probability indicator: ", vm.prob)

  }

  vm.updateProbabilityGraph = function(cb) {

    // let width = 900 - vm.margin.left - vm.margin.right
    // let height = 200 - vm.margin.top - vm.margin.bottom

    // parse the date / time
    vm.parseTimeProb = d3.timeParse("%Y");

    // define x and y plot scale
    vm.xProb = d3.scaleTime().range([0, vm.widthProb]);
    vm.yProb = d3.scaleLinear().range([vm.heightProb, 0]);

    // define the line
    vm.valuelineProb = d3.line()
      .x(function(d) {
        return vm.xProb(d.year);
      })
      .y(function(d) {
        return vm.yProb(d.val);
      });

    vm.gMinMaxProb;

    vm.gThreshProb = vm.threshold / vm.currentBfw //verify this division with AM
    console.log("---vm.threshold ", vm.threshold)
    console.log("---vm.currentBfw ", vm.currentBfw)
    console.log("---vm.gThreshProb ", vm.gThreshProb)

    // commonService.startYear = 2014
    // commonService.endYear = 2090
    vm.numYears = (commonService.endYear + 1) - commonService.startYear
    vm.arrYearsProb = []
    for (let i = commonService.startYear; i <= commonService.endYear; i++) {
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
      console.log("updateProbabilityGraph valueLines: ", valueLines)
      console.log("vm.gThreshProb: ", vm.gThreshProb)
      //---get average first year of probable failure---
      //for each valueLine, record first year that shows value above threshold (bfwDesign)
      //return tbd
      let failureYears = []
      for (i = 0; i < valueLines.length; i++) {
        console.log("i: ", i)
        for (j = 0; j < vm.numYears; j++) {
          //should this be >= ? does it fail if val is equal to thresh?
          //it's ok that vm.gThreshProb is always one? should it ever be multiplied by anything?
          if (valueLines[i][j].val > vm.gThreshProb) {
            console.log("fail val: ", valueLines[i][j].val)
            failureYears.push(valueLines[i][j].year)
            break;
          }
        }
      }
      console.log("failureYears: ", failureYears)
      //get averge of years recorded:
      let failureYearsSum = 0
      for (year of failureYears) {
        failureYearsSum += parseInt(year)
      }
      vm.firstFailYear = (failureYearsSum / failureYears.length).toFixed(0)
      console.log("vm.firstFailYear: ", vm.firstFailYear)
      //------------------------------------------------

      // get probability (for each date, in each line,
      // count how many values are above thresh and divide by total valuelines to get y for that date)
      //for each "year slot" check all values in all lines for that year
      let probLine = []
      for (i = 0; i < vm.numYears; i++) {

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

      vm.getProbFailureNum(probLine)

      //plot probability line
      data = probLine
      console.log("probline: ", probLine)
      vm.svgProbability.append("path")
        .data([data])
        .attr("class", "color-graph-prob-line")
        .attr("d", vm.valuelineProb);

      // add the Y gridlines
      vm.svgProbability.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + vm.heightProb + ")")
        .call(make_x_gridlines(vm.xProb)
          .tickSize(-vm.heightProb)
          .tickFormat("")
        )
      d3.selectAll('.domain').attr('stroke', 'rgba(#00000000)')

      //add axis-lines

      //left
      vm.svgProbability.append("line")
        .attr("class", "axis-line")
        .attr("x1", vm.x(vm.gMinMaxProb[0]))
        .attr("y1", vm.yProb(vm.yProb.domain()[0]))
        .attr("x2", vm.x(vm.gMinMaxProb[0]))
        .attr("y2", vm.yProb(vm.yProb.domain()[1]))

      //right
      vm.svgProbability.append("line")
        .attr("class", "axis-line")
        .attr("x1", vm.x(vm.gMinMaxProb[1]))
        .attr("y1", vm.yProb(vm.yProb.domain()[0]))
        .attr("x2", vm.x(vm.gMinMaxProb[1]))
        .attr("y2", vm.yProb(vm.yProb.domain()[1]))


      cb()

    });

    // Add the X Axis
    vm.svgProbability.append("g")
      .attr("transform", "translate(0," + vm.heightProb + ")")
      .call(d3.axisBottom(vm.xProb).ticks(20).tickSize(0).tickPadding(5))
      .append("text")
      .attr("transform", "translate(8)")
      .attr("y", 27)
      // .attr("dy", "0.71em")
      .style("font-size", "0.75rem")
      .attr("fill", "#000")
      .text("Year");

    // Add the Y Axis
    vm.svgProbability.append("g")
      .call(d3.axisLeft(vm.yProb).ticks(10).tickSize(0).tickPadding(5))
      .append("text")
      .attr("transform", "translate(-28) rotate(-90)")
      .attr("y", 0)
      // .attr("dy", "-1.75rem")
      .style("font-size", "0.75rem")
      .attr("fill", "#000")
      .text("Probability");

    d3.selectAll('text').attr('font-family', 'Roboto')
    // font-family: 'Roboto', sans-serif;

  }
  // gridlines in y axis function
  function make_x_gridlines(x) {
    return d3.axisBottom(x)
      .ticks(7)
  }

  vm.clearGraphs = function() {
    //also set style
    // g text {
    //   fill: #FF0000
    //   y: 9
    //   dy: 0.71em
    // }
    // vm.svgProbability.axisLeft.text.
    console.log("vm.clearGraphs() happened")
    while (vm.svgRatios._groups[0][0].lastChild) {
      vm.svgRatios._groups[0][0].removeChild(vm.svgRatios._groups[0][0].lastChild);
    }
    while (vm.svgProbability._groups[0][0].lastChild) {
      vm.svgProbability._groups[0][0].removeChild(vm.svgProbability._groups[0][0].lastChild);
    }
  }


}
