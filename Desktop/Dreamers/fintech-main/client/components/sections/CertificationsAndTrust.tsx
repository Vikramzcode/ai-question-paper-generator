import { motion } from "framer-motion";
import { Shield, Award, Check } from "lucide-react";

interface CertificationsAndTrustProps {
  isDarkMode: boolean;
}

const certifications = [
  {
    title: "SEC Regulated",
    description: "Fully compliant with US Securities and Exchange Commission",
    icon: Shield,
  },
  {
    title: "ISO 27001 Certified",
    description: "Industry-leading information security standards",
    icon: Award,
  },
  {
    title: "SOC 2 Compliant",
    description: "Meets rigorous data security and privacy controls",
    icon: Check,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
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

export function CertificationsAndTrust({
  isDarkMode,
}: CertificationsAndTrustProps) {
  const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-600";
  const cardBg = isDarkMode
    ? "bg-slate-800/40 border-slate-700/50"
    : "bg-white/40 border-slate-300/50";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-teal-950/20 to-slate-900"
          : "bg-gradient-to-b from-slate-100 via-teal-50/20 to-slate-100"
      }`}
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
            Certifications &{" "}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              Trust
            </span>
          </h2>
          <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
            Your security and peace of mind are our top priorities. We maintain
            the highest industry standards.
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {certifications.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={index}
                className={`relative p-8 rounded-xl border backdrop-blur-sm transition-all duration-300 group hover:scale-105 cursor-pointer ${cardBg}`}
                // variants={itemVariants}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/10 group-hover:to-emerald-500/10 transition-all duration-300" />

                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    className="mb-4"
                    whileHover={{ rotate: 12, scale: 1.1 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 300,
                    }}
                  >
                    <Icon className="w-10 h-10 text-teal-500" />
                  </motion.div>

                  {/* Title */}
                  <h3
                    className={`text-xl font-bold mb-2 bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent`}
                  >
                    {cert.title}
                  </h3>

                  {/* Description */}
                  <p className={`${mutedClasses} text-sm leading-relaxed`}>
                    {cert.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Statement */}
        <motion.div
          className={`mt-12 p-8 rounded-xl border backdrop-blur-sm text-center ${cardBg}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        >
          <p
            className={`${isDarkMode ? "text-slate-300" : "text-slate-700"} text-base leading-relaxed`}
          >
            We're committed to transparency and accountability. All transactions
            are encrypted, and your personal data is protected by the highest
            security standards in the financial industry.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
