console.log('Pencil loaded..')


// SCSC paper.js loooks good

// Defining the origin
var origin = new Point(view.center);

// To h=think about the act now. 
// At every child, examine the greatest grandchild and add it to the child origin vector to get the max distance.
// Repeat the process recursively.
// Finally we get the weighted array at each node to render the design.
// For experimentation we gotta setup a discrete branching network.
/*
Lets bui;d this
*/


var gc1 = {
  "data": "gc1",
  "children": [],
  "weight": Math.floor(Math.random() * 10)

}

var gc2 = {
  "data": "gc2",
  "children": []
  ,
  "weight": Math.floor(Math.random() * 10)

}
var gc3 = {
  "data": "gc3",
  "children": [],
  "weight": Math.floor(Math.random() * 10)
}
var gc4 = {
  "data": "gc4",
  "children": [],
  "weight": Math.floor(Math.random() * 10)

}
var gc5 = {
  "data": "gc5",
  "children": [],
  "weight": Math.floor(Math.random() * 10)
}

var child1 = {
  "data": "child1",
  "children": [
    gc2,
    gc1
  ],
  "weight": Math.floor(Math.random() * 10)
}

var child2 = {
  "data": "child2",
  "children": [
    gc2,
    gc3,
    gc4
  ],
  "weight": Math.floor(Math.random() * 10)

}

var child3 = {
  "data": "child3",
  "children": [
    gc4,
    gc5,
  ],
  "weight": Math.floor(Math.random() * 10)

}

var child4 = {
  "data": "child4",
  "children": [
    gc1
  ],
  "weight": Math.floor(Math.random() * 10)

}


var ParentNode = {
  "data": "Parent",
  "children": [
    child1,
    child2,
    child3,
    child4
  ],
  "weight": Math.floor(Math.random() * 10)
}

// Weighing child 
var weigh = function (node) {

  if (node.children.length == 0) {
    return 1;
  }
  var sum = 1;
  for (var index = 0; index < node.children.length; index++) {
    sum += weigh(node.children[index]);
  }
  return sum;
};

// Printing labels
var printText = function (color, location, text) {
  var texty = new PointText(location);
  texty.justification = 'center';
  texty.fillColor = color;
  texty.content = text;
}

var parent = true;

// Main guy - recursively draw all children
var drawChildren = function (node, ori, startVector) {

  // Initial start vector direction 
  var starter = new Path();
  starter.insert(0, ori);
  starter.insert(0, startVector);
  starter.strokeColor = 'green'

  // Array of immediate neighbors
  var childs = [];
  for (var c = 0; c < node.children.length; c++) {
    childs.push({
      "node": node.children[c],
      "weight": weigh(node.children[c])
    })
    console.log(node.children[c].data + " - " + weigh(node.children[c]));
  }

  if (childs.length) {
    // Central angle
    var CALC = 0;
    for (var i = 0; i < childs.length; i++) {
      CALC += childs[i].weight;
    }


    // The new path object with color black
    var path = new Path();
    path.strokeColor = 'orange';
    path.strokeWidth = 5


    // Initial branch
    var vector = startVector - ori;
    vector = vector.normalize();
    vector = vector * 60;
    vector += ori;



    // Angle boundary vectors
    var abv = new Path();
    abv.strokeColor = 'purple';
    abv.insert(0, ori);

    if (!parent) {
      CALC = 360 / (CALC + 1);
      vector = vector.rotate(CALC / 2, ori);
      abv.insert(0, vector);
      abv.insert(0, ori);
    } else {
      CALC = 360 / (CALC);
      parent = false;
    }

    for (var i = 0; i < childs.length; i++) {

      vector = vector.rotate(CALC * childs[i].weight / 2, ori);
      var lvector = vector - ori;
      lvector = lvector * childs[i].weight;
      lvector = lvector + ori;
      path.insert(0, ori);
      path.insert(1, lvector);
      var firstChild = new Path.Circle(lvector, 30);
      firstChild.fillColor = 'red';
      printText('white', lvector, node.children[i].data)
      if (node.children[i].children && node.children[i].children.length != 0) {
        drawChildren(node.children[i], lvector, ori);
      }
      vector = vector.rotate(CALC * childs[i].weight / 2, ori);
      abv.insert(0, vector);
      abv.insert(0, ori);
    }

  }
  // Central node
  var centralNode = new Path.Circle(ori, 20);
  centralNode.fillColor = 'black';
  printText('white', ori, node.data)
}

drawChildren(ParentNode, origin, new Point(origin.x, origin.y + 100));

var protractor = function (vetor1, vector2, ori) {
  var arm1 = vector1 - ori;
  var arm2 = vector2 - ori;
  if (arm1.angle > arm2.angle) {
    return
  }
}
