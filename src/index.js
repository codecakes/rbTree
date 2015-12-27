/**
 * @param {Type}
 * @return {Type}
 */

/**
 * Implementation of Left-Leaning Red-Black Balanced Binary Search Tree in a Symbol Table ADT.
 * The basic Symbol Table APIs are given.
 *
 * Additional BST operations that will take ~O(lgN) time:
 *  insert
 *  delete
 *  balance the tree
 *  Rotate left/right.
 *
 *
 */

"use strict";

let
    div = function div(num, den) {
        return Math.floor(num/den);
    },

    nodeLeftPos = function nodeLeftPos (index) {
        // node count starts from 0; index is key or position in array;
        return 2*(index) + 1;

    },

    nodeRightPos = function nodeRightPos (index) {
        // node count starts from 0; index is key or position in array;
        return (2*index)+2;

    },

    isRightChild = function isRightChild(parent, node) {
        return nodeRightPos(parent.key) === node.key;
    },

    isLeftChild = function isLeftChild(parent, node) {
        return nodeLeftPos(parent.key) === node.key;
    },

    nodeParent = function nodeParent(index) {
        return div( index-1,2 ) ;
    },

    createNode = function createNode(val, key) {
        // Each Node has 2 children and a parent. parent maybe null if its itself a parent node;
        var Node = {
            init: function init (val) {
                this.val = val;
                this.key = key;
                // null by default
                this.parent = null;
                this.leftChild=undefined;
                this.rightChild = undefined;
                this.count = 1;
                // true by default- red link is coming from parent, null if root
                this.red = true;
            },
        },
        initNode = Object.create(Node);
        initNode.init(val);
        return initNode;
    },

    isRed = function isRed(node) {
            // check if the parent link is red
            return !!node? node.red === true: false;
    },

    size = function size(node) {
        // Size of current node including everything in the subtree
        let
            stack=[node],
            sizeCount=0;

        while (stack.length > 0) {
            node = stack.pop();
            sizeCount++;

            if (node.leftChild) {
                stack.unshift(node.leftChild);
            }
            if (node.rightChild) {
                stack.unshift(node.rightChild);
            }
        }
        // node.count = sizeCount;
        return sizeCount;
    },

    treeSize = function treeSize(N) {
            // Calculate Size of current node and size of each subnode in the subtree
            // with the side-effect of adding right key value per node
            let
                node = N,
                key = node.key,
                stack = [node];

            while ( stack.length > 0 ) {
                node = stack.pop();
                key = node.key;
                node.count = size(node);

                if (node.leftChild) {
                    node.leftChild.key = nodeLeftPos(key);
                    stack.unshift( node.leftChild );
                }
                if (node.rightChild) {
                    node.rightChild.key = nodeRightPos(key);
                    stack.unshift(node.rightChild);
                }
            }
    },

    swapKeys = function swapKeys(node1, node2) {
        let t= node1.key;

        node1.key = node2.key;
        node2.key = t;
    },

    swapRed = function swapRed(node1, node2) {
        let tred = node1.red;
        node1.red = node2.red;
        node2.red = tred;
    },

    reValKeys = function reValKeys(node) {
        // go down re evaluating the key values per node from its parent
        let stack = [];

        while (!!node || !!stack.length) {
            if (node.leftChild) {
                node.leftChild.key = nodeLeftPos(node.key);
                stack.unshift(node.leftChild);
            }
            if (node.rightChild) {
                node.rightChild.key = nodeRightPos(node.key);
                stack.unshift(node.rightChild);
            }
            node = stack.pop();
        }
    },

    /**
     * In rotation properties to take care of:
     *  - child-parent relationship
     *  - Red Links of the swapped nodes
     *  - Size of the swapped nodes
     *  - key values of the swapped nodes
     *  - Key values of the each of the nodes in the transformed subtree
     */
    leftRotate = function leftRotate(node) {
        if (!!node.rightChild) {
            // set node's rightChild's parent = node's parent
            node.rightChild.parent = node.parent;

            // and parent's Child = node's right Child
            if (!!node.parent) {
                if ( isRightChild(node.parent, node) ) {
                    node.parent.rightChild = node.rightChild;
                }
                else if ( isLeftChild(node.parent, node) ) {
                    node.parent.leftChild = node.rightChild;
                }
            }

            let tempNode = node.rightChild;
            // set node's right child = node's parent
            node.parent = tempNode;

            if ( !!tempNode.leftChild ) {
                // set node's rightchild = node's right Child's left Child if any
                node.rightChild = tempNode.leftChild;
            } else {
                node.rightChild = undefined;
            }

            // set node as node's new parent's left Child
            tempNode.leftChild = node;

            // swap keys
            swapKeys(node, tempNode);
            // swap red links
            swapRed(node, tempNode);
            node.red = true;

            // adjust size
            let
                tempNodeRightTree = !!tempNode.rightChild? tempNode.rightChild.count:0,
                tempNodeLeftTree = !!node.rightChild? node.rightChild.count: 0,
                nodeLeftTree = !!node.leftChild? node.leftChild.count: 0;

            node.count = tempNodeLeftTree + nodeLeftTree + 1;
            tempNode.count = tempNodeRightTree + node.count + 1;

            // set the keys right
            reValKeys(tempNode);

            if (node.parent !== tempNode) throw Error("Node's new parent Should be its RightChild, tempNode");
            return node.parent;
        }
        return node;
    },

    rightRotate = function rightRotate(node) {
        if (!!node.leftChild) {
            // set node's leftChild's parent = node's parent
            node.leftChild.parent = node.parent;

            // and parent's Child = node's left Child
            if (!!node.parent) {
                if ( isRightChild(node.parent, node) ) {
                    node.parent.rightChild = node.leftChild;
                }
                else if ( isLeftChild(node.parent, node) ) {
                    node.parent.leftChild = node.leftChild;
                }
            }

            let tempNode = node.leftChild;
            // set node's left child = node's parent
            node.parent = tempNode;

            if ( !!tempNode.rightChild ) {
                // set node's leftchild = node's left Child's right Child if any
                node.leftChild = tempNode.rightChild;
            } else {
                node.leftChild = undefined;
            }

            // set node as node's new parent's right Child
            tempNode.rightChild = node;

            // swap keys
            swapKeys(node, tempNode);
            // swap red links
            swapRed(node, tempNode);
            node.red = true;

            // adjust size
            let
                tempNodeLeftTree = !!tempNode.leftChild? tempNode.leftChild.count:0,
                tempNodeRightTree = !!node.leftChild? node.leftChild.count: 0,
                nodeRightTree = !!node.rightChild? node.rightChild.count: 0;

            node.count = tempNodeRightTree + nodeRightTree + 1;
            tempNode.count = tempNodeLeftTree + node.count + 1;

            // set the keys right
            reValKeys(tempNode);

            if (node.parent !== tempNode) throw Error("Node's new parent Should be its RightChild, tempNode");
            return node.parent;
        }
        return node;
    },

    flipColor = function flipColor(node) {
        if ( !node.rightChild ) throw Error("No Right Child! How you do flipColor?");
        node.rightChild.red = !node.rightChild.red;
        if ( !node.leftChild ) throw Error("No Left Child! How you do flipColor?");
        node.leftChild.red = !node.leftChild.red;
        // no point in flipping the root's parent -violates RB tree's property. root should be black node
        if ( node.parent && node.parent !== null ) node.red = !node.red;
        return node;
    },

    // this is what fixes Red-Black Rotations
    fixUp = function fixUp(node) {
        // if parent's right child is red and left child is not red: left rotate parent
        if (!!node.parent) {
            if ( isRed(node.parent.rightChild) && !isRed(node.parent.leftChild) ) {
                node = leftRotate(node.parent);
                // console.log("node fixup case 1:");
                // console.log(node)
            }
        }

        // if parent's left is red and parents' left's left is red, right rotate parent
        if (!!node.parent) {
            if ( isRed(node.parent.leftChild) && isRed(node.parent.leftChild.leftChild) ) {
                node = rightRotate(node.parent);
            }
            // if parent's left and right child are red; flip child link colors and parents color;
            if ( isRed(node.parent.rightChild) && isRed(node.parent.leftChild) ) {
                node = flipColor(node.parent);
            }
        }

        return node;
    },

    nodeCount = function nodeCount(node) {
        node.count = 0;
        if (node.leftChild) node.count += node.leftChild.count;
        if (node.rightChild) node.count += node.rightChild.count;
        node.count += 1;
    },

    min = function min(node) {
            let
                lastNode=node;

            while ( node !== undefined ) {
                lastNode = node;
                node = node.leftChild;
            }
            return lastNode;
    },

    max = function max(node) {
            let
                lastNode=node;

            while ( node !== undefined ) {
                lastNode = node;
                node = node.rightChild;
            }
            return lastNode;
    },

    swapNodeValSubtree = function swapNodeValSubtree(node1, node2) {
        node1.val = node2.val;
    },

    floor= function floor(node, Val) {
            // find a key val <= Val

            let
                lastNode = node;

            // while the val is less than or equal to current node value
            while ( node.val < Val ) {
                lastNode = node;

                // find from the lowest values
                node = node.leftChild? node.leftChild : node.rightChild;

                if ( node.val >= Val ) {
                    return lastNode;
                }
            }
            return node;
    },

    ceil = function ceil(node, Val) {
        // find a key val >= Val
        let
            lastNode = node;

        // while the val is lesser than or equal to current node value; continue
        while ( node.val <= Val ) {
            lastNode = node;

            node = node.rightChild? node.rightChild : node.leftChild;
            // stop when the node val is just above Val
            if ( node.val > Val ) {
                return node;
            }
        }
        return node;
    },

    /* shift operations used to delete operations */
    shiftRedRight = function shiftRedRight(node) {
        node = flipColor(node);
        if (node.leftChild) {
            if ( isRed(node.leftChild.leftChild) ) {
                node = rightRotate(node);
                flipColor(node);
            }
        }
        return node;
    },

    shiftRedLeft = function shiftRedLeft(node) {
        flipColor(node);
        if (node.rightChild) {
            if ( isRed(node.rightChild.leftChild) ) {
                node.rightChild = rightRotate(node.rightChild);
                node = leftRotate(node);
                flipColor(node);
            }
        }
        return node;
    },

    deleteMax = function deleteMax(node) {
        let
            stack = [];

        while ( !!node ) {
            if ( isRed(node.leftChild) ) {
                node = rightRotate(node);
            }

            if (node.rightChild === undefined) {
                // delete the node
                if ( isRightChild(node.parent, node) ) node.parent.rightChild = undefined;
                else throw Error("Should have been the right Child of its parent!");

                node = undefined;
                continue;
            }

            if ( !isRed(node.rightChild) ) {
                if (node.rightChild.leftChild) {
                    if ( !isRed(node.rightChild.leftChild) ) {
                        node = shiftRedRight(node);
                    }
                }
            }

            stack.unshift(node);
            node = node.rightChild;
        }

        let lastNode = stack.shift();
        let leftCount = 0, rightCount = 0;
        // keep going up and fixing things until stack is empty
        while ( !!lastNode ) {
            lastNode.rightChild = node;
            leftCount = (!!lastNode.leftChild)? lastNode.leftChild.count:0;
            rightCount = (!!lastNode.rightChild)? lastNode.rightChild.count:0;
            lastNode.count = leftCount + rightCount + 1;

            node = fixUp(lastNode);
            lastNode = stack.shift();
        }
        return node;
    },

    deleteMin = function deleteMin(node) {
        let
            stack = [];

        while ( !!node ) {
            if ( !node.leftChild ) {
                if ( isLeftChild(node.parent, node) ) {
                    node.parent.count -= 1;
                    node.parent.leftChild = undefined;
                }
                else throw Error("Should have been the left Child of its parent!");

                node = undefined;
                continue;
            }

            if ( !isRed(node.leftChild) ) {
                if (node.leftChild.leftChild) {
                    if ( !isRed(node.leftChild.leftChild) ) {
                        node = shiftRedLeft(node);
                    }
                }
            }

            stack.unshift(node);
            node = node.leftChild;
        }

        let lastNode = stack.shift();
        // keep going up and fixing things until stack is empty
        let leftCount = 0, rightCount = 0;
        while ( !!lastNode ) {
            lastNode.leftChild = node;
            leftCount = (!!lastNode.leftChild)? lastNode.leftChild.count:0;
            rightCount = (!!lastNode.rightChild)? lastNode.rightChild.count:0;
            lastNode.count = leftCount + rightCount + 1;

            node = fixUp(lastNode);
            // try {
            //     node = fixUp(lastNode);
            // } catch(e) {
            //     console.log(e);
            //     console.log(lastNode);
            //     break;
            // }

            lastNode = stack.shift();
        }
        return node;
    },

    del = function del(node, Val) {

        // if Val is less than current node
        //     if current node left and left's left child are NOT red links
        //         node = shiftRedLeft(node)
        //      recursively perform delete (the node, Val)
        // else if Val is greater or equal to the node
        //     if left node is Red link
        //         rightRotate(node)
        //     if node equal current node and no right Child- means at the bottom most right
        //         delete this current node
        //     if node equal current node - means but no bottom most right end leaf
        //         get minimum from right subtree
        //         set the value of current node as min Value from right subtree
        //         set the right child of this new node by performing deleteMin(rightChild, Val to delete)
        //     else
        //         get recurse to del(rightChild, Val)
        let stack = [];

        while ( node !== undefined && node !== null ) {
            if (Val < node.val) {
                if ( !isRed(node.leftChild) ) {
                    if (node.leftChild.leftChild) {
                        if ( !isRed(node.leftChild.leftChild) ) {
                            node = shiftRedLeft(node);
                        }
                    }
                }
                stack.unshift([node, 'leftChild']);
                node = node.leftChild;
            }
            else {
                if ( isRed(node.leftChild) ) {
                    node = rightRotate(node);
                }
                // reached endmost rightChild of tree
                if (Val === node.val && !node.rightChild) {
                    // this just means deleting the node
                    // console.log(node);
                    if ( isRightChild(node.parent, node) ) node.parent.rightChild = undefined;
                    else if ( isLeftChild(node.parent, node) ) node.parent.leftChild = undefined;
                    else throw Error("Not a Right Child Leaf or Left Child Leaf");
                    node = undefined;
                    continue;
                }
                if ( !isRed(node.rightChild) && !isRed(node.rightChild.leftChild) ) {
                    node = shiftRedRight(node);
                }
                // equal but not leaf Node of tree
                if (Val === node.val) {
                    let minRightNode = min(node.rightChild);
                    swapNodeValSubtree(node, minRightNode);
                    node.rightChild = deleteMin(node.rightChild);
                    node = undefined;
                    continue;
                }
                else {
                    stack.unshift([node, 'rightChild']);
                    node = node.rightChild;
                }
            }
        }

        let
            objArm = stack.shift(),
            Node, Arm;

        while (!!objArm) {
            Node = objArm[0];
            Arm = objArm[1];

            Node[Arm] = node;

            nodeCount(Node);
            // leftCount = (!!Node.leftChild)? Node.leftChild.count:0;
            // rightCount = (!!Node.rightChild)? Node.rightChild.count:0;
            // Node.count = leftCount + rightCount + 1;

            node = fixUp(Node);

            objArm = stack.shift();
        }
        return node;
    },

    preOrderTraverse = function preOrderTraverse(node) {
        // go root
        // go left recursively
        // go right recursively

        let
            stack = [],
            seq = [];

        while ( !!node || !!stack.length ) {
            if (!!node) {
                seq.push(node.val);
                if (!!node.rightChild) {
                    stack.unshift(node.rightChild);
                }
                node = node.leftChild;
            }
            else {
                node = stack.shift();
            }
        }
        return seq;
    },

    inOrderTraverse = function inOrderTraverse(node) {
        // go left recursively
        // go root
        // go right recursively
        let
            stack = [],
            seq = [];

        while ( !!node || !!stack.length ) {
            if (!!node) {
                stack.unshift(node);
                node = node.leftChild;
            }
            else {
                node = stack.shift();
                seq.push(node.val);
                node = node.rightChild;
            }
        }
        return seq;
    },

    postOrderTraverse = function postOrderTraverse(node) {
        // go left recursively
        // go right recursively
        // go root

        let
            stack = [],
            lastNode,
            peek,
            seq = [];

        while ( !!node || !!stack.length ) {
            if (!!node) {
                stack.unshift(node);
                node = node.leftChild;
            }
            else {
                peek = stack[0];
                if (!!peek) {
                    if ( !!peek.rightChild && (peek.rightChild !== lastNode) ) {
                        node = peek.rightChild;
                    }
                    else {
                        seq.push(peek.val);
                        lastNode = stack.shift();
                    }
                }
            }
        }
        return seq;
    },

    levelOrderTraverse = function levelOrderTraverse(node) {
        // go root
        // go left
        // go right
        // go next level

        let
            stack = [node],
            seq = [];

        while (!!node) {
            node = stack.pop();
            seq.push(node);

            if (node.leftChild) {
                stack.unshift(node.leftChild);
            }
            if (node.rightChild) {
                stack.unshift(node.rightChild);
            }
        }
        return seq;
    },

    orderedST = {
        // dynamic Data structure

        init: function init() {
            this._root = null;
        },

        getRoot: function getRoot() {
            return this._root;
        },

        getVal: function getVal(Val) {
            // get uses binary search in this sorted array in ~O(lgN) time
            // returns first encounter of this Val in BST
            let node = this._root;

            while ( node !== undefined ) {
                // tkes lgN time
                if (Val > node.val) {
                    node = node.rightChild;
                }
                else if ( Val < node.val) {
                    node = node.leftChild;
                }
                else {
                    // return the node whose value that matched Val
                    return node;
                }
            }
            // return the node which is undefined meaning no node's value  matched Val
            return node;
        },

        getKey: function get(Val) {
            // Given a Val, find its index
            // returns first encounter of this Val in BST
            let node = this.getVal(Val);
            return !!node? node.key:undefined;
        },

        _add: function _add(Val, node, key) {
            let newNode;
            // add to the left or right of the parent node which is node.
            if ( Val > node.val ) {
                newNode = createNode(Val, nodeRightPos(key));
                node.rightChild = newNode;
            } else {
                newNode = createNode(Val, nodeLeftPos(key));
                node.leftChild = newNode;
            }
            newNode.parent = node;
            // set the count of the node
            nodeCount(node);
            return newNode;
        },

        insert: function insert(Val) {
            // Insert is:
            //     Search for null node at right position
            //     Add the Node at position
            //     while Node is not root
            //         Check for Rotation Transform
            //             if parent's right child is red and left child is not red: left rotate parent
            //             if parent's left is red and parents' left's left is red, right rotate parent
            //             if parent's left and right child are red; flip child link colors and parents color;
            //         Move one Parent Up

            // insert a new node to a legit position
            if (!this._root) {
                this._root = createNode(Val, 0);
                // set to null if root
                this._root.red = null;
                return this._root;
            }

            let
                node = this._root,
                lastNode,
                key=0;

            // Search for null node at right position
            while ( node !== undefined ) {
                // tkes lgN time
                lastNode = node;
                key = lastNode.key;
                if (Val > node.val) {
                    node = node.rightChild;
                }
                else if ( Val < node.val) {
                    node = node.leftChild;
                }
                else if ( Val === node.val) {
                    // return the node whose value that matched Val
                    break;
                }
            }

            // attach node at correct position
            if (Val !== lastNode.val) node = this._add(Val, lastNode, key);
            lastNode = node;

            // while Node is not root
            // fyi: doing a bottom-up 2-3 with while recursively to fix order-balance of nodes
            // let root;

            // check for valid rotation
            // console.log("node before insert fixUp is");
            // console.log(node);
            node = fixUp(node);
            if (node.key === 0) this._root = node;

            node = lastNode.parent;
            while (!!node) {
                nodeCount(node);
                node = node.parent;
            }

            // move one level up
            // root = node;
            // node = node.parent;

            // set the new root
            // this._root = root;

            // calculate num of nodes it contains in subtree including itself
            // O(NlgN) time
            // treeSize(node.parent);
            return lastNode;
        },
    };

module.exports = {
  tree: orderedST,
  leftRotate: leftRotate,
  rightRotate: rightRotate,
  inOrderTraverse: inOrderTraverse,
  preOrderTraverse: preOrderTraverse,
  postOrderTraverse: postOrderTraverse,
  deleteMin: deleteMin,
  deleteMax: deleteMax,
  del: del,
  min: min,
  max: max,
};

// for debugging purposes only
// let rbTree = Object.create(orderedST);

// rbTree.init();

// rbTree.insert(1);
// // console.log(rbTree);
// rbTree.insert(2);
// // console.log(rbTree);
// rbTree.insert(3);
// // console.log(rbTree);
// rbTree.insert(4);

// // console.log( postOrderTraverse(rbTree.getRoot()) );

// console.log(rbTree.getRoot());

// deleteMin(rbTree.getRoot());

// deleteMax(rbTree.getRoot());

// this was checking Case: deleteTests - testRedLinksLeft in tests
// let node = rbTree.getRoot(), stack = [];
// while (!!node) {
//     if (!!node.leftChild && !!node.rightChild) {
//         if ( !(node.leftChild.red !== node.rightChild.red) ) console.log(node);
//         stack.unshift(node.leftChild);
//     }
//     if (node.rightChild) stack.unshift(node.rightChild);
//     node = stack.pop();
// }
// TODO: Fix del operation. buggy!!
// del(rbTree.getRoot(), 4 );
// console.log(rbTree.getRoot());





// TODO: Test Insert function , esp rotation, balancing
// Test Red-Black Properties:
// Standard BST Pre-requisite isBST(): In-order traversal should yield a Sorted Array; THEN:
// 1. parent of every red-node is black;

// 2. root is black.i.e. child node's color pointing to root is black;

// 3. All paths from root(leaving root i.e. search from children nodes) to leaves have Equal # of Black Nodes.

// Test
// is23() to check that no node is connected to two red links and that there are no right-leaning red links. Add a method isBalanced() to check that all paths from the root to a null link have the same number of black links. Combine these methods with isBST() to create a method isRedBlackBST() that checks that the tree is a BST and that it satisfies these two conditions.



