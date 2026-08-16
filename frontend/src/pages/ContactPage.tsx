import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* HERO BANNER */}
      <section className="bg-[#0B6B3A] pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Contact Us</h1>
           <p className="text-green-100 text-lg max-w-2xl mx-auto">
             We're here to help you manage your financial future. Reach out to our dedicated support team in Addis Ababa.
           </p>
        </motion.div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-12">
              
              {/* LEFT COLUMN: Info */}
              <ScrollReveal direction="left" className="w-full lg:w-1/3 space-y-6">
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B] mb-1">Our Office</h3>
                    <p className="text-slate-500 text-sm">Bole Road, Building 4B<br/>Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#0B6B3A]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B] mb-1">Call Us</h3>
                    <p className="text-slate-500 text-sm">+251 911 123 456<br/>Mon-Fri, 8:00 AM - 5:00 PM</p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E293B] mb-1">Email Support</h3>
                    <a href="mailto:support@saccomanager.com" className="text-[#0B6B3A] text-sm font-medium hover:underline">
                      support@saccomanager.com
                    </a>
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="w-full h-64 bg-slate-200 rounded-2xl overflow-hidden relative shadow-sm border border-slate-100 mt-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-slate-400 text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <span className="text-sm font-medium">Google Maps Integration</span>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                     <div className="w-6 h-6 bg-[#0B6B3A] rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                     </div>
                  </div>
                </div>

              </ScrollReveal>

              {/* RIGHT COLUMN: Form */}
              <ScrollReveal direction="right" className="w-full lg:w-2/3">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100">
                  <h2 className="text-3xl font-bold text-[#1E293B] mb-2">Send us a Message</h2>
                  <p className="text-slate-500 mb-8">Fill out the form below and our team will get back to you within 24 hours.</p>

                  {isSubmitted && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center gap-3"
                    >
                       <CheckCircle2 className="w-5 h-5" />
                       <p className="font-medium">Message sent successfully! We'll get back to you soon.</p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Abebe Bikila"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] outline-none transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="abebe@example.com"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Subject</label>
                      <select 
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] outline-none transition-colors appearance-none bg-white"
                        defaultValue=""
                      >
                        <option value="" disabled>Select an inquiry type</option>
                        <option value="general">General Inquiry</option>
                        <option value="support">Technical Support</option>
                        <option value="sales">Sales & Pricing</option>
                        <option value="partnership">Partnership</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Message</label>
                      <textarea 
                        required
                        rows={5}
                        placeholder="How can we help you today?"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#0B6B3A] focus:ring-1 focus:ring-[#0B6B3A] outline-none transition-colors resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-[#0B6B3A] hover:bg-[#065F46] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                    >
                      <Send className="w-5 h-5" />
                      Send Message
                    </button>
                  </form>
                </div>
              </ScrollReveal>

           </div>
        </div>
      </section>
    </div>
  );
}
