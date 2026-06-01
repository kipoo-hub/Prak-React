import { useState } from "react";

export default function FAQSection({ faqs = [] }) {
    const [openIndex, setOpenIndex] = useState(null);

    return (
        <div className="my-12">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <button 
                            className="w-full text-left px-6 py-4 font-semibold text-gray-800 flex justify-between items-center hover:bg-gray-50 transition-colors"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            {faq.question}
                            <span className={`transform transition-transform ${openIndex === index ? "rotate-180" : ""}`}>
                                ▼
                            </span>
                        </button>
                        {openIndex === index && (
                            <div className="px-6 pb-4 text-gray-600 animate-fade-in">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
