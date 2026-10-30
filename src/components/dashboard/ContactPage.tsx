import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Send, ArrowRight, User, AtSign, AlignLeft, MessageSquare, X, Instagram } from 'lucide-react';
import VariableProximity from '../effects/VariableProximity';
import GlassSurface from '../effects/GlassSurface';

export const ContactPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '', honeypot: '' });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const fullText1 = "Let's build";
  const fullText2 = "something";
  const fullText3 = "extraordinary.";

  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [text3, setText3] = useState('');

  useEffect(() => {
    let currentText = '';
    let i = 0;
    const speed = 50;

    const type1 = () => {
      if (i < fullText1.length) {
        currentText += fullText1[i];
        setText1(currentText + '|');
        i++;
        setTimeout(type1, speed);
      } else {
        setText1(fullText1);
        currentText = '';
        i = 0;
        setTimeout(type2, speed);
      }
    };

    const type2 = () => {
      if (i < fullText2.length) {
        currentText += fullText2[i];
        setText2(currentText + '|');
        i++;
        setTimeout(type2, speed);
      } else {
        setText2(fullText2);
        currentText = '';
        i = 0;
        setTimeout(type3, speed);
      }
    };

    const type3 = () => {
      if (i < fullText3.length) {
        currentText += fullText3[i];
        setText3(currentText + '|');
        i++;
        setTimeout(type3, speed);
      } else {
        setText3(fullText3);
      }
    };

    type1();
  }, []);

  const handleSubmit = async () => {
    // Honeypot check
    if (formData.honeypot) {
      setError('Spam detected.');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.message.length < 10) {
      setError('Message must be at least 10 characters.');
      return;
    }

    // Rate limiting (5 minutes)
    const lastSent = localStorage.getItem('lastEmailSent');
    const now = Date.now();
    if (lastSent && now - parseInt(lastSent) < 5 * 60 * 1000) {
      const waitTime = Math.ceil((5 * 60 * 1000 - (now - parseInt(lastSent))) / 1000 / 60);
      setError(`Please wait ${waitTime} minute(s) before sending another message.`);
      return;
    }

    setIsSending(true);
    setError('');
    
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');
      
      setIsSent(true);
      localStorage.setItem('lastEmailSent', now.toString());
      setFormData({ name: '', email: '', subject: '', message: '', honeypot: '' });
      setTimeout(() => {
        setIsSent(false);
        setIsModalOpen(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 relative overflow-hidden font-inter">
      

      {/* Main Content Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-9 min-h-0 relative z-10 pt-6 lg:pt-10">
        {/* Left Column (7/12) */}
        <div className="lg:col-span-7 flex flex-col justify-between py-0">
          <div className="relative">

            <h2 ref={containerRef} className="text-[11vw] sm:text-7xl lg:text-[7rem] font-extrabold font-satoshi tracking-tight leading-none mb-3 text-white mt-1 break-words">
              <VariableProximity label={text1} containerRef={containerRef} radius={110} falloff="linear" fromFontVariationSettings="'wght' 400, 'opsz' 9" toFontVariationSettings="'wght' 1000, 'opsz' 40" /><br />
              <VariableProximity label={text2} containerRef={containerRef} radius={110} falloff="linear" fromFontVariationSettings="'wght' 400, 'opsz' 9" toFontVariationSettings="'wght' 1000, 'opsz' 40" /><br />
              <span className="text-red-500">
                <VariableProximity label={text3} containerRef={containerRef} radius={110} falloff="linear" fromFontVariationSettings="'wght' 400, 'opsz' 9" toFontVariationSettings="'wght' 1000, 'opsz' 40" />
              </span>
            </h2>
            <p className="text-base text-white/60 max-w-xl font-inter leading-relaxed mb-[28px]">
              I'm always open to collaborations, exciting projects, and impactful ideas.
            </p>

            {/* Action Area: Get in Touch + Button */}
            <div className="flex flex-row items-center gap-4 mt-2 flex-wrap">
              <span className="text-sm font-satoshi font-medium text-red-500 tracking-wider uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                Get In Touch
              </span>
              
              <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative block focus:outline-none cursor-pointer rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <GlassSurface
                  width="auto"
                  height={44}
                  borderRadius={22}
                  distortionScale={-90}
                  displace={0.3}
                  backgroundOpacity={0.14}
                  saturation={1.2}
                  redOffset={18}
                  greenOffset={5}
                  blueOffset={10}
                  className="border border-red-500/40 group-hover:border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.25)] group-hover:shadow-[0_0_28px_rgba(239,68,68,0.45)] transition-all"
                >
                  <div className="flex items-center justify-between gap-4 px-5 py-1 text-white font-bold font-satoshi text-sm">
                    <span className="group-hover:text-red-400 transition-colors">Send a Message</span>
                    <div className="w-6 h-6 border border-white/10 rounded-full flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all">
                      <ArrowRight size={12} className="text-white/50 group-hover:text-red-500 transition-all" />
                    </div>
                  </div>
                </GlassSurface>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6 py-0">
          <div className="text-sm font-satoshi font-bold text-white/50 tracking-wider mb-1 mt-1">
            <span>SOCIALS</span>
            <div className="w-12 h-0.5 bg-red-500 mt-1" />
          </div>

          {[
            {
              name: 'Email',
              handle: 'rohitkumarsahoo37@gmail.com',
              href: 'mailto:rohitkumarsahoo37@gmail.com',
              icon: Mail,
              external: false,
            },
            {
              name: 'GitHub',
              handle: 'github.com/RohitKSahoo',
              href: 'https://github.com/RohitKSahoo',
              icon: Github,
              external: true,
            },
            {
              name: 'LinkedIn',
              handle: 'linkedin.com/in/rohitksahoo',
              href: 'https://linkedin.com/in/rohitksahoo',
              icon: Linkedin,
              external: true,
            },
            {
              name: 'Instagram',
              handle: '@rohitks.2407',
              href: 'https://www.instagram.com/rohitks.2407?igsh=MTU4c3hhMGI1eXdqMQ==',
              icon: Instagram,
              external: true,
            },
          ].map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.name}
                href={social.href}
                {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group relative block focus:outline-none cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
              >
                <GlassSurface
                  width="100%"
                  height="auto"
                  borderRadius={12}
                  distortionScale={-70}
                  displace={0.2}
                  backgroundOpacity={0.08}
                  saturation={1.1}
                  redOffset={8}
                  greenOffset={4}
                  blueOffset={12}
                  className="w-full border border-white/10 group-hover:border-red-500/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_rgba(239,68,68,0.15)] transition-all"
                >
                  <div className="p-5 sm:p-6 w-full flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="p-3.5 sm:p-4 bg-red-500/10 text-red-500 rounded-lg group-hover:bg-red-500/20 group-hover:scale-105 transition-all">
                        <Icon size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold font-satoshi text-white group-hover:text-red-400 transition-colors">
                          {social.name}
                        </h3>
                        <p className="text-sm text-white/40 font-inter group-hover:text-white/60 transition-colors">
                          {social.handle}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 border border-white/10 rounded-full flex items-center justify-center group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all">
                      <ArrowRight size={14} className="text-white/50 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </GlassSurface>
              </a>
            );
          })}
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
                    <input 
                      type="text" 
                      placeholder="Your Name" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter" 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
                      <AtSign size={16} />
                    </div>
                    <input 
                      type="email" 
                      placeholder="Your Email" 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter" 
                    />
                  </div>
                </div>
                {/* Honeypot Field */}
                <div className="hidden" aria-hidden="true">
                  <input 
                    type="text" 
                    name="honeypot" 
                    value={formData.honeypot}
                    onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20">
                    <AlignLeft size={16} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Subject" 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter" 
                  />
                </div>
                <div className="relative">
                  <div className="absolute top-4 left-4 pointer-events-none text-white/20">
                    <MessageSquare size={16} />
                  </div>
                  <textarea 
                    placeholder="Your Message" 
                    rows={4} 
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black border border-white/5 rounded-lg py-3.5 pl-12 pr-4 text-sm text-white placeholder-white/20 focus:border-red-500/50 focus:outline-none transition-all font-inter resize-none" 
                  />
                </div>
                
                {error && <p className="text-xs text-red-500 font-inter">{error}</p>}
                {isSent && <p className="text-xs text-green-500 font-inter">Message sent successfully!</p>}

                <button 
                  onClick={handleSubmit}
                  disabled={isSending || isSent}
                  className={`group relative block w-full focus:outline-none rounded-lg overflow-hidden transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] ${(isSending || isSent) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <GlassSurface
                    width="100%"
                    height={48}
                    borderRadius={10}
                    distortionScale={-110}
                    displace={0.3}
                    backgroundOpacity={0.2}
                    saturation={1.3}
                    redOffset={25}
                    greenOffset={5}
                    blueOffset={10}
                    className="w-full border border-red-500/50 group-hover:border-red-500/90 shadow-[0_0_25px_rgba(239,68,68,0.25)] group-hover:shadow-[0_0_35px_rgba(239,68,68,0.45)] transition-all"
                  >
                    <div className="flex justify-between items-center w-full px-6 text-white text-sm font-bold font-satoshi tracking-wide">
                      <span className="group-hover:text-red-300 transition-colors">
                        {isSending ? 'Sending...' : isSent ? 'Sent!' : 'Submit Message'}
                      </span>
                      <ArrowRight size={16} className="text-red-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </GlassSurface>
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
