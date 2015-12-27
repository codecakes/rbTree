import test from "tape"

// test("rbtree", (t) => {
//   t.plan(1)
//   t.equal(true, rbtree(), "return true")
// })

"use strict";
const
    path = require("path"),
    runTraceUr = require(path.join('..', 'helper', 'common')).compile6to5(),
    nodeunit = require("nodeunit"),
    rbTree = require(path.join('..','src','index')),
    rbtree = rbTree.tree,
    leftRotate = rbTree.leftRotate,
    rightRotate = rbTree.rightRotate,
    inOrderTraverse = rbTree.inOrderTraverse,
    preOrderTraverse = rbTree.preOrderTraverse,
    postOrderTraverse = rbTree.postOrderTraverse,
    deleteMin = rbTree.deleteMin,
    deleteMax = rbTree.deleteMax,
    del = rbTree.del,
    max = rbTree.max,
    min = rbTree.min;

test('testInserts', function testInserts(t) {
  t.plan(4);

  t.test('insertOne', function insertOne(st) {
    st.plan(1);

    let
      rbTree = Object.create(rbtree);
      rbTree.init();
      rbTree.insert(1);

    st.deepEqual(rbTree.getRoot().key, 0, "Root key is 0");
    st.end();
  });

  t.test('insertTwo', function insertTwo(st) {
    st.plan(7);

    let
      rbTree = Object.create(rbtree);
      rbTree.init();
      rbTree.insert(1);
      rbTree.insert(2);

    st.deepEqual(rbTree.getRoot().rightChild, undefined, "After rotation of 2, new right child should be undefined");
    st.deepEqual(rbTree.getRoot().key, 0, "After rotation of 2, Root key should be 0");
    st.deepEqual(rbTree.getRoot().red, null, "Root red link is always null");
    st.deepEqual(rbTree.getRoot().leftChild.key, 1, "Roots left child key is 1");
    st.deepEqual(rbTree.getRoot().leftChild.red, true, "Roots left child red link after flipping is red");
    st.deepEqual(rbTree.getRoot().count, 2, "Total tree count is 2");
    st.deepEqual(rbTree.getRoot().key, 0, "Root key is 0");

    st.end();
  });

  t.test('insertThree', function insertThree(st) {
    st.plan(5);

    let
        rbTree = Object.create(rbtree),
        node;
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    node = rbTree.insert(3);

    st.deepEqual(rbTree.getRoot().key, 0, "After rotation of 2, Root key should be 0");
    st.deepEqual(rbTree.getRoot().red, null, "Root red link is always null");
    st.deepEqual(rbTree.getRoot().leftChild.key, 1, "Roots left child key is 1");
    st.equal(rbTree.getRoot(), node.parent, "GetRoots and key 3's parent is the same root node");
    st.equal(rbTree.getRoot().leftChild.red, rbTree.getRoot().rightChild.red, "Both children links are same");

    st.end();
  });

  t.test('insertFour', function insertFour(st) {
    st.plan(3);
    let
        rbTree = Object.create(rbtree),
        node;
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    node = rbTree.insert(4);

    st.deepEqual(node.leftChild.val, 3, "Node with val 3 is less than Node with val 4");
    st.deepEqual(node.leftChild.key, 5, "Node with val 3 has key =  5");
    st.deepEqual(node.leftChild.red, true, "Node key 5 has red link");

    st.end();
  });

  t.end();
});


test('traversalTests', function traversalTests(t) {
  t.plan(3);

  t.test('sortingTest', function sortingTest(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    st.deepEqual(inOrderTraverse(rbTree.getRoot()), [1,2,3,4], "in Order Traversal yields sorted array");
    st.end();
  });

  t.test('preOrderTraverseTest', function preOrderTraverseTest(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    st.deepEqual(preOrderTraverse(rbTree.getRoot()), [2, 1, 4, 3], "Pre Order Traversal yields root, left, right");
    st.end();
  });

  t.test('postOrderTraverseTest', function postOrderTraverseTest(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    st.deepEqual(postOrderTraverse(rbTree.getRoot()), [1, 3, 4, 2], "Post Order Traversal yields left, right, root");
    st.end();
  });

  t.end();
});


test('deleteTests', function deleteTests(t) {
  t.plan(2);

  t.test('initialCount', function initialCount(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    st.deepEqual(rbTree.getRoot().count, 4, "Count is 4");
    st.end();
  });

  t.test('testRedLinksLeft', function testRedLinksLeft(st) {
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    let node = rbTree.getRoot(), stack = [], boolVal=false;

    while (!!node) {
        if (!!node.leftChild && !!node.rightChild) {
            boolVal = (node.leftChild.red !== node.rightChild.red) || (node.leftChild.red !== true && node.rightChild.red !== true);
            st.deepEqual(boolVal, true, "Left and Right Child together cannot Both Be Red links");
            stack.unshift(node.leftChild);
        }
        if (node.rightChild) stack.unshift(node.rightChild);
        node = stack.pop();
    }
    st.end();
  });

  t.end();
});

test('deleteTests', function deleteTests(t) {
  t.plan(4);

  t.test('initialCount', function initialCount(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    st.deepEqual(rbTree.getRoot().count, 4, "Count is 4");
    st.end();
  });

  t.test('testRedLinksLeft', function testRedLinksLeft(st) {
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    let node = rbTree.getRoot(), stack = [], boolVal=false;
    while (!!node) {
        if (!!node.leftChild && !!node.rightChild) {
            boolVal = (node.leftChild.red !== node.rightChild.red) || (node.leftChild.red !== true && node.rightChild.red !== true);
            st.deepEqual(boolVal, true, "Left and Right Child together cannot Both Be Red links");
            stack.unshift(node.leftChild);
        }
        if (node.rightChild) stack.unshift(node.rightChild);
        node = stack.pop();
    }
    st.end();
  });

  t.test('deleteMinTest', function deleteMinTest(st) {
    st.plan(3);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);
    let size = rbTree.getRoot().count;

    st.deepEqual(rbTree.getRoot().count, size, "Before deletion, size same");

    deleteMin(rbTree.getRoot());

    st.deepEqual(rbTree.getRoot().count, size - 1, "After deletion, size one less");

    st.deepEqual(inOrderTraverse(rbTree.getRoot()), [2,3,4], "1 is removed");

    st.end();
  });

  t.test('deleteMaxTest', function deleteMaxTest(st) {
    st.plan(3);

    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);
    let size = rbTree.getRoot().count;

    st.deepEqual(rbTree.getRoot().count, size, "Before deletion, size same");

    deleteMax(rbTree.getRoot());

    st.deepEqual(rbTree.getRoot().count, size - 1, "After deletion, size one less");

    st.deepEqual(inOrderTraverse(rbTree.getRoot()), [1,2,3], "4 is removed");

    st.end();
  });

  t.end();
});

test('deleteGenericTests', function deleteGenericTests(t) {
  t.plan(2);

  t.test('deleteMax', function deleteMax(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    del(rbTree.getRoot(), 4);

    st.deepEqual( max(rbTree.getRoot()).val, 3, "Maximum Node has Val 3");
    st.end();
  });

  t.test('deleteMin', function deleteMin(st) {
    st.plan(1);
    let
        rbTree = Object.create(rbtree);
    rbTree.init();
    rbTree.insert(1);
    rbTree.insert(2);
    rbTree.insert(3);
    rbTree.insert(4);

    del(rbTree.getRoot(), 1);

    st.deepEqual( min(rbTree.getRoot()).val, 2, "Minimum Node has Val 2");

    st.end();
  });

  t.end();
});