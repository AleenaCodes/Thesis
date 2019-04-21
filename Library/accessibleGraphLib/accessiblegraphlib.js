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

  console.log("running bar function");

  var parentDiv = document.getElementById(selector);

  var width = parentDiv.offsetWidth;
  var height = parentDiv.offsetHeight;

  // skip link

  var mainSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mainSVG.setAttributeNS(null, 'width', (width ));
  mainSVG.setAttributeNS(null, 'height', (height));

  // give role figure
  // giveId?
  // make title and desc of the SVG
  // give aria-labelledby of title and desc

  var background = document.createElementNS("http://www.w3.org/2000/svg","rect");
  background.setAttributeNS(null, 'width', (width));
  background.setAttributeNS(null, 'height', (height));
  background.setAttributeNS(null, 'fill', 'rgb(255,255,255)');

  mainSVG.appendChild(background);

  // make axis lines group
    // make aria-hidden
    // add in axis lines - remember to leave space! (5%?)

  // make marker lines group
  // loop   to make text and marker lines - space out among graph space

  // make bars group
    // give role of list
    // give aria-label
    // loop to make each bar group
      // give role listitem
      // give tabindex=0
      // give aria-label
      // text with name
      // rect of right width
        // title (same as aria-label)

  parentDiv.appendChild(mainSVG);
}
