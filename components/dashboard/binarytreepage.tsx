"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Trash2, Plus, Search, ArrowDownUp } from "lucide-react";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

function insertNode(root: TreeNode | null, value: number): TreeNode {
  if (!root) return { value, left: null, right: null };
  if (value < root.value) return { ...root, left: insertNode(root.left, value) };
  if (value > root.value) return { ...root, right: insertNode(root.right, value) };
  return root; // duplicate
}

function deleteNode(root: TreeNode | null, value: number): TreeNode | null {
  if (!root) return null;
  if (value < root.value) return { ...root, left: deleteNode(root.left, value) };
  if (value > root.value) return { ...root, right: deleteNode(root.right, value) };
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  let minRight = root.right;
  while (minRight.left) minRight = minRight.left;
  return { ...root, value: minRight.value, right: deleteNode(root.right, minRight.value) };
}

function searchNode(root: TreeNode | null, value: number): boolean {
  if (!root) return false;
  if (value === root.value) return true;
  if (value < root.value) return searchNode(root.left, value);
  return searchNode(root.right, value);
}

function inOrder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.value);
  inOrder(node.right, result);
  return result;
}

function preOrder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  result.push(node.value);
  preOrder(node.left, result);
  preOrder(node.right, result);
  return result;
}

function postOrder(node: TreeNode | null, result: number[] = []): number[] {
  if (!node) return result;
  postOrder(node.left, result);
  postOrder(node.right, result);
  result.push(node.value);
  return result;
}

interface NodePosition {
  value: number;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

function getPositions(
  node: TreeNode | null,
  x: number,
  y: number,
  spread: number,
  positions: NodePosition[] = [],
  parentX?: number,
  parentY?: number
): NodePosition[] {
  if (!node) return positions;
  positions.push({ value: node.value, x, y, parentX, parentY });
  getPositions(node.left, x - spread, y + 70, spread * 0.55, positions, x, y);
  getPositions(node.right, x + spread, y + 70, spread * 0.55, positions, x, y);
  return positions;
}

const BinaryTreePage = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [value, setValue] = useState("");
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [traversalResult, setTraversalResult] = useState<string | null>(null);

  const handleInsert = useCallback(() => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      alert("Please enter a valid number.");
      return;
    }
    setRoot((prev) => insertNode(prev, num));
    setValue("");
    setSearchResult(null);
    setTraversalResult(null);
  }, [value]);

  const handleDelete = useCallback(() => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      alert("Please enter a valid number.");
      return;
    }
    setRoot((prev) => deleteNode(prev, num));
    setValue("");
    setSearchResult(null);
  }, [value]);

  const handleSearch = useCallback(() => {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      alert("Please enter a valid number.");
      return;
    }
    const found = searchNode(root, num);
    setSearchResult(found ? `${num} found in tree ✓` : `${num} not found ✗`);
    if (found) {
      setHighlighted([num]);
      setTimeout(() => setHighlighted([]), 2000);
    }
  }, [value, root]);

  const handleTraversal = useCallback(
    (type: "inorder" | "preorder" | "postorder") => {
      if (!root) return;
      let result: number[];
      let label: string;
      switch (type) {
        case "inorder":
          result = inOrder(root);
          label = "In-Order";
          break;
        case "preorder":
          result = preOrder(root);
          label = "Pre-Order";
          break;
        case "postorder":
          result = postOrder(root);
          label = "Post-Order";
          break;
      }
      setTraversalResult(`${label}: [${result.join(", ")}]`);
      setHighlighted(result);
      setTimeout(() => setHighlighted([]), 3000);
    },
    [root]
  );

  const handleClear = () => {
    setRoot(null);
    setSearchResult(null);
    setTraversalResult(null);
    setHighlighted([]);
  };

  const positions = root ? getPositions(root, 400, 40, 160) : [];

  return (
    <div className="flex flex-col gap-4 md:gap-8 text-white h-full">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Binary Search Tree
          </h1>
          <p className="mt-2 text-md sm:text-lg text-white/70">
            A hierarchical data structure where each node has at most two children,
            with left values smaller and right values larger.
          </p>
        </div>

        {/* Visualization Area */}
        <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[400px] overflow-x-auto">
          {positions.length === 0 ? (
            <div className="flex items-center justify-center h-[360px] text-white/50">
              Tree is empty — insert a node to begin
            </div>
          ) : (
            <svg width="800" height={Math.max(400, positions.length * 40)} className="mx-auto">
              {/* Lines */}
              {positions.map(
                (pos) =>
                  pos.parentX !== undefined &&
                  pos.parentY !== undefined && (
                    <motion.line
                      key={`line-${pos.value}-${pos.x}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      x1={pos.parentX}
                      y1={pos.parentY + 20}
                      x2={pos.x}
                      y2={pos.y}
                      stroke="rgba(6,182,212,0.4)"
                      strokeWidth="2"
                    />
                  )
              )}
              {/* Nodes */}
              <AnimatePresence>
                {positions.map((pos) => (
                  <motion.g
                    key={`node-${pos.value}-${pos.x}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={22}
                      fill={
                        highlighted.includes(pos.value)
                          ? "rgba(6,182,212,0.6)"
                          : "rgba(6,182,212,0.1)"
                      }
                      stroke={
                        highlighted.includes(pos.value) ? "#06b6d4" : "#0891b2"
                      }
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    <text
                      x={pos.x}
                      y={pos.y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {pos.value}
                    </text>
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          )}
        </div>

        {/* Traversal / Search results */}
        {(searchResult || traversalResult) && (
          <div className="mt-3 p-3 bg-black/40 rounded-xl border border-cyan-500/10 text-sm text-cyan-300 font-mono">
            {searchResult && <div>{searchResult}</div>}
            {traversalResult && <div>{traversalResult}</div>}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="lg:col-span-1">
        <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Modify Tree</span>
            </CardTitle>
            <CardDescription>
              Insert, delete, or search for nodes in the BST.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="number"
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Value"
                onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={handleInsert}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white"
              >
                <Plus className="w-4 h-4 mr-1" /> Insert
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="bg-transparent border-red-500/40 hover:bg-red-500/20 text-white"
              >
                <Trash2 className="w-4 h-4 mr-1" /> Delete
              </Button>
              <Button
                onClick={handleSearch}
                variant="outline"
                className="bg-transparent border-purple-500/40 hover:bg-purple-500/20 text-white"
              >
                <Search className="w-4 h-4 mr-1" /> Search
              </Button>
            </div>

            <div className="pt-2 border-t border-cyan-500/10">
              <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                <ArrowDownUp className="w-3 h-3" /> Traversals
              </p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleTraversal("inorder")}
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-cyan-500/20 text-white text-xs hover:bg-cyan-500/10"
                >
                  In-Order
                </Button>
                <Button
                  onClick={() => handleTraversal("preorder")}
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-cyan-500/20 text-white text-xs hover:bg-cyan-500/10"
                >
                  Pre-Order
                </Button>
                <Button
                  onClick={() => handleTraversal("postorder")}
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-cyan-500/20 text-white text-xs hover:bg-cyan-500/10"
                >
                  Post-Order
                </Button>
              </div>
            </div>

            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Tree
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BinaryTreePage;
