import React from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useState } from "react";
import { toast } from 'react-toastify';

//Handling Contacts
const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handlesubmit = (e) => {
    e.preventDefault();
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
      terms: false,
      
    });
    toast.success("Thanks For the feedback");
  };
  return (
    <>
      <Navbar></Navbar>
      <div>
        <img
          className="w-full h-180"
                          src="/src/assets/images/29a183e94cfaa1c70f9923b9dff53e831733a031.jpg"
          alt=""
          srcset=""
        />
      </div>
      <div className="w-full bg-white rounded-none shadow-none py-10 px-4 sm:px-12 md:px-28">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-xs font-semibold text-gray-600 mb-2">
            Get In Touch
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h2>
          <p className="text-gray-400 text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
        {/* Form */}
        <form
          className="flex flex-col gap-4 max-w-3xl mx-auto"
          onSubmit={handlesubmit}
        >
          {/* Name fields */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">
                First name
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                placeholder="Enter your first name"
                className=" text-black w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">
                Last name
              </label>
              <input name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                placeholder="Enter your last name"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
          </div>
          {/* Email and Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">Email</label>
              <input name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">
                Phone number
              </label>
              <input name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
            </div>
          </div>
          {/* Topic selection */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Choose a topic
            </label>
            <select name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Select one…
              </option>
              <option value="support">Support</option>
              <option value="sales">Sales</option>
              <option value="feedback">Feedback</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* Message */}
          <div>
            <label className="block text-gray-700 text-sm mb-1">Message</label>
            <textarea name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message…"
              className="w-full border border-gray-300 rounded px-4 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
              required
            />
          </div>
          {/* Terms */}
          <div className="flex items-center gap-2 mt-2">
            <input name="terms"
              checked={formData.terms}
              onChange={handleChange}
              type="checkbox"
              id="terms"
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-400 focus:ring-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I accept the terms
            </label>
          </div>
          {/* Submit button */}
          <button
            type="submit"
            className="w-[20vh] mt-4 flex justify-center items-center ml-[25rem] cursor-pointer bg-[#179fac] hover:bg-[#147c88] text-white font-semibold py-2 rounded transition"
          >
            Submit
          </button>
        </form>
      </div>
      <Footer></Footer>
    </>
  );
};

export default Contact;
