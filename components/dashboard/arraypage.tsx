"use client";

import { useState } from "react";
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
import { Trash2, Plus } from "lucide-react";

const ArrayPage = () => {
  const [arrayElements, setArrayElements] = useState<number[]>([]);
  const [value, setValue] = useState("");
  const [index, setIndex] = useState("");

  const handleInsert = () => {
    const numValue = parseInt(value, 10);
    const numIndex = parseInt(index, 10);
    if (
      !isNaN(numValue) &&
      !isNaN(numIndex) &&
      numIndex >= 0 &&
      numIndex <= arrayElements.length
    ) {
      const newArray = [...arrayElements];
      newArray.splice(numIndex, 0, numValue);
      setArrayElements(newArray);
      setValue("");
      setIndex("");
    } else {
      alert("Please enter a valid value and an index within the array bounds.");
    }
  };

  const handleDelete = () => {
    const numIndex = parseInt(index, 10);
    if (!isNaN(numIndex) && numIndex >= 0 && numIndex < arrayElements.length) {
      const newArray = [...arrayElements];
      newArray.splice(numIndex, 1);
      setArrayElements(newArray);
      setIndex("");
    } else {
      alert("Please enter a valid index to delete.");
    }
  };

  const handleClear = () => {
    setArrayElements([]);
  };

  return (
    <div className="mx-auto text-white p-4 md:p-0">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Array</h1>
        <p className="mt-2 text-lg text-white/70">
          A linear data structure that stores a collection of elements, each
          identified by at least one array index or key.
        </p>
      </div>

      {/* Visualization Area */}
      <div className="mb-8 p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[300px] flex items-center justify-center">
        <div className="flex flex-wrap gap-2 justify-center">
          <AnimatePresence>
            {arrayElements.map((element, idx) => (
              <motion.div
                key={idx}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3 }}
                className="w-20 h-20 bg-cyan-500/10 border-2 border-cyan-500 rounded-lg flex flex-col items-center justify-center"
              >
                <div className="text-2xl font-bold">{element}</div>
                <div className="text-xs text-white/50 mt-1">[{idx}]</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls Area */}
      <div className=" gap-8">
        <Card className="bg-black/50 backdrop-blur-lg border  border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Modify Array</span>
            </CardTitle>
            <CardDescription>
              Insert or remove elements from the array.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Value"
              />
              <Input
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                type="number"
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Index"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleInsert}
                className="w-full sm:w-1/2 bg-cyan-500/20 hover:bg-cyan-500/30 text-white"
              >
                Insert
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full sm:w-1/2 bg-transparent border-red-500/40 hover:bg-red-500/20 text-white"
              >
                Delete
              </Button>
            </div>
            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Array
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArrayPage;
