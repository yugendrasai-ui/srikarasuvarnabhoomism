import { useState } from "react";
import { Mail, Send, CheckCircle2, Sparkles, PhoneCall, MessageSquare } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    goals: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", goals: "" });
    }, 800);
  };

  return (
    <section id="contact" className="py-12 md:py-28 bg-gradient-to-b from-[#F5F3FF] via-[#FAF8FF] to-[#F0F2F5] relative overflow-hidden">
      {/* Soft Decorative Background Circles */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Heading & 3 Stacked Contact Pill Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full pt-4">
            <div>
              {/* Tag line */}
              <div className="flex items-center gap-2 mb-6">
                <span className="h-[2px] w-6 bg-[#5C32E6]"></span>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#5C32E6]">
                  — CONTACT
                </span>
              </div>

              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 leading-[1.15] mb-5 tracking-tight">
                Get your free{" "}
                <span className="text-[#5C32E6] relative inline-block">
                  property strategy.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#5C32E6]/25" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <path d="M0 15 Q 50 0, 100 15" stroke="currentColor" strokeWidth="8" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-base text-gray-600 leading-relaxed mb-6 sm:mb-8 max-w-lg">
                Tell us about your land or property goals and we'll send you a custom investment plan & market valuation report within 24 hours — no strings attached.
              </p>

              {/* Strategy Features Checklist */}
              <div className="space-y-3 mb-6 sm:mb-10">
                {[
                  "Free RERA legal title check & risk assessment",
                  "Locality price trends & 3-year ROI projections",
                  "Direct connection with verified plot sellers",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-[#5C32E6] shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3 Contact Info Pill Cards (Matching exact reference screenshot layout) */}
            <div className="space-y-3 max-w-full lg:max-w-md">
              {/* Card 1: Email us */}
              <a
                href="mailto:hello@buildestate.agency"
                className="bg-white rounded-full px-4 sm:px-6 py-3 sm:py-4 border border-purple-100 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center gap-3 sm:gap-4 group block"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#5C32E6] to-[#4522B8] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-[#5C32E6]/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Email us</span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#5C32E6] transition-colors truncate">
                    hello@buildestate.agency
                  </span>
                </div>
              </a>

              {/* Card 2: Chat on WhatsApp */}
              <a
                href="https://wa.me/919948720849"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-full px-4 sm:px-6 py-3 sm:py-4 border border-emerald-100 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center gap-3 sm:gap-4 group block"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-[#25D366]/20">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Chat on WhatsApp</span>
                  <span className="text-base font-bold text-gray-900 group-hover:text-[#25D366] transition-colors">
                    +91 99487 20849
                  </span>
                </div>
              </a>

              {/* Card 3: Call us */}
              <a
                href="tel:+919948720849"
                className="bg-white rounded-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200 flex items-center gap-3 sm:gap-4 group block"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#2E282A] flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-md shadow-gray-900/20">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 block">Call us</span>
                  <span className="text-base font-bold text-gray-900 group-hover:text-[#5C32E6] transition-colors">
                    +91 99487 20849
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Lead Form (matching website branding) */}
          <div className="lg:col-span-7">
            <div className="bg-white/95 backdrop-blur-md rounded-[1.5rem] sm:rounded-[2.5rem] p-5 sm:p-10 lg:p-12 shadow-2xl border border-purple-50 relative">
              
              {/* Audit Badge */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Free Real Estate Audit & Plan
                  </span>
                </div>
                <span className="text-xs font-bold text-[#5C32E6] bg-purple-50 px-3 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Response within 24h
                </span>
              </div>

              {submitted ? (
                <div className="py-12 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Strategy Request Received!</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-8 text-sm">
                    Thank you! Our property advisory team is reviewing your requirements and will send your custom report shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-[#5C32E6] hover:bg-[#4522B8] text-white font-bold px-8 py-3 rounded-full text-sm transition-all shadow-lg shadow-[#5C32E6]/25"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Your Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2">
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-[#FBFBFC] border border-gray-200 focus:border-[#5C32E6] focus:ring-4 focus:ring-[#5C32E6]/10 rounded-2xl sm:rounded-full px-6 py-4 text-gray-900 placeholder-gray-400 font-medium text-sm transition-all outline-none"
                    />
                  </div>

                  {/* Email & Phone grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-2">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full bg-[#FBFBFC] border border-gray-200 focus:border-[#5C32E6] focus:ring-4 focus:ring-[#5C32E6]/10 rounded-2xl sm:rounded-full px-6 py-4 text-gray-900 placeholder-gray-400 font-medium text-sm transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-2">
                        Phone <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#FBFBFC] border border-gray-200 focus:border-[#5C32E6] focus:ring-4 focus:ring-[#5C32E6]/10 rounded-2xl sm:rounded-full px-6 py-4 text-gray-900 placeholder-gray-400 font-medium text-sm transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Tell us about your goals */}
                  <div>
                    <label htmlFor="goals" className="block text-sm font-bold text-gray-800 mb-2">
                      Tell us about your goals
                    </label>
                    <textarea
                      id="goals"
                      rows={4}
                      required
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      placeholder="What are you trying to invest in or sell — plot size, preferred locality, budget? Any current challenges?"
                      className="w-full bg-[#FBFBFC] border border-gray-200 focus:border-[#5C32E6] focus:ring-4 focus:ring-[#5C32E6]/10 rounded-3xl p-6 text-gray-900 placeholder-gray-400 font-medium text-sm transition-all outline-none resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#5C32E6] to-[#4522B8] hover:from-[#4522B8] hover:to-[#361A99] text-white font-extrabold py-5 px-8 rounded-full text-base shadow-xl shadow-[#5C32E6]/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-[#75]" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Preparing Strategy...
                      </span>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 font-medium pt-2">
                    🔒 100% confidential. No spam guaranteed.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
