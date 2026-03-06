import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Moon, Sun, Shield, Award, TrendingUp, Lock, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OurJourney } from "@/components/sections/OurJourney";
import { StartSmartInvestBetter } from "@/components/sections/StartSmartInvestBetter";
import { OurCertificates } from "@/components/sections/OurCertificates";
import { TradingBackground } from "@/components/sections/TradingBackground";

export default function Landing() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("intro");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScrollPos = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScrollPos);
    return () => window.removeEventListener("scroll", handleScrollPos);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["intro", "portfolio", "services", "about", "contact"];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Intro", id: "intro" },
    { label: "Portfolio", id: "portfolio" },
    { label: "What We Do", id: "services" },
    { label: "About Us", id: "about" },
    { label: "Contact", id: "contact" },
  ];

  const bgClasses = isDarkMode
    ? "bg-slate-950 text-slate-50"
    : "bg-gradient-to-b from-white to-slate-50 text-slate-900";

  const cardClasses = isDarkMode
    ? "bg-slate-900/60 border-slate-700/30 text-slate-50"
    : "bg-white border-slate-200/80 text-slate-900 shadow-lg";

  const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-700";

  return (
    <div
      className={`w-full ${bgClasses} transition-colors duration-300 relative`}
    >
      {/* Global Trading Background Layer */}
      <TradingBackground isDarkMode={isDarkMode} />

      {/* Content Wrapper */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav
          className={`fixed top-0 left-0 right-0 ${isDarkMode ? "bg-slate-950/95" : "bg-white/95"} backdrop-blur-xl ${isDarkMode ? "border-slate-800/50" : "border-slate-200 shadow-sm"} border-b z-50 transition-colors duration-300`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  TradePro
                </div>
                <Shield className={`w-4 h-4 ${isDarkMode ? "text-blue-400" : "text-blue-600"}`} />
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      activeSection === link.id
                        ? isDarkMode ? "text-blue-400" : "text-blue-600"
                        : isDarkMode
                          ? "text-slate-400 hover:text-slate-200"
                          : "text-slate-700 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}

                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2.5 rounded-xl transition-all duration-200 ${isDarkMode ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-blue-50 text-blue-600 hover:bg-blue-100 shadow-sm"}`}
                  title="Toggle dark mode"
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className={`px-6 py-2.5 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md shadow-blue-500/30"} text-white font-bold rounded-xl transition-all duration-200`}
                >
                  Login
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-3">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode ? "bg-slate-800 text-amber-400" : "bg-blue-50 text-blue-600 shadow-sm"}`}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                <button
                  className="md:hidden p-2"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div
                className={`md:hidden pb-4 ${isDarkMode ? "border-slate-800/50" : "border-slate-200 bg-slate-50/50"} border-t mt-2`}
              >
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`block w-full text-left px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                      activeSection === link.id
                        ? isDarkMode ? "text-blue-400 bg-blue-500/10" : "text-blue-600 bg-blue-50"
                        : isDarkMode
                          ? "text-slate-400 hover:bg-slate-800/50"
                          : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => navigate("/login")}
                  className={`block w-full text-left px-4 py-3 mt-2 ${isDarkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-md"} text-white font-bold rounded-xl transition-all duration-200`}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
       

       
     <section
  id="intro"
  className={`pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
    isDarkMode
      ? "bg-gradient-to-br from-[#050b18] via-[#0a192f] to-[#112240]"
      : "bg-gradient-to-br from-white via-blue-50/50 to-cyan-50/30"
  }`}
>
  {/* Glassy Grid Overlay - Retained & Re-colored to Blue */}
  <motion.div
    className="absolute inset-0 opacity-[0.1] pointer-events-none"
    animate={{
      backgroundPosition: ["0% 0%", "100% 100%"],
    }}
    transition={{
      duration: 40,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "linear",
    }}
    style={{
      backgroundImage: `linear-gradient(0deg, ${isDarkMode ? "rgba(56, 189, 248, 0.2)" : "rgba(37, 99, 235, 0.1)"} 1px, transparent 1px), 
                       linear-gradient(90deg, ${isDarkMode ? "rgba(56, 189, 248, 0.2)" : "rgba(37, 99, 235, 0.1)"} 1px, transparent 1px)`,
      backgroundSize: "80px 80px",
    }}
  />

  {/* Animated Glassy Orbs - Refined for Navy Theme */}
  <div
    className={`absolute inset-0 overflow-hidden pointer-events-none ${isDarkMode ? "opacity-40" : "opacity-20"}`}
  >
    <motion.div
      className="absolute top-20 left-10 w-80 h-80 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px]"
      animate={{
        y: [0, -40, 0],
        x: [0, 30, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute -bottom-8 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[140px]"
      animate={{
        y: [0, 40, 0],
        x: [0, -30, 0],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
    />
  </div>

  {/* Candlestick Pattern - Blue/Indigo Rebrand */}
  <motion.svg
    className="absolute bottom-1/4 left-12 w-40 h-40 opacity-20 pointer-events-none hidden md:block"
    viewBox="0 0 160 160"
    animate={{ y: [0, -15, 0], opacity: [0.15, 0.25, 0.15] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  >
    {[20, 50, 80, 110, 140].map((x, i) => (
      <g key={x}>
        <line x1={x} y1={20 + (i*10)} x2={x} y2={90 + (i*5)} stroke={i % 2 === 0 ? "#38bdf8" : "#6366f1"} strokeWidth="2" />
        <rect x={x-8} y={35 + (i*5)} width="16" height={30 + (i*2)} fill={i % 2 === 0 ? "#38bdf8" : "#6366f1"} opacity="0.4" />
      </g>
    ))}
  </motion.svg>

  {/* Uptrend Line - Cyan Rebrand */}
  <motion.svg
    className="absolute top-1/3 right-20 w-48 h-32 opacity-20 pointer-events-none hidden lg:block"
    viewBox="0 0 200 120"
    animate={{ x: [0, 10, 0], opacity: [0.1, 0.2, 0.1] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
  >
    <polyline
      points="10,100 35,85 60,70 85,55 110,45 135,35 160,20 185,15"
      fill="none"
      stroke={isDarkMode ? "#0ea5e9" : "#2563eb"}
      strokeWidth="2.5"
      strokeDasharray="4 2"
    />
    <circle cx="185" cy="15" r="4" fill="#38bdf8" className="animate-pulse" />
  </motion.svg>

  {/* Main Content */}
  <div className="max-w-4xl mx-auto text-center relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.h1
        className={`text-5xl sm:text-6xl lg:text-7xl font-black mb-6 ${
          isDarkMode 
            ? "bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent" 
            : "text-slate-900"
        }`}
        animate={{ opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        Professional Trading Platform
      </motion.h1>

      <motion.p
        className={`text-xl sm:text-2xl ${isDarkMode ? "text-slate-400" : "text-slate-700 font-medium"} mb-8 max-w-2xl mx-auto leading-relaxed`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        Grow your wealth with our <span className={isDarkMode ? "text-blue-400" : "text-blue-600 font-semibold"}>secure</span>, <span className={isDarkMode ? "text-cyan-400" : "text-cyan-600 font-semibold"}>transparent</span>, and <span className={isDarkMode ? "text-blue-400" : "text-blue-600 font-semibold"}>user-friendly</span> investment platform. Trusted by thousands of traders worldwide.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
      >
        {/* Primary Button: Electric Blue */}
        <motion.button
          onClick={() => navigate("/login")}
          className={`px-8 py-4 ${isDarkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-xl shadow-blue-500/30"} text-white font-bold rounded-xl transition-all duration-300 text-lg`}
          whileHover={{
            y: -4,
            boxShadow: isDarkMode ? "0 20px 40px rgba(37, 99, 235, 0.3)" : "0 25px 50px rgba(37, 99, 235, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>

        {/* Secondary Button: Glassy Outlined */}
        <motion.button
          onClick={() => scrollToSection("services")}
          className={`px-8 py-4 border-2 backdrop-blur-sm ${
            isDarkMode 
              ? "border-blue-500/50 hover:border-blue-400 text-blue-400 bg-blue-500/5" 
              : "border-blue-600 hover:border-blue-700 text-blue-600 bg-white/50 shadow-lg"
          } font-bold rounded-xl transition-all duration-300 text-lg`}
          whileHover={{
            y: -4,
            backgroundColor: isDarkMode ? "rgba(59, 130, 246, 0.1)" : "rgba(255, 255, 255, 0.9)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          Learn More
        </motion.button>
      </motion.div>
    </motion.div>
  </div>

  {/* Scroll Indicator - Blue Accent */}
  <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
  >
    <ChevronDown
      className={`w-6 h-6 ${isDarkMode ? "text-blue-500/50" : "text-blue-600/50"}`}
    />
  </motion.div>
</section>


        {/* Portfolio / Stats Section */}
      <section
          id="portfolio"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
              : "bg-gradient-to-b from-white via-slate-50/80 to-white"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2
                className={`text-4xl sm:text-5xl font-black mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
              >
                Our Platform{" "}
                <span className={`${isDarkMode ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-gradient-to-r from-blue-600 to-cyan-600"} bg-clip-text text-transparent`}>
                  in Numbers
                </span>
              </h2>
              <p className={`${mutedClasses} text-lg font-medium`}>
                Join thousands of successful traders managing their investments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Active Customers",
                  value: "15,000+",
                  icon: "👥",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Funds Managed",
                  value: "$250M+",
                  icon: "💰",
                  color: "from-emerald-500 to-green-500",
                },
                {
                  title: "Daily Growth",
                  value: "2.5%",
                  icon: "📈",
                  color: "from-amber-500 to-orange-500",
                },
                {
                  title: "Years of Trust",
                  value: "5+",
                  icon: "🏆",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`group relative p-8 rounded-2xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                      : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xl hover:shadow-2xl"
                  }`}
                >
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <div className="relative z-10 text-center">
                    <div
                      className="text-5xl mb-4 animate-bounce"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {stat.icon}
                    </div>
                    <p className={`${mutedClasses} text-sm mb-2 font-bold uppercase tracking-wider`}>
                      {stat.title}
                    </p>
                    <h3
                      className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                    >
                      {stat.value}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>  

        {/* Start Smart, Invest Better Section */}
        <StartSmartInvestBetter isDarkMode={isDarkMode} />

        {/* Services / Pricing Section */}
        <section
          id="services"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-slate-950 via-blue-950/30 to-slate-950"
              : "bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-slide-up">
              <h2
                className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
              >
                Flexible Investment{" "}
                <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  Plans
                </span>
              </h2>
              <p className={`${mutedClasses} text-lg`}>
                Choose the perfect plan for your investment goals
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Plan A */}
              <div
                className={`relative p-8 rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 border-2 ${
                  isDarkMode
                    ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                    : "bg-white border-blue-200/80 hover:border-blue-300 shadow-xl hover:shadow-2xl"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${isDarkMode ? "from-blue-500/10" : "from-blue-50/80"} to-transparent pointer-events-none`} />
                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-black mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
                  >
                    Starter Plan
                  </h3>
                  <p className={`${mutedClasses} mb-4 font-medium`}>
                    Perfect for beginners starting their journey
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                      5%
                    </span>
                    <span className={`${mutedClasses} ml-2`}>
                      Annual Interest
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-4 mb-6 border ${isDarkMode ? "bg-slate-900/50 border-blue-500/20" : "bg-blue-50/80 border-blue-200"}`}
                  >
                    <p
                      className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}
                    >
                      Minimum Investment:{" "}
                      <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>Less than $99</span>
                    </p>
                  </div>
                  <ul
                    className={`space-y-3 mb-8 ${isDarkMode ? "text-slate-300" : "text-slate-700"} font-medium`}
                  >
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>✓</span> Low minimum
                      deposit
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>✓</span> Easy to get
                      started
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-blue-400" : "text-blue-600"}>✓</span> 24/7 customer
                      support
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate("/login")}
                    className={`w-full px-6 py-3.5 font-bold rounded-xl transition-all duration-200 border-2 ${
                      isDarkMode
                        ? "border-blue-500 text-blue-400 hover:bg-blue-500/10"
                        : "border-blue-600 text-blue-600 hover:bg-blue-50 shadow-md"
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              </div>

              {/* Plan B */}
              <div
                className={`relative p-8 rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 border-2 md:scale-105 ${
                  isDarkMode
                    ? "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/50 hover:bg-gradient-to-br hover:from-amber-500/20 hover:to-orange-500/20"
                    : "bg-gradient-to-br from-amber-50/80 to-orange-50/80 border-amber-400/70 hover:border-amber-500 shadow-2xl hover:shadow-3xl"
                }`}
              >
                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ⭐ POPULAR
                </div>
                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-black mb-2 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
                  >
                    Premium Plan
                  </h3>
                  <p className={`${mutedClasses} mb-4 font-medium`}>
                    For serious investors seeking maximum returns
                  </p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                      7%
                    </span>
                    <span className={`${mutedClasses} ml-2`}>
                      Annual Interest
                    </span>
                  </div>
                  <div
                    className={`rounded-xl p-4 mb-6 border ${isDarkMode ? "bg-slate-900/50 border-amber-500/30" : "bg-orange-50/80 border-orange-200"}`}
                  >
                    <p
                      className={`text-sm font-bold ${isDarkMode ? "text-slate-300" : "text-slate-800"}`}
                    >
                      Minimum Investment:{" "}
                      <span className={isDarkMode ? "text-amber-400" : "text-amber-600"}>≥ $100</span>
                    </p>
                  </div>
                  <ul
                    className={`space-y-3 mb-8 ${isDarkMode ? "text-slate-300" : "text-slate-700"} font-medium`}
                  >
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-amber-400" : "text-amber-600"}>✓</span> Higher returns
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-amber-400" : "text-amber-600"}>✓</span> Priority support
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-amber-400" : "text-amber-600"}>✓</span> Advanced
                      analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <span className={isDarkMode ? "text-amber-400" : "text-amber-600"}>✓</span> Personal advisor
                    </li>
                  </ul>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black rounded-xl transition-all duration-200 shadow-xl hover:shadow-amber-500/50"
                  >
                    Start Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          id="about"
          className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
            isDarkMode
              ? "bg-gradient-to-b from-slate-900 via-blue-950/30 to-slate-900"
              : "bg-gradient-to-b from-slate-50/50 via-purple-50/30 to-slate-50/50"
          }`}
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: About Text */}
              <div className="animate-slide-up">
                <h2
                  className={`text-4xl sm:text-5xl font-bold mb-6 ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
                >
                  About{" "}
                  <span className="bg-gradient-to-r from-blue-900 to-blue-400 bg-clip-text text-transparent">
                    TradePro
                  </span>
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
                      Our Story
                    </h3>
                    <p className={`${mutedClasses} leading-relaxed`}>
                      Founded in 2019, TradePro emerged from a vision to
                      democratize wealth management. We built a platform where
                      both beginners and experienced traders could grow their
                      investments safely and transparently. Today, we've helped
                      thousands achieve their financial dreams.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r  from-blue-500 to-blue-300 bg-clip-text text-transparent">
                      Our Mission
                    </h3>
                    <p className={`${mutedClasses} leading-relaxed`}>
                      To empower individuals to take control of their financial
                      future through accessible, secure, and transparent
                      investment solutions that everyone can trust and
                      understand.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-3 bg-gradient-to-r  from-blue-500 to-blue-300 bg-clip-text text-transparent">
                      Our Vision
                    </h3>
                    <p className={`${mutedClasses} leading-relaxed`}>
                      To become the world's most trusted investment platform,
                      enabling millions to build lasting wealth and achieve
                      their financial goals.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Team Overview */}
              <div className="animate-fade-in">
                <h3
                  className={`text-2xl font-bold mb-8 text-center lg:text-left ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
                >
                  Leadership Team
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "Sarah Johnson",
                      role: "Chief Executive Officer",
                      bio: "15+ years in fintech with proven track record",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      name: "Michael Chen",
                      role: "Chief Technology Officer",
                      bio: "Expert in blockchain and secure trading systems",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      name: "Emma Williams",
                      role: "Head of Customer Relations",
                      bio: "Dedicated to exceptional user experiences",
                      color: "from-emerald-500 to-green-500",
                    },
                    {
                      name: "David Rodriguez",
                      role: "Chief Financial Officer",
                      bio: "Strategic financial planning and compliance expert",
                      color: "from-amber-500 to-orange-500",
                    },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className={`group relative p-5 rounded-xl border backdrop-blur-sm hover:scale-105 transition-all duration-300 ${
                        isDarkMode
                          ? "bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60"
                          : "bg-white border-slate-200/80 hover:border-slate-300 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      <div
                        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                      ></div>
                      <div className="relative z-10">
                        <h4
                          className={`font-black mb-1 bg-gradient-to-r ${member.color} bg-clip-text text-transparent`}
                        >
                          {member.name}
                        </h4>
                        <p className={`text-sm ${mutedClasses} mb-2 font-semibold`}>
                          {member.role}
                        </p>
                        <p
                          className={`text-xs font-medium ${isDarkMode ? "text-slate-500" : "text-slate-600"}`}
                        >
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Journey Section */}
        <OurJourney isDarkMode={isDarkMode} />

        {/* Our Certificates Section */}
        <OurCertificates isDarkMode={isDarkMode} />

        {/* Contact Section */}
        <section
          id="contact"
          className={`py-20 px-4 sm:px-6 lg:px-8 ${
            isDarkMode
              ? "bg-slate-900"
              : "bg-slate-50"
          }`}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-left mb-8">
              <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">REACH OUT</p>
              <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Get in <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className={`${mutedClasses} text-base max-w-2xl`}>
                Let's discuss how we can help transform your investment journey with innovative solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div
                className={`rounded-2xl p-8 ${
                  isDarkMode
                    ? "bg-slate-800/50 border border-slate-700/50"
                    : "bg-white border border-slate-200 shadow-xl"
                }`}
              >
                <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Send a Message
                </h3>
                <p className={`text-sm ${mutedClasses} mb-6`}>
                  We'll get back to you within 24 hours.
                </p>
                <form className="space-y-5">
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      PHONE NUMBER
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        isDarkMode
                          ? "bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider mb-2 ${mutedClasses}`}>
                      YOUR MESSAGE
                    </label>
                    <textarea
                      placeholder="Tell us about your investment goals..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${
                        isDarkMode
                          ? "bg-slate-900/50 border-slate-700 text-slate-100 placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Contact Info & Business Hours */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div
                  className={`rounded-2xl p-8 ${
                    isDarkMode
                      ? "bg-slate-800/50 border border-slate-700/50"
                      : "bg-white border border-slate-200 shadow-xl"
                  }`}
                >
                  <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Contact Information
                  </h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${mutedClasses}`}>EMAIL</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}>
                          support@tradepro.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-cyan-500/10">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${mutedClasses}`}>PHONE</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          +1 (800) 123-4567
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${mutedClasses}`}>ADDRESS</p>
                        <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          123 Finance Street, New York, NY 10001, USA
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div
                  className={`rounded-2xl p-8 ${
                    isDarkMode
                      ? "bg-slate-950 border border-slate-800"
                      : "bg-slate-900 border border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold text-white">
                      Business Hours
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Monday – Friday</span>
                      <span className="text-sm font-semibold text-blue-400">9:00 AM – 7:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Saturday</span>
                      <span className="text-sm font-semibold text-cyan-400">10:00 AM – 5:00 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-400">Sunday</span>
                      <span className="text-sm font-semibold text-red-500">Closed</span>
                    </div>
                  </div>
                </div>

                {/* Ready to start */}
                <div
                  className={`rounded-2xl p-6 ${
                    isDarkMode
                      ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30"
                      : "bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200"
                  }`}
                >
                  <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Ready to start trading?
                  </h4>
                  <p className={`text-sm ${mutedClasses} mb-4`}>
                    Join thousands of successful traders and start growing your wealth today.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg"
                  >
                    Start Trading →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`${
            isDarkMode
              ? "bg-slate-950 border-slate-800"
              : "bg-slate-950 border-slate-800"
          } border-t`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
              {/* Company Info */}
              <div className="col-span-1">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    TradePro
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-1">Professional Trading Platform</p>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Grow your wealth with our secure, transparent, and user-friendly investment platform trusted by thousands worldwide.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>support@tradepro.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+1 (800) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>New York, USA</span>
                  </div>
                </div>
                {/* Social Links */}
                <div className="flex gap-3 mt-6">
                  {["facebook", "twitter", "linkedin", "instagram"].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 transition-all duration-200"
                    >
                      <svg className="w-4 h-4 text-slate-400 hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Navigate */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">NAVIGATE</h4>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <button
                        onClick={() => scrollToSection(link.id)}
                        className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-200"></span>
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-cyan-500"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">SERVICES</h4>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Trading Solutions</h3>
                <ul className="space-y-3">
                  {[
                    "Investment Planning",
                    "Portfolio Management",
                    "Risk Assessment",
                    "Market Analysis",
                    "Wealth Management",
                    "Financial Advisory",
                  ].map((service) => (
                    <li key={service}>
                      <a
                        href="#services"
                        className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <span className="w-0 group-hover:w-2 h-0.5 bg-cyan-400 transition-all duration-200"></span>
                        {service}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-0.5 bg-blue-500"></div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">STAY UPDATED</h4>
                </div>
                <h3 className="text-lg font-bold text-white mb-4">Newsletter</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Subscribe to get the latest updates, articles, and news delivered to your inbox.
                </p>
                <div className="flex gap-2 mb-6">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button className="p-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">2+</span> Projects
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">98%</span> Satisfaction
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold">1+</span> Years
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-800">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-slate-500">
                  © 2026 <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-semibold">TradePro</span>. All rights reserved.
                </p>
                <div className="flex gap-6">
                  {["Privacy Policy", "Terms of Service", "Sitemap"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}








