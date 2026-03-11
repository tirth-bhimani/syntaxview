"use client";

import { useState, useRef, useCallback, useEffect } from "react";
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
import { Trash2, Plus, Minus, Play, ToggleLeft, ToggleRight } from "lucide-react";

interface Vertex {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  from: string;
  to: string;
}

const GraphPage = () => {
  const [vertices, setVertices] = useState<Vertex[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [vertexLabel, setVertexLabel] = useState("");
  const [edgeFrom, setEdgeFrom] = useState("");
  const [edgeTo, setEdgeTo] = useState("");
  const [directed, setDirected] = useState(false);
  const [highlighted, setHighlighted] = useState<string[]>([]);
  const [highlightedEdges, setHighlightedEdges] = useState<string[]>([]);
  const [traversalResult, setTraversalResult] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleAddVertex = useCallback(() => {
    const label = vertexLabel.trim();
    if (!label) {
      alert("Please enter a vertex label.");
      return;
    }
    if (vertices.find((v) => v.label === label)) {
      alert("A vertex with this label already exists.");
      return;
    }
    const newVertex: Vertex = {
      id: `v-${Date.now()}`,
      label,
      x: 100 + Math.random() * 500,
      y: 80 + Math.random() * 250,
    };
    setVertices((prev) => [...prev, newVertex]);
    setVertexLabel("");
  }, [vertexLabel, vertices]);

  const handleAddEdge = useCallback(() => {
    const from = edgeFrom.trim();
    const to = edgeTo.trim();
    if (!from || !to) {
      alert("Please enter both 'from' and 'to' vertex labels.");
      return;
    }
    const fromVertex = vertices.find((v) => v.label === from);
    const toVertex = vertices.find((v) => v.label === to);
    if (!fromVertex || !toVertex) {
      alert("Both vertices must exist in the graph.");
      return;
    }
    const exists = edges.find(
      (e) =>
        (e.from === fromVertex.id && e.to === toVertex.id) ||
        (!directed && e.from === toVertex.id && e.to === fromVertex.id)
    );
    if (exists) {
      alert("This edge already exists.");
      return;
    }
    setEdges((prev) => [
      ...prev,
      { id: `e-${Date.now()}`, from: fromVertex.id, to: toVertex.id },
    ]);
    setEdgeFrom("");
    setEdgeTo("");
  }, [edgeFrom, edgeTo, vertices, edges, directed]);

  const handleRemoveVertex = useCallback(() => {
    const label = vertexLabel.trim();
    const vertex = vertices.find((v) => v.label === label);
    if (!vertex) {
      alert("Vertex not found.");
      return;
    }
    setEdges((prev) =>
      prev.filter((e) => e.from !== vertex.id && e.to !== vertex.id)
    );
    setVertices((prev) => prev.filter((v) => v.id !== vertex.id));
    setVertexLabel("");
  }, [vertexLabel, vertices]);

  // Build adjacency list
  const buildAdjList = useCallback(() => {
    const adj: Record<string, string[]> = {};
    vertices.forEach((v) => (adj[v.id] = []));
    edges.forEach((e) => {
      adj[e.from]?.push(e.to);
      if (!directed) adj[e.to]?.push(e.from);
    });
    return adj;
  }, [vertices, edges, directed]);

  const animateTraversal = useCallback(
    (order: string[], edgeOrder: [string, string][]) => {
      setHighlighted([]);
      setHighlightedEdges([]);
      const labels = order.map(
        (id) => vertices.find((v) => v.id === id)?.label || id
      );
      setTraversalResult(`Traversal: [${labels.join(" → ")}]`);

      order.forEach((id, i) => {
        setTimeout(() => {
          setHighlighted((prev) => [...prev, id]);
        }, i * 500);
      });
      edgeOrder.forEach(([from, to], i) => {
        setTimeout(() => {
          setHighlightedEdges((prev) => [...prev, `${from}-${to}`]);
        }, i * 500 + 250);
      });
      setTimeout(() => {
        setHighlighted([]);
        setHighlightedEdges([]);
      }, order.length * 500 + 1000);
    },
    [vertices]
  );

  const handleBFS = useCallback(() => {
    if (vertices.length === 0) return;
    const adj = buildAdjList();
    const visited = new Set<string>();
    const queue = [vertices[0].id];
    const order: string[] = [];
    const edgeOrder: [string, string][] = [];
    visited.add(vertices[0].id);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      order.push(curr);
      for (const neighbor of adj[curr] || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          edgeOrder.push([curr, neighbor]);
        }
      }
    }
    animateTraversal(order, edgeOrder);
  }, [vertices, buildAdjList, animateTraversal]);

  const handleDFS = useCallback(() => {
    if (vertices.length === 0) return;
    const adj = buildAdjList();
    const visited = new Set<string>();
    const order: string[] = [];
    const edgeOrder: [string, string][] = [];

    const dfs = (id: string) => {
      visited.add(id);
      order.push(id);
      for (const neighbor of adj[id] || []) {
        if (!visited.has(neighbor)) {
          edgeOrder.push([id, neighbor]);
          dfs(neighbor);
        }
      }
    };
    dfs(vertices[0].id);
    animateTraversal(order, edgeOrder);
  }, [vertices, buildAdjList, animateTraversal]);

  const handleClear = () => {
    setVertices([]);
    setEdges([]);
    setHighlighted([]);
    setHighlightedEdges([]);
    setTraversalResult(null);
  };

  // Drag handlers
  const handleMouseDown = useCallback((id: string) => {
    setDragging(id);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !svgRef.current) return;
      const svg = svgRef.current;
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      setVertices((prev) =>
        prev.map((v) =>
          v.id === dragging
            ? { ...v, x: Math.max(20, Math.min(780, svgP.x)), y: Math.max(20, Math.min(380, svgP.y)) }
            : v
        )
      );
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, handleMouseMove, handleMouseUp]);

  const getVertex = (id: string) => vertices.find((v) => v.id === id);

  return (
    <div className="flex flex-col gap-4 md:gap-8 text-white h-full">
      <div className="lg:col-span-2">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Graph
          </h1>
          <p className="mt-2 text-md sm:text-lg text-white/70">
            A non-linear data structure consisting of vertices (nodes) connected
            by edges. Supports BFS and DFS traversals.
          </p>
        </div>

        {/* Visualization */}
        <div className="p-4 bg-black/30 rounded-xl border border-cyan-500/20 min-h-[400px] overflow-hidden">
          {vertices.length === 0 ? (
            <div className="flex items-center justify-center h-[360px] text-white/50">
              Graph is empty — add a vertex to begin
            </div>
          ) : (
            <svg
              ref={svgRef}
              width="800"
              height="400"
              className="mx-auto cursor-default select-none"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="28"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="rgba(6,182,212,0.6)"
                  />
                </marker>
              </defs>
              {/* Edges */}
              {edges.map((edge) => {
                const from = getVertex(edge.from);
                const to = getVertex(edge.to);
                if (!from || !to) return null;
                const isHighlighted =
                  highlightedEdges.includes(`${edge.from}-${edge.to}`) ||
                  highlightedEdges.includes(`${edge.to}-${edge.from}`);
                return (
                  <motion.line
                    key={edge.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? "#06b6d4" : "rgba(6,182,212,0.3)"}
                    strokeWidth={isHighlighted ? 3 : 2}
                    markerEnd={directed ? "url(#arrowhead)" : undefined}
                    className="transition-all duration-300"
                  />
                );
              })}
              {/* Vertices */}
              <AnimatePresence>
                {vertices.map((v) => (
                  <motion.g
                    key={v.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    style={{ cursor: "grab" }}
                    onMouseDown={() => handleMouseDown(v.id)}
                  >
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r={22}
                      fill={
                        highlighted.includes(v.id)
                          ? "rgba(6,182,212,0.6)"
                          : "rgba(6,182,212,0.1)"
                      }
                      stroke={
                        highlighted.includes(v.id) ? "#06b6d4" : "#0891b2"
                      }
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    <text
                      x={v.x}
                      y={v.y + 5}
                      textAnchor="middle"
                      fill="white"
                      fontSize="13"
                      fontWeight="bold"
                      style={{ pointerEvents: "none" }}
                    >
                      {v.label}
                    </text>
                  </motion.g>
                ))}
              </AnimatePresence>
            </svg>
          )}
        </div>

        {traversalResult && (
          <div className="mt-3 p-3 bg-black/40 rounded-xl border border-cyan-500/10 text-sm text-cyan-300 font-mono">
            {traversalResult}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="lg:col-span-1">
        <Card className="bg-black/50 backdrop-blur-lg border border-cyan-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              <span>Modify Graph</span>
            </CardTitle>
            <CardDescription>
              Add/remove vertices and edges. Drag nodes to reposition.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Directed toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Graph Type</span>
              <Button
                onClick={() => setDirected((d) => !d)}
                variant="outline"
                size="sm"
                className="bg-transparent border-cyan-500/20 text-white text-xs gap-1"
              >
                {directed ? (
                  <ToggleRight className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ToggleLeft className="w-4 h-4" />
                )}
                {directed ? "Directed" : "Undirected"}
              </Button>
            </div>

            {/* Add Vertex */}
            <div className="flex gap-2">
              <Input
                value={vertexLabel}
                onChange={(e) => setVertexLabel(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="Vertex label"
                onKeyDown={(e) => e.key === "Enter" && handleAddVertex()}
              />
              <Button
                onClick={handleAddVertex}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white shrink-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleRemoveVertex}
                variant="outline"
                className="bg-transparent border-red-500/40 hover:bg-red-500/20 text-white shrink-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>

            {/* Add Edge */}
            <div className="flex gap-2">
              <Input
                value={edgeFrom}
                onChange={(e) => setEdgeFrom(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="From"
              />
              <Input
                value={edgeTo}
                onChange={(e) => setEdgeTo(e.target.value)}
                className="bg-transparent border-cyan-500/30 focus:border-cyan-500"
                placeholder="To"
              />
              <Button
                onClick={handleAddEdge}
                className="bg-cyan-500/20 hover:bg-cyan-500/30 text-white shrink-0"
              >
                Edge
              </Button>
            </div>

            {/* Traversals */}
            <div className="pt-2 border-t border-cyan-500/10">
              <p className="text-xs text-white/50 mb-2 flex items-center gap-1">
                <Play className="w-3 h-3" /> Traversals
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={handleBFS}
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-cyan-500/20 text-white text-xs hover:bg-cyan-500/10"
                >
                  BFS
                </Button>
                <Button
                  onClick={handleDFS}
                  size="sm"
                  variant="outline"
                  className="bg-transparent border-cyan-500/20 text-white text-xs hover:bg-cyan-500/10"
                >
                  DFS
                </Button>
              </div>
            </div>

            <Button
              onClick={handleClear}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Graph
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GraphPage;
