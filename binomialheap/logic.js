// binomial heap implamintation
'use strict';

/**
 * Creates a binomial heap.
 *
 * @constructor
 * @param {function} customCompare An optional custom node comparison
 * function.
 */
var BinomialHeap = function (customCompare) {
    this.head = undefined;
    this.nodeCount = 0;

    if (customCompare) {
        this.compare = customCompare;
    }
};

/**
 * Clears the heap's data, making it an empty heap.
 */
BinomialHeap.prototype.clear = function () {
    this.head = undefined;
    this.nodeCount = 0;
};

/**
 * Extracts and returns the minimum node from the heap.
 *
 * @return {Node} node The heap's minimum node or undefined if the heap is
 * empty.
 */
BinomialHeap.prototype.extractMinimum = function () {
    if (!this.head) {
        return undefined;
    }

    var operation = [];
    operation.push("extract min");
    if(step >= heap_step.length)
        heap_step.push(operation);
    else
        heap_step[step] = operation;
    step++;

    var min = this.head;
    var minPrev;
    var next = min.sibling;
    var nextPrev = min;
    var node_count = 1;

    while (next) {
        if (this.compare(next, min) < 0) {
            min = next;
            minPrev = nextPrev;
        }
        nextPrev = next;
        next = next.sibling;
        ++node_count;
    }
    hiliteNode(min.id, yellow);
    removeTreeRoot(this, min, minPrev);
    this.nodeCount--;
    return min;


};

/**
 * Returns the minimum node from the heap.
 *
 * @return {Node} node The heap's minimum node or undefined if the heap is
 * empty.
 */
BinomialHeap.prototype.findMinimum = function () {
    if (typeof this.head === 'undefined') {
        return undefined;
    }

    var min = this.head;
    var next = min.sibling;

    while (next) {
        if (this.compare(next, min) < 0) {
            min = next;
        }
        next = next.sibling;
    }

    return min;
};

/**
 * Inserts a new key-value pair into the heap.
 *
 * @param {Object} key The key to insert.
 * @param {Object} value The value to insert.
 * @return {Node} node The inserted node.
 */
BinomialHeap.prototype.insert = function (key, value) {
    var operation = [];


    operation.push("insert");
    operation.push(value);
    if(step >= heap_step.length)
        heap_step.push(operation);
    else
        heap_step[step] = operation;
    step++;
    var tempHeap = new BinomialHeap();
    var newNode = new Node(key, value);
    var newtreenode = addNode(root, value, false, false);
    newNode.id = _curNodeID;
    newNode.key = newtreenode;
    tempHeap.head = newNode;
    tempHeap.nodeCount++;
    this.union(tempHeap, true);
    return newNode;
};

/**
 * @return {boolean} Whether the heap is empty.
 */
BinomialHeap.prototype.isEmpty = function () {
    return !this.head;
};

/**
 * @return {number} The size of the heap.
 */
BinomialHeap.prototype.size = function () {
    return this.nodeCount;
};

/**
 * Joins another heap to this one.
 *
 * @param {BinomialHeap} otherHeap The other heap.
 */
BinomialHeap.prototype.union = function (heap, from= false) {
    this.nodeCount += heap.nodeCount;

    var newHead = mergeHeaps(this, heap);

    this.head = undefined;
    heap.head = undefined;

    if (!newHead) {
        return undefined;
    }

    var prev;
    var curr = newHead;
    var next = newHead.sibling;
    duration_merge = 700;
    while (next) {
        if (curr.degree !== next.degree ||
            (next.sibling && next.sibling.degree === curr.degree)) {
            prev = curr;
            curr = next;

        } else if (this.compare(curr, next) < 0) {
            curr.sibling = next.sibling;

            linkTrees(curr, next);
            if(from){
                merge_visualization(curr, next);
            }

        } else {
            if (typeof prev === 'undefined') {
                newHead = next;
            } else {
                prev.sibling = next;
            }
            if(from)
            {
                merge_visualization(next, curr);
            }
            linkTrees(next, curr);
            curr = next;
        }

        next = curr.sibling;


    }

    this.head = newHead;
    // Visualization_Merge();
};

/**
 * Compares two nodes with each other.
 *
 * @private
 * @param {Object} a The first key to compare.
 * @param {Object} b The second key to compare.
 * @return {number} -1, 0 or 1 if a < b, a == b or a > b respectively.
 */
BinomialHeap.prototype.compare = function (a, b) {
    if (a.value > b.value) {
        return 1;
    }
    if (a.value < b.value) {
        return -1;
    }
    return 0;
};



/**
 * Merges two heaps together.
 *
 * @private
 * @param {Node} a The head of the first heap to merge.
 * @param {Node} b The head of the second heap to merge.
 * @return {Node} The head of the merged heap.
 */
function mergeHeaps(a, b) {
    if (typeof a.head === 'undefined') {
        return b.head;
    }
    if (typeof b.head === 'undefined') {
        return a.head;
    }


    var head;
    var aNext = a.head;
    var bNext = b.head;

    if (a.head.degree <= b.head.degree) {
        head = a.head;
        aNext = aNext.sibling;

    } else {
        head = b.head;
        bNext = bNext.sibling;
    }
    var tail = head;

    while (aNext && bNext) {
        if (aNext.degree <= bNext.degree) {
            tail.sibling = aNext;
            aNext = aNext.sibling;
        } else {
            tail.sibling = bNext;
            bNext = bNext.sibling;
        }

        tail = tail.sibling;
    }

    tail.sibling = aNext ? aNext : bNext;

    return head;
}

/**
 * Link two binomial trees of the same order.
 *
 * @private
 * @param {Node} minNodeTree The head of the first tree to link.
 * @param {Node} other The head of the second tree to link.
 */
function linkTrees(minNodeTree, other) {
    other.parent = minNodeTree;
    other.sibling = minNodeTree.child;
    minNodeTree.child = other;
    minNodeTree.degree++;
}

/**
 * Link two binomial trees of the same order.
 *
 * @private
 * @param {Node} minNodeTree The head of the first tree to link.
 * @param {Node} other The head of the second tree to link.
 */
function removeTreeRoot(heap, root, prev) {
    // Remove root from the heap
    if (root === heap.head) {
        heap.head = root.sibling;
    } else {
        prev.sibling = root.sibling;
    }

    // Reverse the order of root's children and make a new heap
    var newHead;
    var child = root.child;
    while (child) {
        var next = child.sibling;
        child.sibling = newHead;
        child.parent = undefined;
        newHead = child;
        child = next;
    }
    var newHeap = new BinomialHeap();
    newHeap.head = newHead;

    heap.union(newHeap,false);
}

const search = (current, value) => {
    let result = null;

    if (current.value === value) return current;

    if (current.child && !result) {
        result = search(current.child, value);
    }
    if (current.sibling && !result) {
        result = search(current.sibling, value);
    }

    return result;
};

BinomialHeap.prototype.decreaseKey = function(value, newKey, from = true) {
    const element = search(this.head, value);
    var operation = [];
    operation.push("decrease key");
    operation.push(value);
    operation.push(newKey);
    if(step >= heap_step.length)
        heap_step.push(operation);
    else
        heap_step[step] = operation;
    step++;

    if (!element) return;
    if (newKey > element.value) return;
    hiliteNode(element.id,indigo);
    element.value = newKey;
    d3.select("#node_" + element.id).select("text").text(newKey);
    let current = element;
    let parent = current.parent;
    duration_swap = 1000;
    var prev_id = current;

    while (parent && current.value < parent.value) {
        var tempKey = current.value;
        current.value = parent.value;
        parent.value = tempKey;


        swapNamesVisual(parent,current);
        var tempKey = current.key;
        current.key = parent.key;
        parent.key = tempKey;

        var prev_id = current;


        current = parent;
        parent = parent.parent;


    }
};

BinomialHeap.prototype.delete = function(value) {
    const element = search(this.head, value);
    var operation = [];
    operation.push("insert");
    operation.push(value);
    if(step >= heap_step.length)
        heap_step.push(operation);
    else
        heap_step[step] = operation;
    step++;
    this.decreaseKey(value, -Infinity );
    setTimeout(function () {
        /**this.extractMinimum();
         root.children = [];
         print(root, heap.head, true, true);
         **/
        extract_min_visualization();
    },(duration_swap+1000)*speed);

};

BinomialHeap.prototype.searchKey = function(value) {
    return search(this.head, value);
};



/**
 * Creates a Binomial Heap node.
 *
 * @constructor
 * @param {Object} key The key of the new node.
 * @param {Object} value The value of the new node.
 */
function Node(key, value) {
    this.key = key;
    this.value = value;
    this.degree = 0;
    this.parent = undefined;
    this.child = undefined;
    this.sibling = undefined;
    this.id = 1;
}

var green =  "#58ec5d";
var yellow =  "#3bb2ff";
var cyan =  "#3bb2ff";
var indigo =  "#6610f2";
var purple =  "#6f42c1";
var pink =  "#e83e8c";
var red =  "#E74C3C";

var step = 0;
var heap_step = [];

// visualization
var w = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth;

var h = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight;

var duration_merge =  0;

var width = w - 300,
    height = h - 100;

var _curNodeID = 1,
    _curLinkID = 1,
    _rightPathId = 1,
    duration = 800,
    pause = 0,
    root;

var tree = d3.layout.tree()
    .size([width, height]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#svg_div").append("svg")
    .attr("height", height)
    .attr("width", width)
    .append("g")
    .attr("transform", "translate(" + 0 + "," + 50 + ")");
root = {};
root.x0 = - width / 2;
root.y0 = 0;

var heap = new BinomialHeap();
var a = heap.insert(2,2);
var b = heap.insert(8,8);
var val = 19;
function build_heap() {
    print(root, heap.head);
}


function clear_visualization() {
    heap.clear();
    root.children = [];
    update(root);
}

function print(curr_node, heap_node, gotosibling = true, after_extract = false) {
    var first_node = addNode(curr_node, heap_node.value, false, after_extract);
    heap_node.id = _curNodeID;
    heap_node.key = first_node;

    if(heap_node.child != null)
    {
        print(first_node, heap_node.child, true, after_extract);
    }
    if(gotosibling)
    {
        if (heap_node.sibling != null) {
            print(curr_node, heap_node.sibling, true, after_extract);
        }
    }
}
var visualization = [];

var duration_swap = 1000;
var speed = 1;
var zoom = d3.behavior.zoom();


var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
}

function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
    d3.select(this).classed("dragging", false);
}

var rightSource = rightRecopyRoot,
    rightTarget = rightRecopyRoot;

svg.insert("path", "g")
    .attr("class", "r_link")
    .attr("id", "r_link_" + ++_rightPathId);


function insert_visualization() {
    var value = parseInt(document.getElementById('insert_input').value, 10);
    var curr_node = heap.insert(value,  value);
}

function step_back() {
    var curr_step = --step;
    heap.clear();
    root.children = [];
    update(root);

    var pause = 0;
    speed = 0;
    step = 0;
    for(var i = 0; i < curr_step; ++i)
    {
        if(heap_step[i][0] == "insert")
        {
            heap.insert(heap_step[i][1],heap_step[i][1]);
            pause += duration_merge;

        }
        if(heap_step[i][0] == "delete")
        {
            curr_heap.delete(heap_step[i][1]);
        }
        if(heap_step[i][0] == "extract min")
        {
            heap.extractMinimum();
        }
        if(heap_step[i][0] == "decrease key")
        {
            heap.decreaseKey(heap_step[i][1],heap_step[i][2]);
        }

    }
    speed = 1;


}

function step_forward() {
    var curr_step = ++step;
    heap.clear();
    root.children = [];
    update(root);

    var pause = 0;
    speed = 0;
    step = 0;
    for(var i = 0; i < curr_step; ++i)
    {

        if(heap_step[i][0] == "insert")
        {
            heap.insert(heap_step[i][1],heap_step[i][1]);
            pause += duration_merge;

        }
        if(heap_step[i][0] == "delete")
        {
            curr_heap.delete(heap_step[i][1]);
        }
        if(heap_step[i][0] == "extract min")
        {
            heap.extractMinimum();
        }
        if(heap_step[i][0] == "decrease key") {
            heap.decreaseKey(heap_step[i][1], heap_step[i][2]);
        }

    }
    speed = 1;


}

function find_min_visualization() {
    var curr_node = heap.findMinimum();
    hiliteNode(curr_node.id, indigo);
    setTimeout(function () {
        hiliteNode(curr_node.id, "#fff");
    },duration*speed);
}

function insert_back(value) {
    heap.delete(value);
    root.children = [];
    print(root, heap.head, true, true);
}

function delete_back(value) {
    heap.insert(value,value);
    root.children = [];
    print(root, heap.head, true, true);
}



function merge_visualization(firstNode, secondNode) {
    var fnode = root.children[root.children.indexOf(firstNode.key)];
    setTimeout(function () {
        hiliteNode(firstNode.id,yellow);
        hiliteNode(secondNode.id,yellow);
    }, duration_merge*speed);
    duration_merge+=550;
    setTimeout(function () {
        hiliteNode(firstNode.id,green);

    }, duration_merge*speed);
    duration_merge+=350;
    setTimeout(function () {
        root.children.splice(root.children.indexOf(secondNode.key),1);
        hiliteNode(firstNode.id,"#fff");
        hiliteNode(secondNode.id,"#fff");
        update(root);

    }, duration_merge*speed);
    duration_merge+=100;
    setTimeout(function () {
        print(firstNode.key, secondNode, false);

    }, duration_merge*speed);
    duration_merge+=1500;

}

function extract_min_visualization() {
    var min = heap.extractMinimum();

    setTimeout(function () {
        root.children = [];
        print(root, heap.head, true, true);
    },duration*speed);
}
function delete_visualization() {
    var operation = [];
    operation.push("delete");
    operation.push(value);
    heap_step.push(operation);
    var value = parseInt(document.getElementById('delete_input').value, 10);
    var min = heap.delete(value);
}

function decrease_key_vis() {
    var key = parseInt(document.getElementById('key_input').value, 10);
    var value = parseInt(document.getElementById('new_value_input').value, 10);
    heap.decreaseKey(key,value);
}
function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse();
    nodes.pop();
    var   links = tree.links(nodes);


    // Normalize for fixed-depth.
    nodes.forEach(function(d) { d.y = d.depth * 60; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
        .data(nodes, function (d) { return d.id || (d.id = ++_curNodeID); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("id", "node_" + _curNodeID)
        .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; });

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) { return d.isRoot? "#ddd" : "#fff" });

    nodeEnter.append("text")
        .attr("y", function(d) { return d.isRoot? -30 : 0 ;})
        .attr("dy", ".4em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1e-6)
        .style("font-weight", function(d) { return d.isRoot? "bold" : "";});

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
        .duration(duration)
        .delay(pause)
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    nodeUpdate.select("circle")
        .attr("r", 18);

    nodeUpdate.select("text")
        .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit()
        .transition()
        .duration(duration)
        .delay(pause)
        .attr("transform", function (d) { return "translate(" + source.x + "," + source.y + ")"; })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
        .data(links, function(d) { return d.target.id; });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("id", function (d) { return "link_" + d.target.id; })
        .attr("d", function(d) {
            var o = {x: source.x0, y: source.y0};
            return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .delay(pause)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit()
        .transition()
        .duration(duration)
        .delay(pause)
        .attr("d", function (d) {
            var o = { x: source.x, y: source.y };
            return diagonal({ source: o, target: o });
        })
        .remove();

    svg.selectAll("path.r_link")
        .transition()
        .duration(duration)
        .delay(pause)
        .attr("d", function (d) {
            var s = { x: rightSource.x, y: rightSource.y };
            var t = { x: rightTarget.x, y: rightTarget.y };
            return diagonal({ source: s, target: t });
        });

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

function addNode(current_node, name, isRoot, firstorlast = false) {
    var myJSONObject = {"name": name,"children": [], "isRoot": isRoot};

    if (current_node.children == null) {
        current_node.children = [];
    }
    if (!firstorlast)
    {
        current_node.children.unshift(myJSONObject);
    } else {
        current_node.children.push(myJSONObject);
    }
    update(current_node);

    return myJSONObject;
}

function merge_node(firstNode, secondNode) {
    print(firstNode.key,secondNode);
}

function hiliteNode(id, color)
{
    d3.select("#node_" + id).select("circle").
    style("fill", color);
}

function hideNode(id) {
    d3.select("#node_" + id)
        .select("text")
        .fontcolor("#fff");
}

function swapNamesVisual(first, second) {


    setTimeout(function () {
        hiliteNode(second.parent.id, cyan);
        hiliteNode(second.id, cyan);
        var parent_node = d3.select("#node_" + second.parent.id);
        var p_x = parent_node.x;
        var p_y = parent_node.y0;
        var c_x, c_y;
        d3.selectAll("#node_" + second.parent.id).each(function(d) {
            p_x = d.x;
            p_y = d.y;
        });
        d3.selectAll("#node_" + second.id).each(function(d) {
            c_x = d.x;
            c_y = d.y;
        });
        d3.select("#node_" + second.id)
            .transition()
            .duration(duration )
            .delay(duration)
            .attr('transform', function(d){
                return "translate(" + p_x + ', ' + p_y + ')'
            });
        d3.select("#node_" + second.parent.id)
            .transition()
            .duration(duration - 280)
            .delay(duration - 280)
            .attr('transform', function(d){
                return "translate(" + c_x + ', ' + c_y + ')'
            });
        setTimeout(function () {
            var tmp = d3.select("#node_" + second.id).text();
            d3.select("#node_" + second.id).select("text").text(d3.select("#node_" + second.parent.id).select("text").text()) ;
            d3.select("#node_" + second.parent.id).select("text").text(tmp);
            update(root);
            hiliteNode(second.parent.id, "#fff");
            hiliteNode(second.id, "#fff");

        }, (duration + 100)*speed);
    }, (duration_swap)*speed);
    duration_swap += 1000;


    /**setTimeout(function () {
            var tmp = d3.select("#node_" + first.id).text();
            d3.select("#node_" + first.id).select("text").text(d3.select("#node_" + second.id).select("text").text()) ;
            d3.select("#node_" + second.id).select("text").text(tmp);
        }, 700);**/


}


function sleep(miliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > miliseconds){
            break;
        }
    }
}

function change_speed(){
    if(document.getElementById('animation_speed').selectedIndex == 0)
        speed = 1;
    if(document.getElementById('animation_speed').selectedIndex == 1)
        speed = 0.5;
    if(document.getElementById('animation_speed').selectedIndex == 2)
        speed = 0.75;
    if(document.getElementById('animation_speed').selectedIndex == 3)
        speed = 1.25;
    if(document.getElementById('animation_speed').selectedIndex == 0)
        speed = 1.5;

}

function change_step_mode() {
    if(speed == 0)
    {
        speed = 1;
        document.getElementById('mode_changer').textContent = "Step mode on";
        document.getElementById('mode_changer').className = "btn btn-primary";
    }
    else {
        speed = 0;
        document.getElementById('mode_changer').textContent = "Step mode off";
        document.getElementById('mode_changer').className = "btn btn-danger";
    }

}
