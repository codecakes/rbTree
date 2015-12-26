(function () {

    "use strict";
    const
        path = require("path"),
        runTraceUr = require(path.join('..', 'helper', 'common')).compile6to5(),
        nodeunit = require("nodeunit"),
        // chai = require("chai"),
        // expect = chai.expect,
        // should = chai.should,
        module = require(path.join('..','rbTree')),
        rbtree = module.tree,
        leftRotate = module.leftRotate,
        rightRotate = module.rightRotate,
        inOrderTraverse = module.inOrderTraverse,
        preOrderTraverse = module.preOrderTraverse,
        postOrderTraverse = module.postOrderTraverse,
        deleteMin = module.deleteMin,
        deleteMax = module.deleteMax,
        del = module.del,
        max = module.max,
        min = module.min,

        testInserts = {
            insertOne: function insertOne(test) {

                test.expect(1);

                let rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                test.deepEqual(rbTree.getRoot().key, 0, "Root key is 0");

                test.done();
            },

            insertTwo: function insertTwo(test) {

                test.expect(6);

                let rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                test.strictEqual(rbTree.getRoot().rightChild, undefined, "After rotation of 2, new right child should be undefined");
                test.deepEqual(rbTree.getRoot().key, 0, "After rotation of 2, Root key should be 0");
                test.deepEqual(rbTree.getRoot().red, null, "Root red link is always null");
                test.deepEqual(rbTree.getRoot().leftChild.key, 1, "Roots left child key is 1");
                test.deepEqual(rbTree.getRoot().leftChild.red, true, "Roots left child red link after flipping is red");
                test.deepEqual(rbTree.getRoot().count, 2, "Total tree count is 2");

                test.done();
            },

            insertThree: function insertThree(test) {
                test.expect(5);

                let
                    rbTree = Object.create(rbtree),
                    node;
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                node = rbTree.insert(3);

                test.deepEqual(rbTree.getRoot().key, 0, "After rotation of 2, Root key should be 0");
                test.deepEqual(rbTree.getRoot().red, null, "Root red link is always null");
                test.deepEqual(rbTree.getRoot().leftChild.key, 1, "Roots left child key is 1");
                test.equal(rbTree.getRoot(), node.parent, "GetRoots and key 3's parent is the same root node");
                test.equal(rbTree.getRoot().leftChild.red, rbTree.getRoot().rightChild.red, "Both children links are same");

                test.done();
            },

            insertFour: function insertFour(test) {
                test.expect(3);
                let
                    rbTree = Object.create(rbtree),
                    node;
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                node = rbTree.insert(4);

                test.strictEqual(node.leftChild.val, 3, "Node with val 3 is less than Node with val 4");
                test.strictEqual(node.leftChild.key, 5, "Node with val 3 has key =  5");
                test.strictEqual(node.leftChild.red, true, "Node key 5 has red link");

                test.done();
            },
        },

        traversalTests = {
            sortingTest: function inOrderTraverseTest(test) {
                test.expect(1);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);

                test.deepEqual(inOrderTraverse(rbTree.getRoot()), [1,2,3,4], "in Order Traversal yields sorted array");
                test.done();
            },

            preOrderTraverseTest: function preOrderTraverseTest(test) {
                test.expect(1);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);

                test.deepEqual(preOrderTraverse(rbTree.getRoot()), [2, 1, 4, 3], "Pre Order Traversal yields root, left, right");
                test.done();
            },

            postOrderTraverseTest: function postOrderTraverseTest(test) {
                test.expect(1);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);

                test.deepEqual(postOrderTraverse(rbTree.getRoot()), [1, 3, 4, 2], "Post Order Traversal yields left, right, root");
                test.done();
            },
        },

        deleteTests = {
            initialCount: function initialCount(test) {
                test.expect(1);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);

                test.strictEqual(rbTree.getRoot().count, 4, "Count is 4");
                test.done();
            },

            testRedLinksLeft: function testRedLinksLeft(test) {
                // test.expect(1);
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
                        test.deepEqual(boolVal, true, "Left and Right Child together cannot Both Be Red links");
                        stack.unshift(node.leftChild);
                    }
                    if (node.rightChild) stack.unshift(node.rightChild);
                    node = stack.pop();
                }
                test.done();
            },

            deleteMinTest: function deleteMinTest(test) {
                test.expect(3);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);
                let size = rbTree.getRoot().count;

                test.strictEqual(rbTree.getRoot().count, size, "Before deletion, size same");

                deleteMin(rbTree.getRoot());

                test.strictEqual(rbTree.getRoot().count, size - 1, "After deletion, size one less");

                test.deepEqual(inOrderTraverse(rbTree.getRoot()), [2,3,4], "1 is removed");

                test.done();
            },
            deleteMaxTest: function deleteMaxTest(test) {
                test.expect(3);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);
                let size = rbTree.getRoot().count;

                test.strictEqual(rbTree.getRoot().count, size, "Before deletion, size same");

                deleteMax(rbTree.getRoot());

                test.strictEqual(rbTree.getRoot().count, size - 1, "After deletion, size one less");

                test.deepEqual(inOrderTraverse(rbTree.getRoot()), [1,2,3], "4 is removed");

                test.done();
            },
        },

        deleteGenericTests = {
            deleteMax: function deleteMax(test) {
                test.expect(1);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);

                del(rbTree.getRoot(), 4);

                test.deepEqual( max(rbTree.getRoot()).val, 3, "Maximum Node has Val 3");
                test.done();
            },

            deleteMin: function deleteMin(test) {
                test.expect(1);
                let
                    rbTree = Object.create(rbtree);
                rbTree.init();
                rbTree.insert(1);
                rbTree.insert(2);
                rbTree.insert(3);
                rbTree.insert(4);

                del(rbTree.getRoot(), 1);

                test.deepEqual( min(rbTree.getRoot()).val, 2, "Minimum Node has Val 2");

                test.done();
            },
        };

    exports.testOneInsert = nodeunit.testCase(testInserts);
    exports.traversalTests = nodeunit.testCase(traversalTests);
    exports.deleteTests = nodeunit.testCase(deleteTests);
    exports.deleteGenericTests = nodeunit.testCase(deleteGenericTests);
})();