import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import "./StatCounter.css";

export default function StatCounter({ value, suffix = "", label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="stat-wrapper"
    >
      <p className="stat-value">
        {display.toLocaleString("en-IN")}
        <span className="stat-suffix">{suffix}</span>
      </p>
      <p className="stat-label">{label}</p>
    </motion.div>
  );
}
