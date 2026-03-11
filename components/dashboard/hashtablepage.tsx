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
import { Trash2, Plus, Search, Hash } from "lucide-react";

interface HashEntry {
  key: string;
  value: string;
}

const TABLE_SIZE = 8;

function hashFunction(key: string, size: number): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) % size;
  }
  return hash;
}

const HashTablePage = () => {
  const [table, setTable] = useState<HashEntry[][]>(
    Array.from({ length: TABLE_SIZE }, () => [])
  );
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [highlightedBucket, setHighlightedBucket] = useState<number | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [hashAnimation, setHashAnimation] = useState<string | null>(null);

  const animateHash = useCallback((key: string, bucket: number) => {
    setHashAnimation(`hash("${key}") → ${bucket}`);
    setHighlightedBucket(bucket);
    setTimeout(() => {
      setHighlightedBucket(null);
      setHashAnimation(null);
    }, 2000);
  }, []);

  const handleInsert = useCallback(() => {
    const k = key.trim();
    const v = value.trim();
    if (!k || !v) {
      alert("Please enter both key and value.");
      return;
    }
    const bucket = hashFunction(k, TABLE_SIZE);
    animateHash(k, bucket);

    setTable((prev) => {
      const newTable = prev.map((b) => [...b]);
      // Update existing or add new
      const existingIdx = newTable[bucket].findIndex((e) => e.key === k);
      if (existingIdx >= 0) {
        newTable[bucket][existingIdx] = { key: k, value: v };
      } else {
        newTable[bucket].push({ key: k, value: v });
      }
      return newTable;
    });
    setKey("");
    setValue("");
    setSearchResult(null);
  }, [key, value, animateHash]);

  const handleDelete = useCallback(() => {
    const k = key.trim();
    if (!k) {
      alert("Please enter a key to delete.");
      return;
    }
    const bucket = hashFunction(k, TABLE_SIZE);
    animateHash(k, bucket);

    setTable((prev) => {
      const newTable = prev.map((b) => [...b]);
      newTable[bucket] = newTable[bucket].filter((e) => e.key !== k);
      return newTable;
    });
    setKey("");
    setSearchResult(null);
  }, [key, animateHash]);

  const handleSearch = useCallback(() => {
    const k = key.trim();
    if (!k) {
      alert("Please enter a key to search.");
      return;
    }
    const bucket = hashFunction(k, TABLE_SIZE);
    animateHash(k, bucket);

    const entry = table[bucket].find((e) => e.key === k);
    if (entry) {
      setSearchResult(`Found: "${entry.key}" → "${entry.value}" (bucket ${bucket})`);
    } else {
      setSearchResult(`Key "${k}" not found (bucket ${bucket})`);
    }
  }, [key, table, animateHash]);

  const handleClear = () => {
    setTable(Array.from({ length: TABLE_SIZE }, () => []));
    setSearchResult(null);
    setHashAnimation(null);
    setHighlightedBucket(null);
  };

  const totalEntries = table.reduce((sum, bucket) => sum + bucket.length, 0);

  return (
    <div className="flex flex-col gap-4 md:gap-8 text-white h-full">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Hash Table
          </h1>
          <p className="mt-2 text-md sm:text-lg text-white/70">
            A data structure that maps keys to values using a hash function for
            fast O(1) average-time lookups, inserts, and deletes.
          </p>
        </div>

        {/* Hash animation bar */}
        {hashAnimation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-3 p-3 bg-purple-500/10 rounded-xl border border-purple-500/30 text-sm text-purple-300 font-mono text-center"
          >
            <Hash className="w-4 h-4 inline mr-2" />
            {hashAnimation}
          </motion.div>
        )}

        {/* Visualization */}
        <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[400px]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-white/50">
              {TABLE_SIZE} buckets · {totalEntries} entries
            </span>
            <span className="text-sm text-white/50">
              Load factor: {(totalEntries / TABLE_SIZE).toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            {table.map((bucket, idx) => (
              <motion.div
                key={idx}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors duration-300 ${
                  highlightedBucket === idx
                    ? "bg-cyan-500/20 border border-cyan-500/40"
                    : "bg-black/20 border border-transparent"
                }`}
              >
                {/* Bucket index */}
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                  {idx}
                </div>
                {/* Entries */}
                <div className="flex flex-wrap gap-2 flex-1 min-h-[32px] items-center">
                  <AnimatePresence>
                    {bucket.map((entry) => (
                      <motion.div
                        key={entry.key}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.3 }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-sm"
                      >
                        <span className="text-cyan-300 font-medium">
                          {entry.key}
                        </span>
                        <span className="text-white/40 mx-1">:</span>
                        <span className="text-white/80">{entry.value}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {bucket.length === 0 && (
                    <span className="text-white/20 text-xs">empty</span>
                  )}
                  {bucket.length > 1 && (
                    <span className="text-yellow-400/60 text-xs ml-1">
                      ⚡ collision
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {searchResult && (
          <div className="mt-3 p-3 bg-black/40 rounded-xl border border-cyan-500/10 text-sm text-cyan-300 font-mono">
            {searchResult}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="lg:col-span-1">
        <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              <span>Modify Hash Table</span>
            </CardTitle>
            <CardDescription>
              Insert, delete, or search key-value pairs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Key"
                onKeyDown={(e) => e.key === "Enter" && handleInsert()}
              />
              <Input
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Table
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HashTablePage;
