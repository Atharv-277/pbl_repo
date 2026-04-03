import React from "react";
import Navbar from "../Navbar";
import Faq from "./components/Faq";
import Footer from "../Footer";

export default function Service() {
    return (
        <div className="w-full min-h-screen">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <div
                className="w-full h-[85vh] bg-cover mt-15 bg-center flex flex-col justify-center items-start px-10 md:px-28"
                style={{
                    opacity: 1,
                    backgroundImage: `url('/src/assets/images/register.png')`,
                }}
            >
                <h1 className="text-white mt-50 text-4xl md:text-5xl font-bold mb-4">
                    Your Health, <br /> Our Priority
                </h1>
                <p className="text-white text-lg mb-6 max-w-xl">
                    Caring for you with compassion, technology, and trust
                </p>
                <div className="flex space-x-4">
                    <a
                        href="https://en.wikipedia.org/wiki/Apollo_Hospitals"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white text-white px-5 py-2 rounded-full font-semibold hover:bg-white hover:text-teal-700"
                    >
                        Learn More
                    </a>
                </div>
            </div>

            {/* About Us Section */}
            <div className="w-full flex flex-col md:flex-row items-center justify-center px-10 md:px-28 py-16 bg-gray-100">
                {/* Image */}
                <div className="md:w-1/2 w-full mb-8 md:mb-0">
                    <img
                        src="/src/assets/images/security.jpg" // Replace with your actual image path
                        alt="Data Security"
                        className="w-full h-auto rounded-lg shadow-md"
                    />
                </div>

                {/* Text */}
                <div className="md:w-1/2 w-full md:pl-10">
                    <h2 className="text-3xl font-bold mb-4 text-teal-700">About Us</h2>
                    <p className="text-lg text-gray-700">
                        While building this healthcare platform, we prioritized patient
                        privacy and data protection by strictly following HIPAA guidelines.
                        All patient information is fully encrypted and securely stored,
                        ensuring that your health data remains safe, confidential, and
                        accessible only to authorized professionals. Trust and safety are at
                        the core of everything we do.
                    </p>
                </div>
            </div>

            {/* FAQ */}
            <Faq />

            {/* Footer */}
            <Footer />
        </div>
    );
}
