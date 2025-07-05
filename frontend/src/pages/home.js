import React from 'react';

export default function CurvedSplitPage() {
    return (
        <div className="relative w-full min-h-screen flex flex-col md:flex-row">

            {/* LEFT SECTION */}
            <div className="w-full md:w-1/2 bg-purple-200 p-10 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-black mb-4">Welcome to BudgetSync</h1>
                    <p className="text-gray-700">Track your expenses with style and ease!</p>
                </div>
            </div>

            {/* SVG CURVE */}
             <svg
        className="hidden md:block absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-10"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        width="80"
        height="100%"
      >
        <path
          d="M0,0 C50,50 50,50 100,0 L100,100 C50,50 50,50 0,100 Z"
          fill="#f4f4f4"
        />
      </svg>

            {/* RIGHT SECTION */}
            <div className="w-full md:w-1/2 bg-white p-10 flex items-center justify-center z-0">
                <div>
                    
                </div>
            </div>
        </div>
    );
}
