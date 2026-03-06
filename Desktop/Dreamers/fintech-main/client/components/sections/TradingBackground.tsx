import { motion } from "framer-motion";

interface TradingBackgroundProps {
  isDarkMode: boolean;
}

export function TradingBackground({ isDarkMode }: TradingBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Main Grid Background */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
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
          backgroundImage: `linear-gradient(0deg, ${isDarkMode ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.2)"} 1px, transparent 1px), 
                           linear-gradient(90deg, ${isDarkMode ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.2)"} 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Animated Chart Lines - Full Width */}
      <motion.svg
        className="absolute top-0 left-0 w-full h-1/2 opacity-6"
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Uptrend Line 1 */}
        <polyline
          points="0,400 150,320 300,250 450,180 600,120 750,80 900,40 1000,20"
          fill="none"
          stroke={isDarkMode ? "#10b981" : "#059669"}
          strokeWidth="1.5"
          opacity="0.5"
        />
        {/* Downtrend Line 1 */}
        <polyline
          points="0,100 100,150 250,200 400,280 550,350 700,400 850,420 1000,450"
          fill="none"
          stroke={isDarkMode ? "#ef4444" : "#dc2626"}
          strokeWidth="1.5"
          opacity="0.4"
        />
        {/* Sideways Line */}
        <polyline
          points="0,250 200,240 400,260 600,250 800,260 1000,250"
          fill="none"
          stroke={isDarkMode ? "#f59e0b" : "#d97706"}
          strokeWidth="1"
          opacity="0.3"
        />
      </motion.svg>

      {/* Bottom Chart Lines */}
      <motion.svg
        className="absolute bottom-0 left-0 w-full h-1/3 opacity-6"
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      >
        {/* Uptrend Line 2 */}
        <polyline
          points="0,280 120,240 240,200 360,160 480,120 600,80 720,50 840,30 1000,10"
          fill="none"
          stroke={isDarkMode ? "#10b981" : "#059669"}
          strokeWidth="1.2"
          opacity="0.45"
        />
        {/* Downtrend Line 2 */}
        <polyline
          points="0,50 140,100 280,140 420,180 560,220 700,250 840,270 1000,280"
          fill="none"
          stroke={isDarkMode ? "#ef4444" : "#dc2626"}
          strokeWidth="1.2"
          opacity="0.35"
        />
      </motion.svg>

      {/* Candlestick Grid - Left Column */}
      <motion.div
        className="absolute left-0 top-1/4 w-32 h-96"
        animate={{ opacity: [0.07, 0.12, 0.07] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          viewBox="0 0 120 400"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              {/* Candle wick */}
              <line
                x1="15"
                y1={20 + i * 45}
                x2="15"
                y2={50 + i * 45}
                stroke={
                  i % 2 === 0
                    ? isDarkMode
                      ? "#10b981"
                      : "#059669"
                    : isDarkMode
                      ? "#ef4444"
                      : "#dc2626"
                }
                strokeWidth="0.8"
              />
              {/* Candle body */}
              <rect
                x="8"
                y={25 + i * 45}
                width="14"
                height="20"
                fill={
                  i % 2 === 0
                    ? isDarkMode
                      ? "#10b981"
                      : "#059669"
                    : isDarkMode
                      ? "#ef4444"
                      : "#dc2626"
                }
                opacity="0.5"
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Candlestick Grid - Right Column */}
      <motion.div
        className="absolute right-0 top-1/3 w-32 h-96"
        animate={{ opacity: [0.06, 0.11, 0.06] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      >
        <svg
          viewBox="0 0 120 400"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <line
                x1="105"
                y1={30 + i * 45}
                x2="105"
                y2={60 + i * 45}
                stroke={
                  i % 2 === 0
                    ? isDarkMode
                      ? "#10b981"
                      : "#059669"
                    : isDarkMode
                      ? "#ef4444"
                      : "#dc2626"
                }
                strokeWidth="0.8"
              />
              <rect
                x="98"
                y={35 + i * 45}
                width="14"
                height="20"
                fill={
                  i % 2 === 0
                    ? isDarkMode
                      ? "#10b981"
                      : "#059669"
                    : isDarkMode
                      ? "#ef4444"
                      : "#dc2626"
                }
                opacity="0.45"
              />
            </g>
          ))}
        </svg>
      </motion.div>

      {/* Floating Data Points - Multiple Positions */}
      {[
        { x: "15%", y: "20%", duration: 8 },
        { x: "35%", y: "40%", duration: 10 },
        { x: "65%", y: "30%", duration: 12 },
        { x: "85%", y: "50%", duration: 9 },
        { x: "25%", y: "70%", duration: 11 },
        { x: "75%", y: "60%", duration: 13 },
      ].map((point, idx) => (
        <motion.div
          key={idx}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            left: point.x,
            top: point.y,
            backgroundColor:
              idx % 2 === 0
                ? isDarkMode
                  ? "#10b981"
                  : "#059669"
                : isDarkMode
                  ? "#fbbf24"
                  : "#f59e0b",
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: point.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: idx * 0.5,
          }}
        />
      ))}

      {/* Pulsing Glow Points - Market Activity */}
      {[
        { x: "20%", y: "35%", delay: 0 },
        { x: "50%", y: "25%", delay: 1 },
        { x: "80%", y: "65%", delay: 2 },
        { x: "40%", y: "75%", delay: 1.5 },
      ].map((glow, idx) => (
        <motion.div
          key={`glow-${idx}`}
          className="absolute w-24 h-24 rounded-full"
          style={{
            left: glow.x,
            top: glow.y,
            background: `radial-gradient(circle, ${isDarkMode ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)"}, transparent)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: glow.delay,
          }}
        />
      ))}

      {/* Diagonal Accent Lines */}
      <motion.svg
        className="absolute inset-0 w-full h-full opacity-5"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="none"
        animate={{ opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <line
          x1="0"
          y1="0"
          x2="1000"
          y2="1000"
          stroke={isDarkMode ? "#10b981" : "#059669"}
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="1000"
          y1="0"
          x2="0"
          y2="1000"
          stroke={isDarkMode ? "#ef4444" : "#dc2626"}
          strokeWidth="0.5"
          opacity="0.4"
        />
      </motion.svg>
    </div>
  );
}
