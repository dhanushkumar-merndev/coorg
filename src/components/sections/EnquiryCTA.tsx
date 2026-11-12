"use client";

import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowRight, LuArrowUpRight, LuLoaderCircle, LuMinus, LuX } from "react-icons/lu";
import { contactPhone, contactTelephone, whatsappUrl } from "@/data/contact";
import { emailPattern, interestOptions, isValidPhone, plotQuestions } from "@/data/enquiry";
import { submitEnquiry } from "@/app/actions/enquiry";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { EnquirySuccess, type EnquiryAnswer } from "./EnquirySuccess";
import styles from "./sections.module.css";
import formStyles from "./enquiry.module.css";

const ease = [0.16, 1, 0.3, 1] as const;

/** Smoothly animates its height when the content swaps (form ⇄ thank-you). */
function AutoHeight({ children, reduced }: { children: ReactNode; reduced: boolean }) {
  const inner = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | "auto">("auto");

  useEffect(() => {
    const element = inner.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setHeight(element.offsetHeight));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div animate={{ height }} transition={{ duration: reduced ? 0 : 0.55, ease }}
      // Clip only while resizing so the interest dropdown can still overflow at rest.
      onAnimationStart={() => { if (inner.current?.parentElement) inner.current.parentElement.style.overflow = "hidden"; }}
      onAnimationComplete={() => { if (inner.current?.parentElement) inner.current.parentElement.style.overflow = ""; }}>
      <div ref={inner}>{children}</div>
    </motion.div>
  );
}

export function EnquiryCTA({ defaultOpen = false, standalone = false }: { defaultOpen?: boolean; standalone?: boolean } = {}) {
  const [open, setOpen] = useState(defaultOpen || standalone);
  const [status, setStatus] = useState("");
  const [submitted, setSubmitted] = useState<{ name: string; phone: string; answers: EnquiryAnswer[] } | null>(null);
  const [pending, startTransition] = useTransition();
  const firstInput = useRef<HTMLInputElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const focusAfterOpen = useRef(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  function closeForm() {
    setOpen(false);
    setStatus("");
    setSubmitted(null);
    openButton.current?.focus({ preventScroll: true });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Called directly (not via <form action>) so a failed save never resets what the visitor typed.
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const read = (key: string) => String(values.get(key) ?? "").trim();
    const name = read("name");
    const phone = read("phone");
    const email = read("email");
    (form.elements.namedItem("name") as HTMLInputElement).setCustomValidity(name.length >= 2 ? "" : "Please enter your full name.");
    (form.elements.namedItem("phone") as HTMLInputElement).setCustomValidity(isValidPhone(phone) ? "" : "Please enter a valid phone number.");
    (form.elements.namedItem("email") as HTMLInputElement).setCustomValidity(emailPattern.test(email) ? "" : "Please enter a valid email address.");
    if (!form.reportValidity()) return;

    values.set("page", window.location.pathname);
    setStatus("");
    startTransition(async () => {
      const result = await submitEnquiry(values);
      if (result.ok) setSubmitted({ name, phone, answers: plotQuestions.map((question) => ({ label: question.summary, value: read(question.name) })) });
      else setStatus(result.error);
    });
  }

  function resetForm() {
    setSubmitted(null);
    setStatus("");
    focusAfterOpen.current = true;
  }

  return (
    <section id="enquiry" className={`${styles.enquirySection} ${formStyles.section} ${standalone ? formStyles.standalone : ""}`} aria-labelledby={standalone ? "enquiry-form-heading" : "enquiry-heading"}>
      {!standalone && <>
      <p className={styles.eyebrow}>05 / Begin with a conversation</p>
      <h2 id="enquiry-heading">Your kind of land.<br /><em>Your kind of life.</em></h2>
      <p className={styles.enquiryCopy}>A place to grow. A little more space. A closer connection with nature.<br />Tell Star Managed Farmlands what your next chapter looks like.</p>
      <div className={formStyles.conversationDetails}>
        <div><span>01 / YOUR VISION</span><h3>Start with what matters.</h3><p>Share your ideal setting, preferred area and how you would like to spend your time on the land.</p></div>
        <div><span>02 / THE DETAILS</span><h3>Make room for questions.</h3><p>Ask about the project, farm management, current availability and the details you need to explore further.</p></div>
        <div><span>03 / YOUR NEXT STEP</span><h3>Take it at your pace.</h3><p>Let us know your timeline and whether you would like to discuss a project or request a site visit.</p></div>
      </div>
      <button ref={openButton} type="button" className={`${styles.enquiryButton} ${formStyles.button}`} onClick={() => { if (open) closeForm(); else { focusAfterOpen.current = true; setOpen(true); setStatus(""); } }} aria-expanded={open} aria-controls="private-enquiry-form">{open ? "Close Enquiry" : "Start an Enquiry"}{open ? <LuMinus aria-hidden="true" /> : <LuArrowUpRight aria-hidden="true" />}</button>
      <p className={styles.contactNote}>Call <a href={`tel:${contactTelephone}`}>{contactPhone}</a> or enquire on WhatsApp.</p>
      </>}
      <AnimatePresence initial={false}>
      {open && (
        <motion.div key="enquiry-form" className={formStyles.formMotion} initial={{ height: reduced ? "auto" : 0, opacity: 0, overflow: "hidden" }} animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }} exit={{ height: reduced ? "auto" : 0, opacity: 0, overflow: "hidden" }} transition={{ duration: reduced ? 0.08 : 0.5, ease: [0.16, 1, 0.3, 1] }} onAnimationComplete={() => {
          if (open && focusAfterOpen.current) { firstInput.current?.focus({ preventScroll: true }); firstInput.current?.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" }); focusAfterOpen.current = false; }
        }}>
        <div id="private-enquiry-form" className={`${styles.formPanel} ${formStyles.panel}`}>
          <AutoHeight reduced={reduced}>
          <AnimatePresence mode="wait" initial={false}>
          {submitted ? (
            <motion.div key="success" className={formStyles.successWrap}>
              {!standalone && <button type="button" onClick={closeForm} className={`${styles.closeForm} ${formStyles.close} ${formStyles.successClose}`} aria-label="Close enquiry form"><LuX aria-hidden="true" /></button>}
              <EnquirySuccess name={submitted.name} phone={submitted.phone} answers={submitted.answers} reduced={reduced} onReset={resetForm} />
            </motion.div>
          ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: reduced ? 0 : -10 }} transition={{ duration: reduced ? 0.1 : 0.3, ease }}
            onAnimationComplete={() => {
              // After "Submit another enquiry", return focus to the first field.
              if (focusAfterOpen.current && firstInput.current) { firstInput.current.focus({ preventScroll: true }); firstInput.current.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" }); focusAfterOpen.current = false; }
            }}>
          <div className={styles.formHeader}>
            <h3 id="enquiry-form-heading">Own your dream plot in Coorg.</h3>
            {!standalone && <button type="button" onClick={closeForm} className={`${styles.closeForm} ${formStyles.close}`} aria-label="Close enquiry form"><LuX aria-hidden="true" /></button>}
          </div>
          <p className={styles.formHelp}>Discover an opportunity to build your dream holiday home in Coorg. Fill in the form to get more details.</p>
          <p className={styles.formHelp}>Call <a href={`tel:${contactTelephone}`}>{contactPhone}</a> · <a href={whatsappUrl()} target="_blank" rel="noreferrer">Chat on WhatsApp</a></p>
          <form onSubmit={handleSubmit} aria-busy={pending} onInput={(event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement && target.type !== "radio") target.setCustomValidity("");
            if (status) setStatus("");
          }}>
            <div className={styles.formGrid}>
              {plotQuestions.map((question) => (
                <fieldset key={question.name} className={`${styles.fullField} ${formStyles.choiceGroup}`}>
                  <legend>{question.legend} <span aria-hidden="true">*</span></legend>
                  <div className={formStyles.choices}>
                    {question.options.map((option, index) => (
                      <label key={option} className={formStyles.choice}>
                        <input type="radio" name={question.name} value={option} required={index === 0} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <label htmlFor="enquiry-name" className={styles.fullField}>Full name <span aria-hidden="true">*</span><input ref={firstInput} id="enquiry-name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Your full name" /></label>
              <label htmlFor="enquiry-phone">Phone number <span aria-hidden="true">*</span><input id="enquiry-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={20} placeholder="+91 98765 43210" /></label>
              <label htmlFor="enquiry-email">Email <span aria-hidden="true">*</span><input id="enquiry-email" name="email" type="email" autoComplete="email" required maxLength={180} placeholder="you@example.com" /></label>
              <AnimatedSelect id="enquiry-interest" name="interest" label="What draws you here?" placeholder="Choose one (optional)" className={styles.fullField} options={interestOptions} onValueChange={() => setStatus("")} />
              <label htmlFor="enquiry-note" className={styles.fullField}>A little more <span className={styles.optional}>(optional)</span><textarea id="enquiry-note" name="note" maxLength={3000} rows={3} placeholder="Your ideal setting, preferred area, or what matters most to you…" /></label>
            </div>
            <div className={formStyles.honeypot} aria-hidden="true"><label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label></div>
            <motion.button type="submit" className={`${styles.downloadButton} ${formStyles.button} ${formStyles.submit}`} disabled={pending}
              whileTap={reduced || pending ? undefined : { scale: 0.97 }}>
              <AnimatePresence mode="wait" initial={false}>
                {pending
                  ? <motion.span key="pending" className={formStyles.submitLabel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>Submitting… <LuLoaderCircle aria-hidden="true" className={formStyles.spinner} /></motion.span>
                  : <motion.span key="idle" className={formStyles.submitLabel} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.15 }}>Submit enquiry <LuArrowRight aria-hidden="true" /></motion.span>}
              </AnimatePresence>
            </motion.button>
            <p role="status" aria-live="polite" className={`${styles.formStatus} ${formStyles.error}`}>{status}</p>
          </form>
          </motion.div>
          )}
          </AnimatePresence>
          </AutoHeight>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
}
