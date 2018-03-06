angular.module('app').service('contentGraphService', contentGraphService)
contentGraphService.$inject = ['commonService']

function contentGraphService(commonService) {
  var vm = this

  vm.threshold = null;
  vm.currentBfw = null;
  vm.designLifetime = commonService.defaultDesignLifetime;

  vm.avgFirstFailYear = "-"
  vm.prob = "-"

  vm.filePrefix = ""

  vm.initRatiosGraph = function(lat, lng) {
    //console.log("hello from initRatiosGraph")

    vm.filePrefix = lat + lng

    vm.margin = {
        top: 5,
        right: 20,
        bottom: 30,
        left: 50
      },
      vm.width = 900 - vm.margin.left - vm.margin.right,
      vm.height = 350 - vm.margin.top - vm.margin.bottom;

    vm.widthProb = 900 - vm.margin.left - vm.margin.right,
      vm.heightProb = 175 - vm.margin.top - vm.margin.bottom;

    vm.parseTime = d3.timeParse("%Y");

    // define x and y plot scale
    vm.x = d3.scaleTime().range([0, vm.width]);
    vm.y = d3.scaleLinear().range([vm.height, 0]);

    //define the line
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

  vm.updateRatioGraphYaxis = function() {

  }


  vm.updateRatiosGraph = function(currentBfw, designLifetime, threshold, cb) {
    // vm.threshold = ((threshold-2)/1.2) // threshold //((vm.threshold-2)/1.2)
    vm.threshold = threshold
    vm.designLifetime = vm.getDesignEndYear(designLifetime)
    vm.currentBfw = currentBfw
    vm.culvertSize = (vm.currentBfw * 1.2) + 2

    vm.clearGraphs()
    vm.gMinMax;
    vm.gThresh = vm.threshold

    commonService.startYear = commonService.startYear
    commonService.endYear = commonService.endYear

    vm.arrYears = []
    //this will control x axis year range of ratios graph
    for (let i = commonService.startYear + 1; i <= commonService.endYear; i++) {
      vm.arrYears.push(vm.parseTime(i))
    }
    //console.log("arrYears: ", vm.arrYears)

    vm.x.domain(d3.extent(vm.arrYears, function(d) {
      return d;
    }));

    vm.gMinMax = d3.extent(vm.arrYears, function(d) {
      return d;
    })

    var areaPath = []
    d3.csv("./csv/" + vm.filePrefix + "/" + vm.filePrefix + "ratio.csv", function(error, data) {
      if (error) throw error;
      var rangeMin
      var rangeMax
      //for each object, make it an array per value line
      let valueLines = []
      for (valueLineObj of data) {
        //console.log("model value line unmodified from ratios csv: ", valueLineObj)
        let valueLine = []
        for (key in valueLineObj) {
          if (key !== "" && key > commonService.startYear) valueLine.push({
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
          d.val = parseFloat(d.val) * vm.culvertSize
        });
      }
      //console.log("value lines from ratios csv after modification: ", valueLines)

      //figure out min and max at each year for all value lines
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
      //console.log("minline: ", minVals)
      //console.log("maxline: ", maxVals)

      //console.log("min: ", minValsJustValues)
      //console.log("max: ", maxValsJustValues)

      rangeMin = Math.min(...minValsJustValues)
      rangeMax = Math.max(...maxValsJustValues)

      //console.log("rangemin, max: ", rangeMin, rangeMax)
      vm.y.domain([rangeMin, rangeMax])

      //build areaPath from minVals and maxVals
      for (let i = 0; i < minVals.length; i++) {
        areaPath.push({
          year: minVals[i].year,
          val0: minVals[i].val,
          val1: maxVals[i].val
        })
      }

      var area = d3.area()
        // .curve(d3.curveBasis)
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

      vm.genAvereageLine(rangeMin, rangeMax, area)

      cb()

    });

    //this function is a placeholder to be used as a post processor for modifying valuelines (not used in production)
    vm.doFirst = function(valueLine) {
      // //console.log("from doFirst: ", valueLines)
      // valueLine[0].val = valueLine[1].val
    }

    vm.appendLifeSpanLabel = function(svgCanvas, label, x, y, padding, rotation) {
      svgCanvas.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "translate(" + (x - padding) + "," + y + ") rotate(" + rotation + ")")
        .style("font-size", "0.75rem")
        .attr("fill", "#000")
        .text(label);
    }

    //average line
    vm.genAvereageLine = function(rangeMin, rangeMax, area) {
      let avgLine = []
      d3.csv("./csv/" + vm.filePrefix + "/" + vm.filePrefix + "avgratio.csv", function(error, data) {
        if (error) throw error;
        //console.log("avg line unmodified from avgratio csv: ", data)
        //build avg line
        for (let i = 0; i < data.length; i++) {
          let v = data[i]["1.0"]
          let d = data[i][2018]

          let obj = {
            year: d,
            val: v
          }
          avgLine.push(obj)
        }

        vm.doFirst(avgLine)

        //format values in averages valueLine
        for (obj of avgLine) {
          obj.year = vm.parseTime(obj.year)
          obj.val = parseFloat(obj.val) * vm.culvertSize //vm.currentBfw
        }
        //console.log("avg line from avgratio csv after modification: ", avgLine)

        //plot averages line
        data = avgLine

        vm.svgRatios.append("path")
          .data([data])
          .attr("class", "color-graph-ratio-line")
          .attr("d", vm.valueline);

        // Add threshold line
        //console.log("adding threshold line, vm.gTresh: ", vm.gThresh)
        vm.svgRatios.append("line")
          .attr("class", "color-graph-ratio-thresh")
          .attr("x1", vm.x(vm.gMinMax[0]))
          .attr("y1", vm.y(vm.gThresh))
          .attr("x2", vm.x(vm.gMinMax[1]))
          .attr("y2", vm.y(vm.gThresh))

        //add threshold label
        let pcsTxt = "Proposed Culvert Size (ft)"
        let pcsEndX = vm.x(vm.parseTime(commonService.endYear))
        let padding = 7
        let rotation = 0
        let pcsTxtY = vm.y(vm.threshold) - padding
        vm.appendLifeSpanLabel(vm.svgRatios, pcsTxt, pcsEndX, pcsTxtY, padding, rotation)

        // Add the X Axis
        vm.svgRatios.append("g")
          .attr("transform", "translate(0," + vm.height + ")")
          .call(d3.axisBottom(vm.x).ticks(20).tickSize(0).tickPadding(5))
          .append("text")
          .attr("transform", "translate(8)")
          .attr("y", 27)
          .style("font-size", "0.75rem")
          .attr("fill", "#000");



        // Add the Y Axis
        //console.log("add ratios left axis: rangemin, rangeMax: ", rangeMin, rangeMax)
        vm.svgRatios.append("g")
          .call(d3.axisLeft(vm.y).tickSize(0).tickPadding(5))
          .append("text")
          .attr("transform", "translate(-32) rotate(-90)")
          .attr("y", 0)
          .style("font-size", "0.75rem")
          .attr("fill", "#000")
          .text("Culvert Size (ft)");

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

        //add start and end of lifetime lines
        //(note x is in form of date timestamp)
        //(note vm.y.domain() returns "world coordinates" on svg canvas)

        //console.log("vm.gMinMax: ", vm.gMinMax)
        //console.log("vm.designLifetime: ", vm.designLifetime)
        //console.log("vm.parseTime(vm.designLifetime): ", vm.parseTime(vm.designLifetime))
        //console.log("y.domain(): ", vm.y.domain())
        //console.log(commonService.currentYear)


        vm.svgRatios.append("line")
          .attr("class", "end-of-lifetime-line")
          .attr("x1", vm.x(vm.parseTime(vm.designLifetime)))
          .attr("y1", vm.y(vm.y.domain()[0]))
          .attr("x2", vm.x(vm.parseTime(vm.designLifetime)))
          .attr("y2", vm.y(vm.y.domain()[1]))

        //build area path from start and end lines
        let lifetimeAreaPath = [{
            year: vm.parseTime(commonService.startYear + 1),
            val0: vm.y.domain()[0],
            val1: vm.y.domain()[1]
          },
          {
            year: vm.parseTime(vm.designLifetime),
            val0: vm.y.domain()[0],
            val1: vm.y.domain()[1]
          }
        ]

        vm.svgRatios.append("path")
          .attr("class", "lifetime-fill")
          .attr("d", function(d) {
            return area(lifetimeAreaPath);
          });

        //append liftime labels
        let lifetimeStartX = vm.x(vm.parseTime(commonService.startYear + 1))
        let lifetimeEndX = vm.x(vm.parseTime(vm.designLifetime))
        let paddingVal = 7
        let lifetimeEndTxt = "End lifespan, " + vm.designLifetime
        vm.appendLifeSpanLabel(vm.svgRatios, lifetimeEndTxt, lifetimeEndX, 4, paddingVal, -90)
      })
    }

  }

  vm.getProbFailureNum = function(probLine) {
    //get vals up to lifetime into array
    let upToLifetimeVals = []
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

    vm.prob = (((1 - prod) * 100)).toFixed(2) + '%'
    //console.log("probability indicator: ", vm.prob)
  }

  vm.updateProbabilityGraph = function(cb) {

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

    //note; vm.theshold is value from form input PCS as-is
    vm.gThreshProb = vm.threshold / vm.culvertSize

    //console.log("---vm.culvertSize ", vm.culvertSize)
    //console.log("---vm.threshold ", vm.threshold)
    //console.log("---vm.currentBfw ", vm.currentBfw)
    //console.log("---vm.gThreshProb ", vm.gThreshProb)

    vm.numYears = (commonService.endYear) - (commonService.startYear)
    vm.arrYearsProb = []

    //this will control x axis year range of prob graph
    for (let i = commonService.startYear + 1; i <= commonService.endYear; i++) {
      vm.arrYearsProb.push(vm.parseTimeProb(i))
    }

    vm.xProb.domain(d3.extent(vm.arrYearsProb, function(d) {
      return d;
    }));

    vm.gMinMaxProb = d3.extent(vm.arrYearsProb, function(d) {
      return d;
    })

    /*
    open csv,
    generate value lines (one for each model) each valueLine goes into an array valueLines,
    */
    vm.yProb.domain([0.0, 1.0]);
    d3.csv("./csv/" + vm.filePrefix + "/" + vm.filePrefix + "ratio.csv", function(error, data) {
      if (error) throw error;
      //console.log("ratio data: ", data)
      //for each object, make it an array as above for each value line
      let valueLines = []
      for (valueLineObj of data) {
        let valueLine = []
        for (key in valueLineObj) {
          if (key !== "" && key > commonService.startYear) valueLine.push({
            year: key,
            val: valueLineObj[key]
          })
        }
        vm.doFirst(valueLine)
        valueLines.push(valueLine)
      }
      //console.log("updateProbabilityGraph valueLines: ", valueLines)
      //console.log("vm.gThreshProb: ", vm.gThreshProb)
      //---get average first year of probable failure---
      //for each valueLine, record first year that shows value above threshold (bfwDesign)
      let failureYears = []
      for (i = 0; i < valueLines.length; i++) {
        for (j = 0; j < vm.numYears; j++) {
          if (valueLines[i][j].val > vm.gThreshProb) {
            failureYears.push(valueLines[i][j].year)
            break;
          }
        }
      }
      //console.log("failureYears: ", failureYears)
      vm.nModels = failureYears.length
      //get averge of years recorded:
      let failureYearsSum = 0
      for (year of failureYears) {
        failureYearsSum += parseInt(year)
      }

      //set failure year value for contentGraph component
      if (failureYears.length > 0) {
        vm.avgFirstFailYear = (failureYearsSum / failureYears.length).toFixed(0)
      } else {
        vm.avgFirstFailYear = "N/A"
      }
      //console.log("vm.avgFirstFailYear: ", vm.avgFirstFailYear)

      // build probability value line (for each date, in each line,
      // count how many values are above thresh and divide by total valuelines to get y for that date)
      // for each "year slot" check all values in all lines for that year
      let probLine = []
      for (i = 0; i < vm.numYears; i++) {

        let valsAbove = 0;
        for (valueLine of valueLines) {
          if (valueLine[i].val > vm.gThreshProb) {
            valsAbove++
          }
        }
        let yearVal = vm.parseTimeProb(parseInt(valueLine[i].year))

        probLine.push({
          year: yearVal,
          val: valsAbove / valueLines.length
        })
      }

      vm.getProbFailureNum(probLine)

      //plot probability line
      data = probLine
      //console.log("probline: ", probLine)
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

        //lifespan fill area and lines
        //build area path from start and end lines
        let lifetimeAreaPath = [{
            year: vm.parseTime(commonService.startYear + 1),
            val0: vm.yProb.domain()[0],
            val1: vm.yProb.domain()[1]
          },
          {
            year: vm.parseTime(vm.designLifetime),
            val0: vm.yProb.domain()[0],
            val1: vm.yProb.domain()[1]
          }
        ]

        var area = d3.area()
          // .curve(d3.curveBasis)
          .x(function(d) {
            return vm.x(d.year);
          })
          .y0(function(d) {
            return vm.yProb(d.val0);
          })
          .y1(function(d) {
            return vm.yProb(d.val1);
          });


        vm.svgProbability.append("path")
          .attr("class", "lifetime-fill")
          .attr("d", function(d) {
            return area(lifetimeAreaPath);
          });


        vm.svgProbability.append("line")
          .attr("class", "end-of-lifetime-line")
          .attr("x1", vm.x(vm.parseTime(vm.designLifetime)))
          .attr("y1", vm.yProb(vm.yProb.domain()[0]))
          .attr("x2", vm.x(vm.parseTime(vm.designLifetime)))
          .attr("y2", vm.yProb(vm.yProb.domain()[1]))
      cb()

    });

    // Add the X Axis
    vm.svgProbability.append("g")
      .attr("transform", "translate(0," + vm.heightProb + ")")
      .call(d3.axisBottom(vm.xProb).ticks(20).tickSize(0).tickPadding(5))
      .append("text")
      .attr("transform", "translate(8)")
      .attr("y", 20)
      .attr("dy", "0.71em")
      .style("class", "color-axis-line-bottom")
      .style("font-size", "0.75rem")
      .attr("fill", "#000")
      .text("Year");

    // Add the Y Axis
    vm.svgProbability.append("g")
      .call(d3.axisLeft(vm.yProb).ticks(10).tickSize(0).tickPadding(5))
      .append("text")
      .attr("transform", "translate(-32) rotate(-90)")
      .attr("y", 0)
      .style("font-size", "0.75rem")
      .attr("fill", "#000")
      .text("Probability");

    d3.selectAll('text').attr('font-family', 'Roboto')


  }
  // gridlines in y axis function
  function make_x_gridlines(x) {
    return d3.axisBottom(x)
      .ticks(7)
  }

  vm.clearGraphs = function() {
    while (vm.svgRatios._groups[0][0].lastChild) {
      vm.svgRatios._groups[0][0].removeChild(vm.svgRatios._groups[0][0].lastChild);
    }
    while (vm.svgProbability._groups[0][0].lastChild) {
      vm.svgProbability._groups[0][0].removeChild(vm.svgProbability._groups[0][0].lastChild);
    }
  }

}
