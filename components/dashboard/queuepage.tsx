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
import { Trash2, Plus, Minus } from "lucide-react";

interface QueueNode {
  id: number;
  value: number;
}

const itemVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    backgroundColor: [
      "#0891b2", // A brighter cyan
      "rgba(6, 182, 212, 0.1)", // The normal background
    ],
    transition: { duration: 0.8 },
  },
  exit: { opacity: 0, scale: 0.5, transition: { duration: 0.3 } },
};

const QueuePage = () => {
  const [queueElements, setQueueElements] = useState<QueueNode[]>([]);
  const [value, setValue] = useState("");

  const handleEnqueue = () => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const newNode = { id: Date.now(), value: numValue };
      setQueueElements((prev) => [newNode, ...prev]);
      setValue("");
    } else {
      alert("Please enter a valid value to enqueue.");
    }
  };

  const handleDequeue = () => {
    if (queueElements.length > 0) {
      setQueueElements((prev) => prev.slice(0, -1));
    } else {
      alert("The queue is empty.");
    }
  };

  const handleClear = () => {
    setQueueElements([]);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 text-white h-full">
      {/* Visualization Area and Header */}
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Queue</h1>
          <p className="mt-2 text-md sm:text-lg text-white/70">
            A linear data structure that follows the First-In, First-Out (FIFO) principle.
          </p>
        </div>
        <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[300px] flex items-center justify-center">
          <div className="flex flex-nowrap overflow-x-auto items-center justify-start gap-2 sm:gap-4 px-4">
            <div className="text-md sm:text-lg font-semibold text-cyan-400 shrink-0">Front</div>
            <div className="flex flex-row-reverse gap-2">
              <AnimatePresence>
                {queueElements.map((element) => (
                  <motion.div
                    key={element.id}
                    layout
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="w-16 h-16 sm:w-20 sm:h-20 border-2 border-cyan-500 rounded-lg flex flex-col items-center justify-center shrink-0"
                  >
                    <div className="text-lg sm:text-2xl font-bold">{element.value}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="text-md sm:text-lg font-semibold text-red-400 shrink-0">Rear</div>
          </div>
        </div>
      </div>

      {/* Controls Area */}
      <div className="lg:col-span-1">
        <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Modify Queue</span>
            </CardTitle>
            <CardDescription>Add (enqueue) or remove (dequeue) elements.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Value to enqueue"
              />
              <Button onClick={handleEnqueue} className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white">
                Enqueue
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleDequeue}
                variant="outline"
                className="w-full bg-transparent border-red-500/40 hover:bg-red-500/20 text-white flex items-center gap-2"
              >
                <Minus className="w-4 h-4" /> Dequeue
              </Button>
            </div>
            <Button onClick={handleClear} variant="destructive" className="w-full flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Clear Queue
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QueuePage;