function testGrapher() {
  console.log("running this")
}

function makeRed(selector) {
  var theElement = document.getElementById(selector).style.color = "red"
}

function fillwithSVG(selector) {
  var theDiv = document.getElementById(selector);

  var width = document.getElementById(selector).offsetWidth;
  var height = document.getElementById(selector).offsetHeight;

  var newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  newSVG.setAttributeNS(null, 'width', (width / 2));
  newSVG.setAttributeNS(null, 'height', (height / 2));

  var newSquare = document.createElementNS("http://www.w3.org/2000/svg","rect");

  newSquare.setAttributeNS(null, 'width', (width / 2));
  newSquare.setAttributeNS(null, 'height', (height / 2));
  newSquare.setAttributeNS(null, 'fill', 'rgb(0,255,0)');
  newSquare.setAttributeNS(null, 'stroke', 'rgb(0,0,0)');
  newSquare.setAttributeNS(null, 'stroke-width', 3);


  newSVG.appendChild(newSquare);







  theDiv.appendChild(newSVG);

  // var newHeader = document.createElement("h2");
  // var newHeaderText = document.createTextNode("dynamically made header");
  // newHeader.appendChild(newHeaderText);
  //
  // theDiv.appendChild(newHeader);
}
