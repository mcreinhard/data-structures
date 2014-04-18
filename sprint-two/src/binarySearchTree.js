var makeBinarySearchTree = function(value){
  var newBST = {};
  _.extend(newBST, BSTMethods);
  newBST.value = value;
  newBST.left = null;
  newBST.right = null;
  newBST.parent = null;
  newBST._maxDepth = undefined;
  newBST._minDepth = undefined;
  return newBST;
};

var BSTMethods = {};

BSTMethods.insert = function(value){
  var target;
  if (value < this.value) {
    target = "left";
  } else if (value > this.value) {
    target = "right";
  } else {
    return;
  }
  if (this[target] === null) {
    this[target] = makeBinarySearchTree(value);
    this[target].parent = this;
  } else {
    this[target].insert(value);
  }
  this._maxDepth = undefined;
  this._minDepth = undefined;
  while(this.maxDepth() > 2 * this.minDepth() && this.rebalance());
};

BSTMethods.contains = function(target){
  if (this.value === target) {
    return true;
  } else {
    return (this.left && this.left.contains(target)) ||
      (this.right && this.right.contains(target)) ? true : false;
  }
};

BSTMethods.depthFirstLog = function(func) {
  func(this.value);
  if (this.left) {
    this.left.depthFirstLog(func);
  }
  if (this.right) {
    this.right.depthFirstLog(func);
  }
};

BSTMethods.breadthFirstLog = function(func, depthToLog, currentDepth) {
  if (depthToLog === undefined) {
    for (var i = 0; i <= this.maxDepth(); i++) {
      this.breadthFirstLog(func, i, 0);
    }
  } else {
    if (currentDepth >= depthToLog) {
      func(this.value);
    } else {
      if (this.left) {
        this.left.breadthFirstLog(func, depthToLog, currentDepth + 1);
      }
      if (this.right) {
        this.right.breadthFirstLog(func, depthToLog, currentDepth + 1);
      }
    }
  }
}

BSTMethods.maxDepth = function() {
  if (this._maxDepth === undefined) {
    if (!this.left && !this.right) {
      this._maxDepth = 0;
    } else if (!this.left) {
      this._maxDepth = 1 + this.right.maxDepth();
    } else if (!this.right) {
      this._maxDepth = 1 + this.left.maxDepth();
    } else {
      this._maxDepth = 1 + Math.max(this.left.maxDepth(), this.right.maxDepth());
    }
  }
  return this._maxDepth;
}

BSTMethods.minDepth = function() {
  if (this._minDepth === undefined) {
    if (!this.left && !this.right) {
      this._minDepth = 0;
    } else if (!this.left || !this.right) {
      this._minDepth = 1;
    } else {
      this._minDepth = 1 + Math.min(this.left.minDepth(), this.right.minDepth());
    }
  }
  return this._minDepth;
}

    
BSTMethods.rebalance = function() {
  var changed = false;
  if (this.left) {
    if (this.left.rebalance()) changed = true;
  }
  if (this.right) {
    if (this.right.rebalance()) changed = true;
  }
  var leftDepth = this.left ? this.left.maxDepth() + 1 : 0;
  var rightDepth = this.right ? this.right.maxDepth() + 1 : 0;
  if (leftDepth >= rightDepth + 2) {
    this.rotate('right');
    changed = true;
  } else if (rightDepth >= leftDepth + 2) {
    this.rotate('left');
    changed = true;
  }
  return changed;
}

BSTMethods.rotate = function(direction) {
  var parent = this;
  var opposite = direction === "left" ? "right" : "left";
  var newNode = makeBinarySearchTree(this.value);
  newNode[opposite] = this[opposite][direction];
  newNode[direction] = this[direction];
  newNode.parent = this;
  this.value = this[opposite].value;
  this._maxDepth = undefined;
  this._minDepth = undefined;
  this[opposite] = this[opposite][opposite];
  this[direction] = newNode;
  if (this[opposite]) this[opposite].parent = this;
  if (this[direction][opposite]) {
    this[direction][opposite].parent = this[direction];
  }
  if (this[direction][direction]) {
    this[direction][direction].parent = this[direction];
  }
}

BSTMethods.log = function() {
  var lines = [];
  for (var i = 0; i <= 2 * this.maxDepth(); i++) {
    lines.push("");
  }
  var depth = 0;
  var helper = function(node) {
    if (node.left) {
      depth += 2;
      helper(node.left);
      depth -= 2;
    }
    var whitespace = "";
    for (var j = 0; j < node.value.toString().length - 1; j++) {
      whitespace += " ";
    }
    lines[depth] += node.value.toString();
    if (depth > 0) {
      lines[depth-1] += (node === node.parent.left ?
                         whitespace + "/" : "\\" + whitespace);
    }
    for (var i = 0; i < lines.length; i++) {
      if (i !== depth && i !== depth - 1) {
        lines[i] += whitespace + " ";
      }
    }
    if (node.right) {
      depth += 2;
        helper(node.right);
      depth -= 2;
    }
  }
  helper(this);
  console.log(lines.join("\n"));
}

