import React from 'react'
import Image from 'next/image'
import Link from 'next/link';


const Home = () => {
  return (
    <section className="flex mt-18 justify-center items-center flex-col md:grid md:grid-cols-2 min-h-[60vh] w-full gap-4 p-4 md:p-12">
      <div className="bg-black rounded-2xl shadow-xl flex flex-col justify-center items-start text-white p-6 md:p-10 mb-4 md:mb-0">
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight text-white mb-2">
          Data Structure Visualizer
        </h1>
        <p className="text-base md:text-lg text-gray-200 mt-2 mb-6">
          Interactive tool for learning and understanding data structures through visual animations and step-by-step operations.
        </p>
        <Link href="#features" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg mt-2 font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
          Get Started &gt;
        </Link>
      </div>
      <div className="relative flex justify-center items-center h-56 md:h-80 w-full group">
        <div className="absolute inset-0 z-10 rounded-2xl pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <Image
          className="rounded-2xl border-2 border-white/20 shadow-2xl object-cover transition-transform duration-300 group-hover:scale-105 group-hover:shadow-3xl"
          src="/home.png"
          alt="Visualizer Preview"
          fill
          style={{objectFit: 'cover'}}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </section>
  );
}

export default Home