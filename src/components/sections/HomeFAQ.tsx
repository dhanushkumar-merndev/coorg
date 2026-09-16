"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import TransitionLink from "../navigation/TransitionLink";
import styles from "./faq.module.css";

const questions = [
  {
    question: "What can I explore with Star Managed Farmlands?",
    answer: "Explore managed farmland projects and different ways to connect with the land. Share the setting, space and experience you have in mind to start a more personal conversation.",
  },
  {
    question: "What does managed farmland include?",
    answer: "The scope of farm management depends on the project. Ask about the specific cultivation, maintenance and reporting arrangements, along with any associated charges, before deciding.",
  },
  {
    question: "How do I find out about pricing and availability?",
    answer: "Send an enquiry with the project or type of land that interests you. Current availability, pricing and the basis of any quote need to be confirmed for that particular property.",
  },
  {
    question: "Can I request a site visit?",
    answer: "Yes. Include the project you are interested in and your preferred dates in your enquiry. Visit arrangements and access need to be confirmed before you travel.",
  },
  {
    question: "Are all the images actual property photographs?",
    answer: "The website includes supplied photographs, conceptual landscapes and illustrative renders. Conceptual imagery helps convey a mood or possibility; it does not show a specific property. Check the image labels and the relevant project details.",
  },
  {
    question: "How do I start a conversation?",
    answer: "Use the enquiry form to share your name, contact details and what you are looking for. You can review the prepared message in WhatsApp before sending it.",
  },
];

export function HomeFAQ() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const duration = reduced ? 0 : 0.45;

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-heading">
      <div className={styles.intro}>
        <p className="eyebrow">A LITTLE MORE CLARITY</p>
        <h2 id="faq-heading">Frequently asked<br /><em>questions.</em></h2>
        <p>A few things you might like to know before taking the next step.</p>
        <TransitionLink href="/enquiry" className={styles.link}>Have another question? <span aria-hidden="true">↗</span></TransitionLink>
      </div>
      <div className={styles.questions}>
        {questions.map(({ question, answer }, index) => (
          <motion.div key={question} className={styles.item} data-open={active === index}
            initial={false} animate={{ backgroundColor: active === index ? "rgba(111, 126, 102, 0.07)" : "rgba(111, 126, 102, 0)" }} transition={{ duration }}>
            <h3>
              <button id={`faq-question-${index}`} type="button" aria-expanded={active === index} aria-controls={`faq-answer-${index}`} onClick={() => setActive(active === index ? null : index)}>
                <span className={styles.number} aria-hidden="true">0{index + 1}</span><span>{question}</span>
                <motion.span className={styles.icon} aria-hidden="true" initial={false} animate={{ rotate: active === index ? 45 : 0 }} transition={{ duration: reduced ? 0 : 0.3 }} />
              </button>
            </h3>
            <motion.div id={`faq-answer-${index}`} role="region" aria-labelledby={`faq-question-${index}`} aria-hidden={active !== index} inert={active !== index} className={styles.answer}
              initial={false} animate={{ height: active === index ? "auto" : 0, opacity: active === index ? 1 : 0 }} transition={{ duration, ease: [0.16, 1, 0.3, 1] }}>
              <motion.p initial={false} animate={{ y: active === index || reduced ? 0 : 8 }} transition={{ duration }}>{answer}</motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
