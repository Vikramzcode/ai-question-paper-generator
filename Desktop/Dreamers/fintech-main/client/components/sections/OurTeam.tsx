import { motion } from "framer-motion";
import { Linkedin, Twitter, Mail } from "lucide-react";

interface OurTeamProps {
  isDarkMode: boolean;
}

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Chief Executive Officer",
    bio: "15+ years in fintech with proven track record",
    avatar: "👩‍💼",
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    bio: "Expert in blockchain and secure trading systems",
    avatar: "👨‍💻",
  },
  {
    name: "Emma Williams",
    role: "Head of Customer Relations",
    bio: "Dedicated to exceptional user experiences",
    avatar: "👩‍💼",
  },
  {
    name: "David Rodriguez",
    role: "Chief Financial Officer",
    bio: "Strategic financial planning and compliance expert",
    avatar: "👨‍💼",
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

export function OurTeam({ isDarkMode }: OurTeamProps) {
  const mutedClasses = isDarkMode ? "text-slate-400" : "text-slate-600";
  const cardBg = isDarkMode
    ? "bg-slate-800/40 border-slate-700/50"
    : "bg-white/40 border-slate-300/50";
  const textColor = isDarkMode ? "text-slate-100" : "text-slate-900";

  return (
    <section
      className={`py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900"
          : "bg-gradient-to-b from-slate-100 via-rose-50/20 to-slate-100"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className={`text-4xl sm:text-5xl font-bold mb-4 ${textColor}`}>
            Our{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className={`${mutedClasses} text-lg max-w-2xl mx-auto`}>
            Experienced professionals dedicated to your financial success
          </p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className={`group relative p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer ${cardBg}`}
              // variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-rose-500/0 to-pink-500/0 group-hover:from-rose-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

              <div className="relative z-10">
                {/* Avatar */}
                <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                  {member.avatar}
                </div>

                {/* Info */}
                <h3
                  className={`text-lg font-bold mb-1 text-center bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent`}
                >
                  {member.name}
                </h3>
                <p
                  className={`text-sm font-semibold text-center mb-3 ${mutedClasses}`}
                >
                  {member.role}
                </p>
                <p
                  className={`text-xs text-center mb-4 ${isDarkMode ? "text-slate-500" : "text-slate-600"}`}
                >
                  {member.bio}
                </p>

                {/* Social Links */}
                <div className="flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-700/50 hover:bg-rose-500/30 text-rose-400"
                        : "bg-slate-200/50 hover:bg-rose-500/20 text-rose-600"
                    }`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-700/50 hover:bg-rose-500/30 text-rose-400"
                        : "bg-slate-200/50 hover:bg-rose-500/20 text-rose-600"
                    }`}
                  >
                    <Twitter className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isDarkMode
                        ? "bg-slate-700/50 hover:bg-rose-500/30 text-rose-400"
                        : "bg-slate-200/50 hover:bg-rose-500/20 text-rose-600"
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
