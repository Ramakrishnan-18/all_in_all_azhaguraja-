import { motion } from "framer-motion";
import "./PageHeader.css";

export default function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="header-wrapper">
      <div className="header-container">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="header-eyebrow">
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="header-title"
        >
          {title}
        </motion.h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="header-desc"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  );
}
