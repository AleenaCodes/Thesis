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
  console.log("loadJSON filename is " + fileName);

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', fileName, true);
  xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
          callback(xobj.responseText);
        }
  };
  xobj.send(null);
}

function sortData(array){
  array2 = array;

  array2.sort(function(a,b){
    if(a.value == b.value)
        return 0;
    if(a.value > b.value)
        return -1;
    if(a.value < b.value)
        return 1;
  });

  return array2;
}

function findChartEndNum(dataEndNum){
  lengthofNum = dataEndNum.toString().length;
  divNum = 1;

  if (lengthofNum > 2){
    divNum = Math.pow(10, (lengthofNum-1))
  }

  endNum = Math.ceil(dataEndNum / divNum) * divNum;
  return endNum;
}

function makeAccessibleChart(selector, chartInfo) {

  loadJSONandMakeChart(chartInfo["fileName"], function(response) {
    var chartData = JSON.parse(response);
    makeChart(chartData, chartInfo, selector);
  });

}

function makeChart(chartData, chartInfo, selector){

  // console.log(chartData);
  // console.log(chartInfo);

  switch(chartInfo["chartType"]){
    case "bar":
      makeBarChart(chartData, chartInfo, selector);
      break;
    default:
      console.log("cannot find chart type");
      break;
  }
}

function makeBarChart(chartData, chartInfo, selector){
  chartData = sortData(chartData);

  chartEndNum = findChartEndNum(chartData[0]["value"]);

  var parentDiv = document.getElementById(selector);

  var containerWidth = parentDiv.offsetWidth;
  var containerHeight = parentDiv.offsetHeight;

  // skip link

  var mainSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mainSVG.setAttributeNS(null, 'width', (containerWidth ));
    mainSVG.setAttributeNS(null, 'height', (containerHeight));
    mainSVG.setAttributeNS(null, 'role', 'figure');

    var graphTitle = document.createElementNS("http://www.w3.org/2000/svg", "title");
      var graphTitleText = document.createTextNode("Accessible graph showing " + chartInfo["title"]);
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
            singleBarText.setAttributeNS(null, 'x', (0.05*containerWidth)); // TODO
            singleBarText.setAttributeNS(null, 'y', (((0.05*containerHeight)+(i*((0.75*containerHeight)/(chartData.length))))+(0.375*((0.75*containerHeight)/(chartData.length))))); //TODO
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

        singleBarGroup.appendChild(singleBarRect);

        barsGroup.appendChild(singleBarGroup);
      }

  mainSVG.appendChild(barsGroup);

  parentDiv.appendChild(mainSVG);
}
