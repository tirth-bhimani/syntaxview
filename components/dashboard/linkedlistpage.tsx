"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const LinkedListPage = () => {
  const [nodes, setNodes] = useState<{ id: number; value: string }[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputIndex, setInputIndex] = useState("");

  const handleInsert = () => {
    const value = inputValue.trim();
    const index = parseInt(inputIndex, 10);

    if (!value) {
      alert("Please enter a value to insert.");
      return;
    }

    if (isNaN(index) || index < 0 || index > nodes.length) {
      alert(`Please enter a valid index between 0 and ${nodes.length}.`);
      return;
    }

    if (value && !isNaN(index) && index >= 0 && index <= nodes.length) {
      const newNode = { id: Date.now(), value };
      const newNodes = [...nodes];
      newNodes.splice(index, 0, newNode);
      setNodes(newNodes);
      setInputValue("");
      setInputIndex("");
    }
  };

  const handleRemoveHead = () => {
    if (nodes.length === 0) {
      alert("The list is already empty.");
      return;
    }
    setNodes(nodes.slice(1));
  };

  const handleRemoveTail = () => {
    if (nodes.length === 0) {
      alert("The list is already empty.");
      return;
    }
    setNodes(nodes.slice(0, -1));
  };

  const handleClear = () => {
    if (nodes.length === 0) {
      alert("The list is already empty.");
      return;
    }
    if (window.confirm("Are you sure you want to clear the entire list?")) {
      setNodes([]);
    }
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 text-white h-full">
      {/* Left Column: Visualization */}
      <div className="lg:col-span-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Linked List
          </h1>
          <p className="mt-2 text-md sm:text-lg text-white/70">
            A dynamic data structure where elements are stored in nodes linked
            together.
          </p>
        </div>

        {/* Visualization Area */}
        <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[300px] flex items-center justify-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {nodes.length > 0 && (
              <div className="text-lg font-semibold text-cyan-400">Head</div>
            )}
            <AnimatePresence>
              {nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-24 h-24 bg-cyan-500/10 border-2 border-cyan-500 rounded-lg flex flex-col items-center justify-center p-2">
                    <div className="text-sm text-cyan-300">Value</div>
                    <div className="text-2xl font-bold">{node.value}</div>
                  </div>
                  {index < nodes.length - 1 && (
                    <ArrowRight className="w-8 h-8 text-cyan-500 shrink-0" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {nodes.length > 0 && (
              <div className="text-lg font-semibold text-red-400">Tail</div>
            )}
            {nodes.length === 0 && (
              <div className="text-white/50">List is empty</div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-1">
        <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Modify List</span>
            </CardTitle>
            <CardDescription>
              Insert or remove nodes from the list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                  placeholder="Value"
                />
                <Input
                  type="number"
                  value={inputIndex}
                  onChange={(e) => setInputIndex(e.target.value)}
                  className="bg-transparent border-cyan-500/30 focus:border-cyan-500 w-24"
                  placeholder="Index"
                />
              </div>
              <Button
                onClick={handleInsert}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white"
              >
                Insert At Index
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleRemoveHead}
                variant="outline"
                className="bg-transparent border-red-500/40 hover:bg-red-500/20 text-white"
              >
                <Minus className="w-4 h-4 mr-2" /> Remove Head
              </Button>
              <Button
                onClick={handleRemoveTail}
                variant="outline"
                className="bg-transparent border-red-500/40 hover:bg-red-500/20 text-white"
              >
                <Minus className="w-4 h-4 mr-2" /> Remove Tail
              </Button>
            </div>
            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear List
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkedListPage;