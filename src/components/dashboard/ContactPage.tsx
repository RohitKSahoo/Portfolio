import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Terminal, Send, Clock, ArrowRight, User, AtSign, AlignLeft, MessageSquare, X } from 'lucide-react';

export const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden font-inter" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 relative z-10">
        {/* Left Column (7/12) */}
        <div className="lg:col-span-7 flex flex-col justify-between py-4">
          <div className="relative">

            <h2 className="text-[11vw] sm:text-7xl lg:text-[7rem] font-extrabold font-satoshi tracking-tight leading-none mb-3 text-white mt-1 break-words">
              Let's build<br />something<br />
              <span className="text-red-500">extraordinary.</span>
            </h2>
            <p className="text-base text-white/60 max-w-xl font-inter leading-relaxed mb-4">
              I'm always open to collaborations, exciting projects, and impactful ideas. Let's connect!
            </p>

            {/* Action Area: Get in Touch + Button */}
            <div className="flex flex-row items-center gap-4 mt-2 flex-wrap">
              <span className="text-sm font-satoshi font-medium text-red-500 tracking-wider uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Get In Touch
              </span>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative inline-flex items-center justify-between gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full py-2.5 px-5 w-auto hover:border-red-500/30 transition-all duration-300"
              >
                <span className="text-sm font-bold font-satoshi text-white">Send a Message</span>
                <div className="w-6 h-6 border border-white/10 rounded-full flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/5 transition-all">
                  <ArrowRight size={12} className="text-white/50 group-hover:text-red-500 transition-all" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6 py-4 justify-center">
          <div className="text-xs font-satoshi font-medium text-white/40 tracking-wider mb-2">
            <span>CONNECT VIA</span>
            <div className="w-10 h-0.5 bg-red-500 mt-1" />
          </div>

          {/* Email Card */}
          <a href="mailto:rohitkumarsahoo37@gmail.com" className="p-6 bg-[#0d0d0d] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-satoshi text-white">Email</h3>
                <p className="text-sm text-white/40 font-inter">rohitkumarsahoo37@gmail.com</p>
              </div>
            </div>
            <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/5 transition-all">
              <ArrowRight size={14} className="text-white/50 group-hover:text-red-500 transition-all" />
            </div>
          </a>

          {/* GitHub Card */}
          <a href="https://github.com/RohitKSahoo" target="_blank" rel="noopener noreferrer" className="p-6 bg-[#0d0d0d] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
                <Github size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-satoshi text-white">GitHub</h3>
                <p className="text-sm text-white/40 font-inter">github.com/RohitKSahoo</p>
              </div>
            </div>
            <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/5 transition-all">
              <ArrowRight size={14} className="text-white/50 group-hover:text-red-500 transition-all" />
            </div>
          </a>

          {/* LinkedIn Card */}
          <a href="https://linkedin.com/in/rohitksahoo" target="_blank" rel="noopener noreferrer" className="p-6 bg-[#0d0d0d] border border-white/5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="p-4 bg-red-500/10 text-red-500 rounded-lg">
                <Linkedin size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold font-satoshi text-white">LinkedIn</h3>
                <p className="text-sm text-white/40 font-inter">linkedin.com/in/rohitksahoo</p>
              </div>
            </div>
            <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/5 transition-all">
              <ArrowRight size={14} className="text-white/50 group-hover:text-red-500 transition-all" />
            </div>
          </a>
        </div>
      </div>

      {/* Bottom Bar Removed */}

      {/* Modal / Popup Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-xl bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col gap-6"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>

              <div>
                <span className="text-[0.65rem] font-satoshi font-medium text-red-500 uppercase tracking-wider">CONTACT FORM</span>
                <h3 className="text-2xl font-bold font-satoshi text-white mt-1">Send a Message</h3>
                <p className="text-xs text-white/40 font-inter mt-1">Fill in the details below and I'll get back to you.</p>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
                      <User size={16} />
                    </div>
                    <input type="text" placeholder="Your Name" className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter" />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
                      <AtSign size={16} />
                    </div>
                    <input type="email" placeholder="Your Email" className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter" />
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
                    <AlignLeft size={16} />
                  </div>
                  <input type="text" placeholder="Subject" className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter" />
                </div>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-white/20">
                    <MessageSquare size={16} />
                  </div>
                  <textarea placeholder="Your Message" rows={4} className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter resize-none" />
                </div>
                
                <button className="w-full py-3.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-bold font-satoshi flex justify-between items-center px-6 hover:from-red-500 hover:to-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <span>Submit Message</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactPage;
