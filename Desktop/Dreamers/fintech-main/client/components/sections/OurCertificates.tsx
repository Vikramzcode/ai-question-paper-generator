import { motion } from "framer-motion";
import { Shield, Lock, CheckCircle, Award, Zap, Check } from "lucide-react";

interface OurCertificatesProps {
  isDarkMode: boolean;
}

const certificates = [
  {
    name: "ISO 27001",
    description: "Information Security Management",
    icon: Shield,
    verified: true,
  },
  {
    name: "PCI DSS",
    description: "Secure Payment Processing",
    icon: Lock,
    verified: true,
  },
  {
    name: "SOC 2 Type II",
    description: "Service Organization Control",
    icon: CheckCircle,
    verified: true,
  },
  {
    name: "Global Compliance",
    description: "Financial Regulatory Standards",
    icon: Award,
    verified: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export function OurCertificates({ isDarkMode }: OurCertificatesProps) {
  const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-700";
  const cardBg = isDarkMode
    ? "bg-slate-800/40 border-slate-700/50"
    : "bg-white/90 border-slate-300/70 shadow-md";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";
  const imagePlaceholderBg = isDarkMode
    ? "bg-slate-700/30 border-slate-600/30"
    : "bg-green-50/60 border-green-200/40";

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-emerald-950/20 to-slate-900"
          : "bg-gradient-to-b from-slate-100 via-emerald-50/20 to-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
            Our{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">
              Certificates
            </span>
          </h2>
          <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
            Recognized by global security and financial standards
          </p>
        </motion.div>

        {/* Certificates Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {certificates.map((cert, index) => {
            const Icon = cert.icon;
            return (
              <motion.div
                key={index}
                className={`group relative h-full rounded-xl border backdrop-blur-sm transition-all duration-300 overflow-hidden cursor-pointer ${cardBg}`}
                // variants={itemVariants}
                whileHover={{
                  y: -8,
                  boxShadow: isDarkMode
                    ? "0 20px 40px rgba(16, 185, 129, 0.15)"
                    : "0 20px 40px rgba(16, 185, 129, 0.1)",
                }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300 z-0" />

                {/* Image/Document Placeholder Area */}
                <motion.div
                  className={`w-full h-32 border-b ${imagePlaceholderBg} flex items-center justify-center overflow-hidden bg-cover bg-center`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`text-emerald-500/60 group-hover:text-emerald-500 transition-colors duration-300`}
                  >
                    <Icon className="w-12 h-12 mx-auto" />
                  </div>
                </motion.div>

                {/* Content Area */}
                <div className="relative z-10 p-6 flex flex-col h-full">
                  {/* Verified Badge */}
                  {cert.verified && (
                    <motion.div
                      className="flex items-center gap-1.5 mb-3"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 + index * 0.12, duration: 0.4 }}
                    >
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-500">
                          Verified
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Certificate Title */}
                  <h3
                    className={`text-base font-bold mb-2 ${textColor} group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-green-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300`}
                  >
                    {cert.name}
                  </h3>

                  {/* Subtle Accent Line */}
                  <motion.div
                    className="w-8 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 mb-3 origin-left"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + index * 0.12, duration: 0.5 }}
                  />

                  {/* Description */}
                  <p
                    className={`text-sm ${mutedClasses} leading-relaxed flex-grow`}
                  >
                    {cert.description}
                  </p>

                  {/* Future Action Hint */}
                  <motion.div
                    className="mt-4 text-xs font-medium text-emerald-500/60 group-hover:text-emerald-500 transition-colors duration-300 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.12, duration: 0.5 }}
                  >
                    <span className="inline-block">View Certificate →</span>
                  </motion.div>
                </div>

                {/* Top Border Glow */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Message */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <p className={`${mutedClasses} text-sm max-w-3xl mx-auto`}>
            All certifications are current and verified by independent auditors.
            Your security and compliance are our top priorities. We maintain the
            highest industry standards to protect your investments and data.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
