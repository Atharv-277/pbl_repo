import React from "react";



export default function Faq() {
        const faqItems = [
  {
    question: "How do I book an appointment with a doctor?",
    answer: "Simply log in as a patient, browse available doctors, choose a time slot, and confirm your booking.",
  },
  {
    question: "Can I reschedule or cancel my appointment?",
    answer: "Yes, go to your dashboard, open your appointments and use the reschedule or cancel option before the appointment time.",
  },
  {
    question: "Are online consultations available?",
    answer: "Yes, some doctors offer online consultations. You can filter and select them while booking.",
  },
  {
    question: "Is my medical data safe on this platform?",
    answer: "Absolutely. We follow strict data privacy policies and use encryption to protect your information.",
  },
  {
    question: "Can doctors access my previous reports?",
    answer: "Yes, if you’ve uploaded your reports, the doctor you book with will have access during your appointment.",
  },
  {
    question: "Do I need to create different accounts for doctor and patient?",
    answer: "Yes, patient and doctor accounts are separate to maintain functionality and access control.",
  },
  {
    question: "How do I register as a doctor?",
    answer: "Click on 'Sign Up', choose 'Doctor', and fill out your details including specialization and license info.",
  },
  {
    question: "Will I get reminders before my appointment?",
    answer: "Yes, patients and doctors both receive email or SMS reminders before scheduled appointments.",
  },
  {
    question: "Is there a consultation fee for every doctor?",
    answer: "Consultation fees vary by doctor and are mentioned clearly before booking an appointment.",
  },
];
    
  return (
    <div className="bg-gray-100 min-h-screen py-12 px-8  md:px-16">
      {/* Title */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">FAQ</h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          Problems trying to resolve the conflict between the two major realms
          of Classical physics: Newtonian mechanics
        </p>
      </div>

      {/* FAQ Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
        {faqItems.map((item, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded shadow hover:shadow-md transition"
          >
            <div className="flex items-start space-x-3">
              <div className="text-blue-500 text-xl">›</div>
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-1">
                  {item.question}
                </h4>
                <p className="text-sm text-gray-600">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Border (Decorative) */}
      <div className="w-20 h-1 bg-teal-600 mt-12 mx-auto rounded-full" />
    </div>
  );
}
