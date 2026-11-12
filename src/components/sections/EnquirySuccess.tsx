"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import { LuArrowRight, LuRotateCcw } from "react-icons/lu";
import { contactPhone, contactTelephone } from "@/data/contact";
import styles from "./enquiry.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

const nextSteps = [
  { label: "01 / REVIEW", title: "We read your brief", copy: "Your purpose, budget and timing help us shortlist the plots that fit." },
  { label: "02 / CONVERSATION", title: "We call you", copy: "A member of our team will reach out to talk through the options with you." },
  { label: "03 / SITE VISIT", title: "Walk the land", copy: "When you are ready, we arrange a visit to see the plots in person." },
];

export type EnquiryAnswer = { label: string; value: string };

type EnquirySuccessProps = {
  name: string;
  phone: string;
  answers: EnquiryAnswer[];
  reduced: boolean;
  onReset: () => void;
};

/** Confirmation seal: the ring draws, the disc lands with one ripple, the check strokes in and the seal text slowly circles. */
function SuccessSeal({ reduced }: { reduced: boolean }) {
  const at = (delay: number, transition: Transition = {}): Transition => (reduced ? { duration: 0 } : { delay, ...transition });
  const from = <T,>(value: T) => (reduced ? false : value);

  return (
    <div className={styles.seal} aria-hidden="true">
      <svg viewBox="0 0 140 140" className={styles.sealSvg}>
        <defs>
          <path id="seal-text-path" d="M70,70 m-55,0 a55,55 0 1,1 110,0 a55,55 0 1,1 -110,0" />
        </defs>

        <motion.circle cx={70} cy={70} r={67} fill="none" stroke="#173c32" strokeOpacity={0.22} strokeWidth={0.8}
          style={{ rotate: -90, originX: 0.5, originY: 0.5 }}
          initial={from({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={at(0, { duration: 1.1, ease })} />

        <motion.g style={{ originX: 0.5, originY: 0.5 }}
          initial={from({ opacity: 0, rotate: -40 })}
          animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: [-40, 0, 360] }}
          transition={reduced ? { duration: 0 } : { opacity: { delay: 0.75, duration: 0.8 }, rotate: { delay: 0.75, duration: 60, times: [0, 0.025, 1], ease: ["easeOut", "linear"], repeat: Infinity, repeatType: "loop" } }}>
          <text className={styles.sealText}>
            <textPath href="#seal-text-path" textLength={344} lengthAdjust="spacing">ENQUIRY RECEIVED · STAR MANAGED FARMLANDS · COORG ·</textPath>
          </text>
        </motion.g>

        {!reduced && (
          <motion.circle cx={70} cy={70} r={38} fill="none" stroke="#315d45" strokeWidth={1.2}
            style={{ originX: 0.5, originY: 0.5 }}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: [0.9, 1.45], opacity: [0, 0.5, 0] }}
            transition={{ delay: 0.55, duration: 1.1, ease: "easeOut" }} />
        )}

        <motion.circle cx={70} cy={70} r={38} fill="#173c32"
          style={{ originX: 0.5, originY: 0.5 }}
          initial={from({ scale: 0.4, opacity: 0 })} animate={{ scale: 1, opacity: 1 }}
          transition={at(0.3, { type: "spring", stiffness: 240, damping: 20 })} />
        <motion.circle cx={70} cy={70} r={32.5} fill="none" stroke="#f4f0e7" strokeOpacity={0.18} strokeWidth={0.8}
          initial={from({ opacity: 0 })} animate={{ opacity: 1 }} transition={at(0.6, { duration: 0.5 })} />

        <motion.path d="M56 71 L65.5 80.5 L85 60" fill="none" stroke="#f4f0e7" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round"
          initial={from({ pathLength: 0 })} animate={{ pathLength: 1 }} transition={at(0.7, { duration: 0.5, ease: [0.65, 0, 0.35, 1] })} />
      </svg>
    </div>
  );
}

export function EnquirySuccess({ name, phone, answers, reduced, onReset }: EnquirySuccessProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const firstName = name.trim().split(/\s+/)[0] || name;

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    const bounds = root.current?.getBoundingClientRect();
    if (bounds && (bounds.top < 80 || bounds.top > window.innerHeight * 0.6)) {
      root.current?.scrollIntoView({ block: "start", behavior: reduced ? "instant" : "smooth" });
    }
  }, [reduced]);

  const rise = (delay: number) => (reduced
    ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { delay, duration: 0.7, ease } });

  return (
    <motion.div ref={root} className={styles.success} role="status" aria-live="polite"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.15 : 0.35 }}>
      <SuccessSeal reduced={reduced} />

      <motion.h3 ref={heading} tabIndex={-1} className={styles.successHeading} {...rise(0.9)}>
        Thank you, <em>{firstName}.</em>
      </motion.h3>
      <motion.p className={styles.successCopy} {...rise(1.0)}>
        Your enquiry is with the Star Managed Farmlands team. We will call you on <strong>{phone}</strong> to take it forward.
      </motion.p>

      <motion.dl className={styles.summary} {...rise(1.12)}>
        {answers.map((answer) => (
          <div key={answer.label} className={styles.summaryItem}>
            <dt>{answer.label}</dt>
            <dd>{answer.value}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.div className={styles.nextSteps} {...rise(1.24)}>
        {nextSteps.map((step) => (
          <div key={step.label}>
            <span>{step.label}</span>
            <h4>{step.title}</h4>
            <p>{step.copy}</p>
          </div>
        ))}
      </motion.div>

      <motion.div className={styles.successActions} {...rise(1.36)}>
        <Link href="/projects" className={styles.successPrimary}>Explore projects <LuArrowRight aria-hidden="true" /></Link>
        <button type="button" className={styles.successReset} onClick={onReset}><LuRotateCcw aria-hidden="true" /> Submit another enquiry</button>
      </motion.div>
      <motion.p className={styles.successNote} {...rise(1.44)}>
        Need to talk sooner? Call <a href={`tel:${contactTelephone}`}>{contactPhone}</a>.
      </motion.p>
    </motion.div>
  );
}
