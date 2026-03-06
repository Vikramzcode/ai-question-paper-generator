import { motion } from "framer-motion";

interface OurJourneyProps {
  isDarkMode: boolean;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

const timelineData: TimelineItem[] = [
  {
    year: "2018",
    title: "Founded",
    description: "TIMO FX was established with a vision to democratize trading",
  },
  {
    year: "2019",
    title: "1 Million Traders",
    description: "Reached 1 million active traders milestone",
  },
  {
    year: "2021",
    title: "Global Expansion",
    description: "Expanded to 150+ countries with multi-language support",
  },
  {
    year: "2023",
    title: "Industry Recognition",
    description: "Awarded Best Trading Platform by multiple industry bodies",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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

export function OurJourney({ isDarkMode }: OurJourneyProps) {
  const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-700";
  const cardBg = isDarkMode
    ? "bg-slate-800/40 border-slate-700/50"
    : "bg-white/90 border-slate-300/70 shadow-md";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-indigo-950/20 to-slate-900"
          : "bg-gradient-to-b from-slate-100 via-indigo-50/20 to-slate-100"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
            Our{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
            From humble beginnings to becoming a trusted platform for millions
            of traders worldwide. Here's how we grew.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Vertical Line */}
          <motion.div
            className={`absolute left-1/2 transform -translate-x-1/2 w-1 h-full ${
              isDarkMode
                ? "bg-gradient-to-b from-indigo-600 to-purple-600"
                : "bg-gradient-to-b from-indigo-400 to-purple-400"
            }`}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ transformOrigin: "top" }}
          />

          {/* Timeline Items */}
          <div className="space-y-12">
            {timelineData.map((item, index) => (
              <motion.div
                key={index}
                className={`relative flex ${index % 2 === 0 ? "flex-col lg:flex-row-reverse" : "flex-col lg:flex-row"} items-center gap-4 lg:gap-8`}
                // variants={itemVariants}
              >
                {/* Content Card */}
                <motion.div
                  className={`w-full lg:w-1/2 group relative p-6 sm:p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${cardBg}`}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300`}
                  />

                  <div className="relative z-10">
                    <p
                      className={`text-sm font-semibold mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent`}
                    >
                      {item.year}
                    </p>
                    <h3
                      className={`text-xl sm:text-2xl font-bold mb-3 ${textColor}`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`${mutedClasses} leading-relaxed text-sm sm:text-base`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" />
                </motion.div>

                {/* Center Badge (Year Circle) */}
                <motion.div
                  className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 relative z-20 flex-shrink-0 shadow-lg"
                  whileHover={{
                    scale: 1.1,
                    boxShadow: "0 0 20px rgba(99, 102, 241, 0.6)",
                  }}
                  transition={{ duration: 0.3 }}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  // transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <span className="text-white font-bold text-sm sm:text-base text-center px-2">
                    {item.year}
                  </span>
                </motion.div>

                {/* Spacer for layout */}
                <div className="hidden lg:block w-full lg:w-1/2" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Accent */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p
            className={`text-sm sm:text-base ${mutedClasses} max-w-2xl mx-auto leading-relaxed`}
          >
            Every milestone represents our commitment to innovation, security,
            and customer satisfaction. We're just getting started on this
            incredible journey.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
