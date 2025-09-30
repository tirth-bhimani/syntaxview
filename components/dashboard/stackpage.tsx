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
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";

const StackPage = () => {
  const [stackElements, setStackElements] = useState<number[]>([]);
  const [value, setValue] = useState("");

  const handlePush = () => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setStackElements((prev) => [...prev, numValue]);
      setValue("");
    } else {
      alert("Please enter a valid value to push.");
    }
  };

  const handlePop = () => {
    if (stackElements.length > 0) {
      setStackElements((prev) => prev.slice(0, -1));
    } else {
      alert("The stack is empty.");
    }
  };

  const handleClear = () => {
    setStackElements([]);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 text-white h-full">
      <div className="lg:col-span-2">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Stack</h1>
          <p className="mt-2 text-md sm:text-lg text-white/70">
            A Last-In-First-Out (LIFO) data structure with push and pop
            operations.
          </p>
        </div>

        {/* Visualization Area */}
        <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="text-lg font-semibold text-cyan-400">Top</div>
            <div className="flex flex-col-reverse gap-2">
              <AnimatePresence>
                {stackElements.map((element, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="w-48 h-16 bg-cyan-500/10 border-2 border-cyan-500 rounded-lg flex items-center justify-center"
                  >
                    <div className="text-xl sm:text-2xl font-bold">
                      {element}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUp className="w-5 h-5" />
              <span>Modify Stack</span>
            </CardTitle>
            <CardDescription>
              Add (push) or remove (pop) elements.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Value to push"
              />
              <Button
                onClick={handlePush}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white flex items-center gap-2"
              >
                <ArrowUp className="w-4 h-4" /> Push
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handlePop}
                variant="outline"
                className="w-full bg-transparent border-red-500/40 hover:bg-red-500/20 text-white flex items-center gap-2"
              >
                <ArrowDown className="w-4 h-4" />
                Pop
              </Button>
            </div>
            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Stack
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StackPage;