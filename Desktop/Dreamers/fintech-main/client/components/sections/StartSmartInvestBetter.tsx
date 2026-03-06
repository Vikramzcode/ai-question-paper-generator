import { motion } from "framer-motion";
import { CheckCircle, Wallet, TrendingUp, Zap } from "lucide-react";

interface StartSmartInvestBetterProps {
  isDarkMode: boolean;
}

const steps = [
  {
    step: 1,
    title: "Easy Onboarding",
    description: "Register and verify your account in minutes.",
    icon: CheckCircle,
  },
  {
    step: 2,
    title: "Smart Investments",
    description: "Fund your account and choose the right investment index.",
    icon: Wallet,
  },
  {
    step: 3,
    title: "Achieve More",
    description: "Grow your portfolio with confidence and transparency.",
    icon: TrendingUp,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function StartSmartInvestBetter({
  isDarkMode,
}: StartSmartInvestBetterProps) {
  const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-700";
  const cardBg = isDarkMode
    ? "bg-slate-800/40 border-slate-700/50"
    : "bg-white/90 border-slate-300/70 shadow-md";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-cyan-950/20 to-slate-900"
          : "bg-gradient-to-b from-slate-100 via-cyan-50/20 to-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm ${
              isDarkMode
                ? "bg-cyan-500/10 border-cyan-500/30"
                : "bg-cyan-100/80 border-cyan-400/50 shadow-sm"
            }`}
          >
            <Zap className="w-4 h-4 text-cyan-500" />
            <span className="text-sm font-semibold text-cyan-500">
              How It Works
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
            Start Smart,{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Invest Better!
            </span>
          </h2>
          <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
            No trading experience? No problem. Our ready-made strategies align
            with your goals and minimize risk.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Illustration */}
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className={`relative w-full h-80 sm:h-96 rounded-2xl border backdrop-blur-sm overflow-hidden ${cardBg}`}
              whileHover={{ scale: 1.02, y: -8 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            >
              <img
               
                src="\Gemini_Generated_Image_985hg1985hg1985h.png"
                alt="Investment illustration"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Right: Steps */}
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {steps.map((stepItem, index) => {
              const Icon = stepItem.icon;
              return (
                <motion.div
                  key={index}
                  className={`relative p-6 sm:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 group hover:scale-105 cursor-pointer ${cardBg}`}
                  // variants={itemVariants}
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

                  <div className="relative z-10 flex items-start gap-4 sm:gap-6">
                    {/* Step Number Badge */}
                    <motion.div
                      className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {stepItem.step}
                    </motion.div>

                    {/* Content */}
                    <div className="flex-1 pt-1">
                      <h3
                        className={`text-xl sm:text-2xl font-bold mb-2 ${textColor}`}
                      >
                        {stepItem.title}
                      </h3>
                      <p
                        className={`${mutedClasses} text-sm sm:text-base leading-relaxed`}
                      >
                        {stepItem.description}
                      </p>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className="flex-shrink-0 text-cyan-500 mt-2"
                      whileHover={{ scale: 1.2, rotate: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom CTA Text */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p
            className={`${mutedClasses} text-sm sm:text-base max-w-2xl mx-auto`}
          >
            Join thousands of investors who trust our platform to manage their
            investments with confidence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
