import ContactSection from "../components/ContactSection";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5] dark:bg-[#0B0F19] transition-colors duration-300">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#5C32E6] to-[#4522B8] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-extrabold uppercase tracking-widest text-purple-200 bg-white/10 px-4 py-1.5 rounded-full inline-block mb-4">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Let's Talk About Your Next Land Deal
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Whether you want to buy, sell, or request a free land valuation strategy, our real estate experts are here for you.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 w-full mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-purple-50 dark:border-slate-800 flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 text-[#5C32E6] dark:text-[#9B80FF] flex items-center justify-center shrink-0 border border-purple-100 dark:border-slate-700">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Call Us</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Mon-Sat from 9am to 8pm</p>
              <a href="tel:+919948720849" className="text-[#5C32E6] dark:text-[#9B80FF] font-bold hover:underline">
                +91 99487 20849
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-purple-50 dark:border-slate-800 flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 text-[#5C32E6] dark:text-[#9B80FF] flex items-center justify-center shrink-0 border border-purple-100 dark:border-slate-700">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Email Us</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Instant email support</p>
              <a href="mailto:hello@buildestate.agency" className="text-[#5C32E6] dark:text-[#9B80FF] font-bold hover:underline">
                hello@buildestate.agency
              </a>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-purple-50 dark:border-slate-800 flex items-start gap-4 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-slate-800 text-[#5C32E6] dark:text-[#9B80FF] flex items-center justify-center shrink-0 border border-purple-100 dark:border-slate-700">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Head Office</h3>
              <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">Visakhapatnam, Andhra Pradesh</p>
              <span className="text-[#5C32E6] dark:text-[#9B80FF] font-bold text-sm">
                Madhurawada Main Rd
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Lead Strategy Form Section */}
      <ContactSection />
    </div>
  );
}
