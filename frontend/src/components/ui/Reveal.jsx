/**
 * Reveal.jsx
 * Reusable scroll-triggered reveal animation wrapper using framer-motion.
 *
 * Usage:
 *   import Reveal from "../components/ui/Reveal";
 *   <Reveal delay={0.2} direction="up">
 *     <h1>Hello</h1>
 *   </Reveal>
 */

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

const DIRECTION_MAP = {
	up: { y: 40, x: 0 },
	down: { y: -40, x: 0 },
	left: { y: 0, x: 48 },
	right: { y: 0, x: -48 },
};

export default function Reveal({ children, delay = 0, direction = "up", className = "", once = true }) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once, margin: "-60px" });

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, ...DIRECTION_MAP[direction] }}
			animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
			transition={{ duration: 0.65, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={className}>
			{children}
		</motion.div>
	);
}
