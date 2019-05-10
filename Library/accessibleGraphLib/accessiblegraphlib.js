colours = ['#1E428A', '#EB6BB0', '#005500', '#FFB81C', '#AA0000', '#40B4E5'];

function fillwithSVG(selector) {
  var parentDiv = document.getElementById(selector);

  var width = parentDiv.offsetWidth;
  var height = parentDiv.offsetHeight;

  var newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSVG.setAttributeNS(null, 'width', (width ));
    newSVG.setAttributeNS(null, 'height', (height));

  var newSquare = document.createElementNS("http://www.w3.org/2000/svg","rect");
    newSquare.setAttributeNS(null, 'width', (width));
    newSquare.setAttributeNS(null, 'height', (height));
    newSquare.setAttributeNS(null, 'fill', 'rgb(0,255,0)');
    newSquare.setAttributeNS(null, 'stroke', 'rgb(0,0,0)');
    newSquare.setAttributeNS(null, 'stroke-width', 3);

  newSVG.appendChild(newSquare);

  parentDiv.appendChild(newSVG);
}

function loadJSONandMakeChart(fileName, callback) {

  var reqObj = new XMLHttpRequest();
  reqObj.overrideMimeType("application/json");
  reqObj.open('GET', fileName, true);
  reqObj.onreadystatechange = function () {
        if (reqObj.readyState == 4 && reqObj.status == "200") {
          callback(reqObj.responseText);
        }
  };
  reqObj.send(null);
}

function sortData(array){
  sortedArray = array;

  sortedArray.sort(function(a,b){
    if(a.value == b.value)
        return 0;
    if(a.value > b.value)
        return -1;
    if(a.value < b.value)
        return 1;
  });

  return sortedArray;
}

function sumData(array){
  var value = 0;

  for (i=0; i<array.length; i++){
    value += array[i]["value"];
  }

  return value;
}

function getCoordinatesForPercentage(percentage, pieWidth, pieCentre){
  var xCoord = (Math.cos(2 * Math.PI * percentage) * (pieWidth / 2)) + pieCentre;
  var yCoord = (Math.sin(2 * Math.PI * percentage) * (pieWidth / 2)) + pieCentre;
  return [xCoord, yCoord];
}

function findChartEndNum(dataEndNum){
  lengthofNum = dataEndNum.toString().length;
  divNum = 1;

  if (lengthofNum >= 2){
    divNum = Math.pow(10, (lengthofNum-1))
  }

  endNum = Math.ceil(dataEndNum / divNum) * divNum;
  return endNum;
}

function findSmallestValue(array){
  var value = array[0]["value"];

  for (i=0; i<array.length; i++){
    if (array[i]["value"] < value){
      value = array[i]["value"]
    }
  }

  return value;
}

function findBiggestValue(array){
  var value = array[0]["value"];

  for (i=0; i<array.length; i++){
    if (array[i]["value"] > value){
      value = array[i]["value"]
    }
  }

  return value;
}

function makeChart(chartData, chartInfo, selector){

  // console.log(chartData);
  // console.log(chartInfo);

  switch(chartInfo["chartType"]){
    case "bar":
      makeBarChart(chartData, chartInfo, selector);
      break;
    case "line":
      makeLineChart(chartData, chartInfo, selector);
      break;
    case "pie":
      makePieChart(chartData, chartInfo, selector);
      break;
    default:
      console.log("cannot find chart type");
      break;
  }
}

function makeBarChart(chartData, chartInfo, selector){
  chartData = sortData(chartData);

  var parentDiv = document.getElementById(selector);
  parentDiv.innerHTML = '';

  var containerWidth = parentDiv.offsetWidth;
  var containerHeight = parentDiv.offsetHeight;

  chartEndNum = findChartEndNum(chartData[0]["value"]);

  // skip link

  var mainSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mainSVG.setAttributeNS(null, 'width', (containerWidth ));
    mainSVG.setAttributeNS(null, 'height', (containerHeight));
    mainSVG.setAttributeNS(null, 'role', 'figure');

    var graphTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
      var graphTitleText = document.createTextNode("Accessible bar graph showing " + chartInfo["title"]);
    graphTitle.appendChild(graphTitleText);
      graphTitle.setAttribute('id', ("graphTitle"+selector));
  mainSVG.appendChild(graphTitle);

    var graphDesc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
      var graphDescText = document.createTextNode("Y axis showing " + (chartData.length) + " bars, X axis ranging from " + chartData[(chartData.length-1)]["value"] + " " + chartInfo["units"] + " to " + chartData[0]["value"] + " " + chartInfo["units"]);
    graphDesc.appendChild(graphDescText);
      graphDesc.setAttribute('id', ("graphDesc"+selector));
  mainSVG.appendChild(graphDesc);

  mainSVG.setAttributeNS(null, 'aria-labelledby', ("graphTitle"+selector+" "+"graphDesc"+selector));

    var background = document.createElementNS("http://www.w3.org/2000/svg","rect");
      background.setAttributeNS(null, 'width', (containerWidth));
      background.setAttributeNS(null, 'height', (containerHeight));
      background.setAttributeNS(null, 'fill', 'rgb(255,255,255)');

  mainSVG.appendChild(background);

    var axisGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      axisGroup.setAttributeNS(null, 'aria-hidden', "true");
      axisGroup.setAttribute('class', 'axisGroup');

      var xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xAxis.setAttributeNS(null, 'x1', (0.2*containerWidth));
        xAxis.setAttributeNS(null, 'y1', (0.8*containerHeight));
        xAxis.setAttributeNS(null, 'x2', (0.95*containerWidth));
        xAxis.setAttributeNS(null, 'y2', (0.8*containerHeight));
        xAxis.setAttributeNS(null, 'style', "stroke:rgb(211,211,211);stroke-width:1");
    axisGroup.appendChild(xAxis);
      var yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yAxis.setAttributeNS(null, 'x1', (0.2*containerWidth));
        yAxis.setAttributeNS(null, 'y1', (0.05*containerHeight));
        yAxis.setAttributeNS(null, 'x2', (0.2*containerWidth));
        yAxis.setAttributeNS(null, 'y2', (0.8*containerHeight));
        yAxis.setAttributeNS(null, 'style', "stroke:rgb(211,211,211);stroke-width:1");
    axisGroup.appendChild(yAxis);

  mainSVG.appendChild(axisGroup);

    var markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markerGroup.setAttributeNS(null, 'aria-hidden', "true");
      markerGroup.setAttribute('class', 'markerGroup');
      var zeroMarker = document.createElementNS("http://www.w3.org/2000/svg", "text");
        zeroMarker.setAttributeNS(null, 'x', (0.2*containerWidth));
        zeroMarker.setAttributeNS(null, 'y', (0.9*containerHeight));
        zeroMarker.setAttributeNS(null, 'text-anchor', 'middle');
        var zeroMarkerText = document.createTextNode("0");
      zeroMarker.appendChild(zeroMarkerText);
      markerGroup.appendChild(zeroMarker);
      var counter = 1;
      for (i=(chartEndNum/10); i<=chartEndNum; i+=(chartEndNum/10)){
        var marker = document.createElementNS("http://www.w3.org/2000/svg", "text");
          marker.setAttributeNS(null, 'x', ((0.2*containerWidth)+(0.075*counter*containerWidth)));
          marker.setAttributeNS(null, 'y', (0.9*containerHeight));
          marker.setAttributeNS(null, 'text-anchor', 'middle');
          var markerText = document.createTextNode(i);
        marker.appendChild(markerText);
        var markerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
          markerLine.setAttributeNS(null, 'x1', ((0.2*containerWidth)+(0.075*counter*containerWidth)));
          markerLine.setAttributeNS(null, 'y1', (0.05*containerHeight));
          markerLine.setAttributeNS(null, 'x2', ((0.2*containerWidth)+(0.075*counter*containerWidth)));
          markerLine.setAttributeNS(null, 'y2', (0.8*containerHeight));
          markerLine.setAttributeNS(null, 'style', "stroke:rgb(211,211,211);stroke-width:1");

        markerGroup.appendChild(marker);
        markerGroup.appendChild(markerLine);
        counter += 1;
      }

  mainSVG.appendChild(markerGroup);

    var barsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      barsGroup.setAttribute('class', 'barsGroup');
      barsGroup.setAttributeNS(null, 'role', 'list');
      barsGroup.setAttributeNS(null, 'aria-label', (chartData.length) + " bars showing " + chartInfo["title"]);

      var barsTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
        var barsTitleText = document.createTextNode((chartData.length) + " bars showing " + chartInfo["title"]);
      barsTitle.appendChild(barsTitleText);

    barsGroup.appendChild(barsTitle)

      for (i=0; i<chartData.length; i++){
        var singleBarGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          singleBarGroup.setAttributeNS(null, 'role', 'listitem');
          singleBarGroup.setAttributeNS(null, 'tabindex', 0);
          singleBarGroup.setAttributeNS(null, 'aria-label', ("Bar " + (i+1) + " of " + (chartData.length) + ", " + chartData[i]["name"] + ", value " + chartData[i]["value"] + " " + chartInfo["units"]));

          var singleBarText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            singleBarText.setAttributeNS(null, 'x', (0.05*containerWidth));
            singleBarText.setAttributeNS(null, 'y', (((0.05*containerHeight)+(i*((0.75*containerHeight)/(chartData.length))))+(0.375*((0.75*containerHeight)/(chartData.length)))));
            singleBarText.setAttributeNS(null, 'aria-hidden', "true");

            var singleBarTextNode = document.createTextNode(chartData[i]["name"]);
          singleBarText.appendChild(singleBarTextNode);

        singleBarGroup.appendChild(singleBarText);

          var singleBarRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            singleBarRect.setAttributeNS(null, 'x', (0.2*containerWidth));
            singleBarRect.setAttributeNS(null, 'y', (0.05*containerHeight)+(i*((0.75*containerHeight)/(chartData.length))));
            singleBarRect.setAttributeNS(null, 'width', ((chartData[i]["value"]/chartEndNum)*(0.75*containerWidth)));
            singleBarRect.setAttributeNS(null, 'height', (0.75*((0.75*containerHeight)/(chartData.length))));
            singleBarRect.setAttributeNS(null, 'fill', "#7562e0");

            var singleBarRectTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
              var singleBarRectTitleText = document.createTextNode("Bar " + (i+1) + " of " + (chartData.length) + ", " + chartData[i]["name"] + ", value " + chartData[i]["value"] + " " + chartInfo["units"]);
            singleBarRectTitle.appendChild(singleBarRectTitleText);

          singleBarRect.appendChild(singleBarRectTitle);

        singleBarGroup.appendChild(singleBarRect);

        barsGroup.appendChild(singleBarGroup);
      }

  mainSVG.appendChild(barsGroup);

  parentDiv.appendChild(mainSVG);
}

function makeLineChart(chartData, chartInfo, selector){

  var parentDiv = document.getElementById(selector);
  parentDiv.innerHTML = '';

  var containerWidth = parentDiv.offsetWidth;
  var containerHeight = parentDiv.offsetHeight;

  smallestValue = findSmallestValue(chartData);
  biggestValue = findBiggestValue(chartData);
  chartEndNum = findChartEndNum(biggestValue);

  // skip link

  var mainSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mainSVG.setAttributeNS(null, 'width', (containerWidth ));
    mainSVG.setAttributeNS(null, 'height', (containerHeight));
    mainSVG.setAttributeNS(null, 'role', 'figure');

    var graphTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
      var graphTitleText = document.createTextNode("Accessible line graph showing " + chartInfo["title"]);
    graphTitle.appendChild(graphTitleText);
      graphTitle.setAttribute('id', ("graphTitle"+selector));
  mainSVG.appendChild(graphTitle);

    var graphDesc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
      var graphDescText = document.createTextNode("X axis showing " + (chartData.length) + " points from " + chartData[0]["name"] + " to  " + chartData[(chartData.length)-1]["name"] + ", Y axis ranging from " + smallestValue + " " + chartInfo["units"] + " to " + biggestValue + " " + chartInfo["units"]);
    graphDesc.appendChild(graphDescText);
      graphDesc.setAttribute('id', ("graphDesc"+selector));
  mainSVG.appendChild(graphDesc);

  mainSVG.setAttributeNS(null, 'aria-labelledby', ("graphTitle"+selector+" "+"graphDesc"+selector));

    var background = document.createElementNS("http://www.w3.org/2000/svg","rect");
      background.setAttributeNS(null, 'width', (containerWidth));
      background.setAttributeNS(null, 'height', (containerHeight));
      background.setAttributeNS(null, 'fill', 'rgb(255,255,255)');

  mainSVG.appendChild(background);

    var axisGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      axisGroup.setAttributeNS(null, 'aria-hidden', "true");
      axisGroup.setAttribute('class', 'axisGroup');

      var xAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        xAxis.setAttributeNS(null, 'x1', (0.2*containerWidth));
        xAxis.setAttributeNS(null, 'y1', (0.8*containerHeight));
        xAxis.setAttributeNS(null, 'x2', (0.95*containerWidth));
        xAxis.setAttributeNS(null, 'y2', (0.8*containerHeight));
        xAxis.setAttributeNS(null, 'style', "stroke:rgb(211,211,211);stroke-width:1");
    axisGroup.appendChild(xAxis);
      var yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        yAxis.setAttributeNS(null, 'x1', (0.2*containerWidth));
        yAxis.setAttributeNS(null, 'y1', (0.05*containerHeight));
        yAxis.setAttributeNS(null, 'x2', (0.2*containerWidth));
        yAxis.setAttributeNS(null, 'y2', (0.8*containerHeight));
        yAxis.setAttributeNS(null, 'style', "stroke:rgb(211,211,211);stroke-width:1");
    axisGroup.appendChild(yAxis);

    //   var axisLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
    //     axisLabel.setAttributeNS(null, 'x', (0.05*containerWidth));
    //     axisLabel.setAttributeNS(null, 'y', (0.05*containerWidth));
    //     axisLabel.setAttributeNS(null, 'aria-hidden', "true");
    //     var axisLabelText = document.createTextNode(chartInfo["units"]);
    //   axisLabel.appendChild(axisLabelText);
    // axisGroup.appendChild(axisLabel);

  mainSVG.appendChild(axisGroup);

    var markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markerGroup.setAttributeNS(null, 'aria-hidden', "true");
      markerGroup.setAttribute('class', 'markerGroup');

      var zeroMarker = document.createElementNS("http://www.w3.org/2000/svg", "text");
        zeroMarker.setAttributeNS(null, 'x', (0.18*containerWidth));
        zeroMarker.setAttributeNS(null, 'y', (0.8*containerHeight));
        zeroMarker.setAttributeNS(null, 'text-anchor', 'end');
        zeroMarker.setAttributeNS(null, 'dominant-baseline', 'middle');
        var zeroMarkerText = document.createTextNode("0");
      zeroMarker.appendChild(zeroMarkerText);
    markerGroup.appendChild(zeroMarker);

    var counter = 4;
    for (i=(chartEndNum/5); i<=chartEndNum; i+=(chartEndNum/5)){
      var marker = document.createElementNS("http://www.w3.org/2000/svg", "text");
        marker.setAttributeNS(null, 'x', (0.18*containerWidth));
        marker.setAttributeNS(null, 'y', ((0.05*containerHeight)+(0.15*counter*containerHeight)));
        marker.setAttributeNS(null, 'text-anchor', 'end');
        marker.setAttributeNS(null, 'dominant-baseline', 'middle');
        var markerText = document.createTextNode(i);
      marker.appendChild(markerText);
      markerGroup.appendChild(marker);
      var markerLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        markerLine.setAttributeNS(null, 'x1', (0.2*containerWidth));
        markerLine.setAttributeNS(null, 'y1', ((0.05*containerHeight)+(0.15*counter*containerHeight)));
        markerLine.setAttributeNS(null, 'x2', (0.95*containerWidth));
        markerLine.setAttributeNS(null, 'y2', ((0.05*containerHeight)+(0.15*counter*containerHeight)));
        markerLine.setAttributeNS(null, 'style', "stroke:rgb(211,211,211);stroke-width:1");
      markerGroup.appendChild(markerLine);
      counter -= 1;
    }

  mainSVG.appendChild(markerGroup);

    var lineGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      lineGroup.setAttributeNS(null, 'aria-hidden', "true");
      lineGroup.setAttribute('class', 'lineGroup');

      for(i = 0; i<(chartData.length-1); i++){
        var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
          line.setAttributeNS(null, 'x1', ((0.2*containerWidth)+((0.75/(chartData.length-1))*i*containerWidth)));
          line.setAttributeNS(null, 'y1', ((((chartEndNum-chartData[i]["value"])/chartEndNum)*0.75*containerHeight)+(0.05*containerHeight)));
          line.setAttributeNS(null, 'x2', ((0.2*containerWidth)+((0.75/(chartData.length-1))*(i+1)*containerWidth)));
          line.setAttributeNS(null, 'y2', (((chartEndNum-chartData[(i+1)]["value"])/chartEndNum)*0.75*containerHeight)+(0.05*containerHeight));
          line.setAttributeNS(null, 'stroke', "#7562e0");
          line.setAttributeNS(null, 'stroke-width', "2");

        lineGroup.appendChild(line);
      }

  mainSVG.appendChild(lineGroup);

    var pointsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      pointsGroup.setAttribute('class', 'pointsGroup');
      pointsGroup.setAttributeNS(null, 'role', 'list');
      pointsGroup.setAttributeNS(null, 'aria-label', (chartData.length + " points, showing " + chartInfo["title"]))

      var pointsTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
        var pointsTitleText = document.createTextNode(chartData.length + " points, showing " + chartInfo["title"]);
        pointsTitle.appendChild(pointsTitleText);
    pointsGroup.appendChild(pointsTitle);

      for(i=0; i<chartData.length; i++){
        var singlePointGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          singlePointGroup.setAttributeNS(null, 'role', 'listitem');
          singlePointGroup.setAttributeNS(null, 'tabindex', 0);
          singlePointGroup.setAttributeNS(null, 'aria-label', ("Point " + (i+1) + " of " + chartData.length + ", " + chartData[i]["name"] + ", value " + chartData[i]["value"] + " " + chartInfo["units"]));

          var singlePointText = document.createElementNS("http://www.w3.org/2000/svg", "text");
            singlePointText.setAttributeNS(null, 'x', ((0.2*containerWidth)+((0.75/(chartData.length-1))*i*containerWidth)));
            singlePointText.setAttributeNS(null, 'y', (0.9*containerHeight));
            singlePointText.setAttributeNS(null, 'text-anchor', "middle");
            singlePointText.setAttributeNS(null, 'aria-hidden', "true");

            var singlePointTextNode = document.createTextNode(chartData[i]["name"]);
          singlePointText.appendChild(singlePointTextNode);

        singlePointGroup.appendChild(singlePointText);

          var singlePointDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            singlePointDot.setAttributeNS(null, 'cx', ((0.2*containerWidth)+((0.75/(chartData.length-1))*i*containerWidth)));
            singlePointDot.setAttributeNS(null, 'cy', ((((chartEndNum-chartData[i]["value"])/chartEndNum)*0.75*containerHeight)+(0.05*containerHeight)));
            singlePointDot.setAttributeNS(null, 'r', "2");
            singlePointDot.setAttributeNS(null, 'stroke', "#7562e0");
            singlePointDot.setAttributeNS(null, 'stroke-width', "3");
            singlePointDot.setAttributeNS(null, 'fill', "#7562e0");

            var singlePointDotTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
              var singlePointDotTitleText = document.createTextNode("Point " + (i+1) + " of " + chartData.length + ", " + chartData[i]["name"] + ", value " + chartData[i]["value"] + " " + chartInfo["units"]);
            singlePointDotTitle.appendChild(singlePointDotTitleText);

        singlePointGroup.appendChild(singlePointDot);

        pointsGroup.appendChild(singlePointGroup);
      }


  mainSVG.append(pointsGroup);

  parentDiv.appendChild(mainSVG);

  // make svg
    // desc tag
      // textnode
}

function makePieChart(chartData, chartInfo, selector){
  chartData = sortData(chartData);
  sumChartData = sumData(chartData);

  var parentDiv = document.getElementById(selector);
  parentDiv.innerHTML = '';

  var containerWidth = parentDiv.offsetWidth;
  var containerHeight = parentDiv.offsetHeight;

  var startPixelLegend = containerWidth - 200;
  var pieWidth = Math.min((containerWidth - 200), containerHeight) - 100; // 50 pixels margin either side
  var pieRadius = pieWidth / 2;
  var pieCentre = (pieWidth/2) + 50;
  console.log("pieCentre is " + pieCentre);
  console.log("pieRadius is " + pieRadius);

  // skip link

  var mainSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mainSVG.setAttributeNS(null, 'width', (containerWidth ));
    mainSVG.setAttributeNS(null, 'height', (containerHeight));
    mainSVG.setAttributeNS(null, 'role', 'figure');

    var graphTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
      var graphTitleText = document.createTextNode("Accessible pie chart showing " + chartInfo["title"]);
    graphTitle.appendChild(graphTitleText);
      graphTitle.setAttribute('id', ("graphTitle"+selector));
  mainSVG.appendChild(graphTitle);

    var graphDesc = document.createElementNS("http://www.w3.org/2000/svg", "desc");
      var graphDescText = document.createTextNode("Pie chart with " + chartData.length + " segments");
    graphDesc.appendChild(graphDescText);
      graphDesc.setAttribute('id', ("graphDesc"+selector));
  mainSVG.appendChild(graphDesc);

  mainSVG.setAttributeNS(null, 'aria-labelledby', ("graphTitle"+selector+" "+"graphDesc"+selector));

    var background = document.createElementNS("http://www.w3.org/2000/svg","rect");
      background.setAttributeNS(null, 'width', (containerWidth));
      background.setAttributeNS(null, 'height', (containerHeight));
      background.setAttributeNS(null, 'fill', 'rgb(255,255,255)');

  mainSVG.appendChild(background);

    var markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      markerGroup.setAttributeNS(null, 'aria-hidden', "true");
      markerGroup.setAttribute('class', 'markerGroup');

    for (i=0; i<chartData.length; i++){
      var legendEntryGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

        var colourRect = document.createElementNS("http://www.w3.org/2000/svg","rect");
          colourRect.setAttributeNS(null, 'x', startPixelLegend);
          colourRect.setAttributeNS(null, 'y', ((containerHeight/(chartData.length))*i)+20);
          colourRect.setAttributeNS(null, 'height', 10);
          colourRect.setAttributeNS(null, 'width', 10);
          colourRect.setAttributeNS(null, 'fill', colours[i]);

        legendEntryGroup.appendChild(colourRect);

        var legendText =  document.createElementNS("http://www.w3.org/2000/svg", "text");
          legendText.setAttributeNS(null, 'x', startPixelLegend+15);
          legendText.setAttributeNS(null, 'y', ((containerHeight/(chartData.length))*i)+20+5);
          legendText.setAttributeNS(null, 'text-anchor', 'start');
          legendText.setAttributeNS(null, 'dominant-baseline', 'middle');

          var legendTextNode = document.createTextNode(chartData[i]["name"]);

        legendText.appendChild(legendTextNode);

      legendEntryGroup.appendChild(legendText);

      markerGroup.appendChild(legendEntryGroup);
    }

  mainSVG.appendChild(markerGroup);

    var segmentsGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      segmentsGroup.setAttribute('class', 'segmentsGroup');
      segmentsGroup.setAttributeNS(null, 'role', 'list');
      segmentsGroup.setAttribute(null, 'aria-label', (chartData.length) + " segments showing " + chartInfo["title"])

      var segmentsTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
        var segmentsTitleText = document.createTextNode((chartData.length) + " segments showing " + chartInfo["title"]);
      segmentsTitle.appendChild(segmentsTitleText);

    segmentsGroup.appendChild(segmentsTitle);

      var piePercentIterator = 0; // TODO - these are not correct, they're just segment percentages
      var prevDatapointPercent = 0;
      var datapointPercent = 0;

      for (i=0; i<chartData.length; i++){

        console.log("for point" + i);
        var segmentPercent = chartData[i]["value"] / sumChartData;
        console.log("segmentPercent is " + segmentPercent);
        var segmentPercentRounded = Math.round(segmentPercent*100);

        prevDatapointPercent = (piePercentIterator*100) / sumChartData;

        piePercentIterator += segmentPercent;

        datapointPercent = (piePercentIterator*100) / sumChartData;

        var startArcPoint = getCoordinatesForPercentage(prevDatapointPercent, pieWidth, pieCentre);
        var endArcPoint = getCoordinatesForPercentage(datapointPercent, pieWidth, pieCentre);

        // TAKE OUT



        // END OF TAKE OUT
        console.log("prevDatapointPercent is " + prevDatapointPercent);
        console.log("datapointPercent is " + datapointPercent);
        console.log("startArcPoint is " + startArcPoint);
        console.log("endArcPoint is " + endArcPoint);

        var singleSegmentGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
          singleSegmentGroup.setAttributeNS(null, 'role', 'listitem');
          singleSegmentGroup.setAttributeNS(null, 'tabindex', 0);
          singleSegmentGroup.setAttributeNS(null, 'aria-label', ("Segment " + (i+1) + " of " + chartData.length + ", " + chartData[i]["name"] + ", value" + chartData[i]["value"] + " " + chartInfo["units"] + ", " + segmentPercentRounded + "%"));

          var singleSegmentPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            // singleSegmentPath.setAttributeNS(null, 'd', 'M16.7 60.8 A 35 35, 0, 0, 0, 78.3 70.6 L 50 50 Z'); // TODO
            singleSegmentPath.setAttributeNS(null, 'd', 'M ' + startArcPoint[0] + ' ' + startArcPoint[1] + ' A ' + pieRadius + ' ' + pieRadius + ', 0, 0, 1, ' + endArcPoint[0] + ' ' + endArcPoint[1] + ' L ' + pieCentre + ' ' + pieCentre + ' Z'); // TODO
            singleSegmentPath.setAttributeNS(null, 'fill', colours[i]);
            singleSegmentPath.setAttributeNS(null, 'stroke', '#fff');
            singleSegmentPath.setAttributeNS(null, 'stroke-width', 0.5);
            singleSegmentPath.setAttribute('class', 'segment');

            var singleSegmentTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
              var singleSegmentTitleText = document.createTextNode("Segment " + (i+1) + " of " + chartData.length + ", " + chartData[i]["name"] + ", value" + chartData[i]["value"] + " " + chartInfo["units"] + ", " + segmentPercentRounded + "%");
            singleSegmentTitle.appendChild(singleSegmentTitleText);

          singleSegmentPath.appendChild(singleSegmentTitle);

        singleSegmentGroup.appendChild(singleSegmentPath);

        segmentsGroup.appendChild(singleSegmentGroup);
      }

  mainSVG.appendChild(segmentsGroup);

  parentDiv.appendChild(mainSVG);
}

var accessibleGrapher = {
  makeAccessibleChart: function(selector, chartInfo) {

    loadJSONandMakeChart(chartInfo["fileName"], function(response) {
      var chartData = JSON.parse(response);
      makeChart(chartData, chartInfo, selector);
    });

  }
}


// NOT DONE YET
// - Viewbox on SVG?
// - Highlighting smallest and biggest values on any of the graphs (should be part of aria-label)
// - Highlighting general trend (should be part of graphDesc)
// - Different colours and patterns
// - Code needs to be wayyyy more modular i.e. start and end of graph square need to be global variables

// left to right - 0.2, 0.95
// top to bottom - 0.05, 0.8
