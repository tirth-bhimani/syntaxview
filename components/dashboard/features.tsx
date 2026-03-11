import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const featuresData = [
  {
    title: "Array",
    description:
      "A fixed-size list where all items are of the same type, accessed by a numerical index.",
    imgSrc: "/array.png",
    href: "/array",
  },
  {
    title: "Stack",
    description:
      "Follows a Last-In, First-Out (LIFO) principle, where elements are added and removed from the same end.",
    imgSrc: "/stack.png",
    href: "/stack",
  },
  {
    title: "Queue",
    description:
      "A First-In, First-Out (FIFO) data structure where elements are added and removed from the other.",
    imgSrc: "/queue.png",
    href: "/queue",
  },
  {
    title: "Linked List",
    description:
      "A data structure of nodes, where each node contains data and a pointer that links to the next node.",
    imgSrc: "/linked-list.png",
    href: "/linked-list",
  },
  {
    title: "Binary Tree",
    description:
      "A hierarchical structure where each node has at most two children, enabling efficient search and traversal.",
    imgSrc: null,
    href: "/binary-tree",
    gradient: "from-emerald-500 to-cyan-500",
    emoji: "🌳",
  },
  {
    title: "Graph",
    description:
      "A non-linear structure of vertices connected by edges, supporting BFS and DFS traversals.",
    imgSrc: null,
    href: "/graph",
    gradient: "from-purple-500 to-pink-500",
    emoji: "🔗",
  },
  {
    title: "Hash Table",
    description:
      "Maps keys to values using a hash function for fast O(1) average-time lookups and inserts.",
    imgSrc: null,
    href: "/hash-table",
    gradient: "from-amber-500 to-orange-500",
    emoji: "#️⃣",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          Explore Data Structures
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresData.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl bg-gray-900/50 border border-cyan-500/20 shadow-xl backdrop-blur-lg transition-all duration-300 ease-in-out hover:border-cyan-400/50 hover:shadow-cyan-500/30 hover:-translate-y-2"
            >
              <CardHeader className="p-0">
                <div className="relative h-48 w-full">
                  {feature.imgSrc ? (
                    <>
                      <Image
                        src={feature.imgSrc}
                        alt={feature.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    </>
                  ) : (
                    <div
                      className={`h-full w-full bg-gradient-to-br ${feature.gradient || "from-cyan-500 to-purple-500"} flex items-center justify-center`}
                    >
                      <span className="text-6xl">{feature.emoji}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 text-center">
                <CardTitle className="text-2xl font-bold text-white">
                  {feature.title}
                </CardTitle>
                <CardDescription className="mt-2 text-gray-300 min-h-[60px]">
                  {feature.description}
                </CardDescription>
                <button className="mt-4 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:bg-cyan-500/20">
                  <Link href={feature.href}>Learn More</Link>
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
