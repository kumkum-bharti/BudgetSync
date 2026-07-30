import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CurvedSplitPage() {
    const navigate = useNavigate();
    const data = [20, 30, 40, 80, 100];

    const AnimatedBarChart = () => {
        const [animatedHeights, setAnimatedHeights] = useState(Array(data.length).fill(0));

        useEffect(() => {
            const timer = setTimeout(() => {
                setAnimatedHeights(data);
            }, 200);
            return () => clearTimeout(timer);
        }, []);

        const maxHeight = Math.max(...data);

        useEffect(() => {
            const timer = setTimeout(() => {
                navigate('/login');
            }, 5000);

            return () => clearTimeout(timer);
        }, [navigate]);


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
                    <div className="bg-white shadow-md p-6 rounded-xl max-w-md mx-auto mt-5 w-full">
                        <h2 className="text-xl font-bold text-gray-800 mb-4"> Budget Analytics</h2>
                        <div className="flex items-end space-x-8 h-[300px] w-full relative">

                            {animatedHeights.map((val, idx) => (
                                <div
                                    key={idx}
                                    className="w-6 bg-purple-500 rounded-t transition-all duration-1000 ease-out"
                                    style={{ height: `${val}%` }}
                                ></div>
                            ))}

                            {/* Animated arrow on tallest bar */}
                            <div
                                className="absolute text-black transition-all duration-1000 ease-out"
                                style={{
                                    right: 0,
                                    bottom: `${maxHeight}%`,
                                    transform: "translateY(50%)",
                                }}
                            >
                                <svg
                                    className="w-6 h-6 animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                </svg>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-2 text-right">+12.5% this month</p>
                    </div>
                </div>
            </div>
        );
    };

    return <AnimatedBarChart />;
}