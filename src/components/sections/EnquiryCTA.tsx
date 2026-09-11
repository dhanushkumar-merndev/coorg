"use client";

import { useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LuArrowUpRight, LuMinus, LuMountain, LuX } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import { contactPhone, contactTelephone, whatsappUrl } from "@/data/contact";
import { AnimatedSelect } from "@/components/ui/AnimatedSelect";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./sections.module.css";
import formStyles from "./enquiry.module.css";

export function EnquiryCTA({ defaultOpen = false, standalone = false }: { defaultOpen?: boolean; standalone?: boolean } = {}) {
  const [open, setOpen] = useState(defaultOpen || standalone);
  const [status, setStatus] = useState("");
  const firstInput = useRef<HTMLInputElement>(null);
  const openButton = useRef<HTMLButtonElement>(null);
  const focusAfterOpen = useRef(false);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  function closeForm() {
    setOpen(false);
    setStatus("");
    openButton.current?.focus({ preventScroll: true });
  }

  function openWhatsApp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get("name") ?? "").trim();
    const contact = String(values.get("contact") ?? "").trim();
    const nameInput = form.elements.namedItem("name") as HTMLInputElement;
    const contactInput = form.elements.namedItem("contact") as HTMLInputElement;

    nameInput.setCustomValidity(name.length >= 2 ? "" : "Please enter your name.");
    const contactValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
      || (/^[+\d\s().-]+$/.test(contact) && contact.replace(/\D/g, "").length >= 7 && contact.replace(/\D/g, "").length <= 15);
    contactInput.setCustomValidity(contactValid ? "" : "Please enter a valid email address or phone number.");
    if (!form.reportValidity()) return;

    const message = [
      "Hello Land in Coorg, I would like to enquire.",
      "",
      `Name: ${name}`,
      `Contact: ${contact}`,
      `Interest: ${String(values.get("interest") ?? "Still exploring")}`,
      "",
      "What I am looking for:",
      String(values.get("note") ?? "").trim() || "I would like to discuss the available properties.",
    ].join("\n");
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
    setStatus("Your enquiry is ready in WhatsApp. Review it and tap Send to start the conversation.");
  }

  return (
    <section id="enquiry" className={`${styles.enquirySection} ${formStyles.section} ${standalone ? formStyles.standalone : ""}`} aria-labelledby={standalone ? "enquiry-form-heading" : "enquiry-heading"}>
      {!standalone && <>
      <p className={styles.eyebrow}>05 / Begin with a conversation</p>
      <LuMountain className={`${styles.enquiryLandscape} ${formStyles.landscape}`} aria-hidden="true" />
      <h2 id="enquiry-heading">Your kind of land.<br /><em>Your kind of life.</em></h2>
      <p className={styles.enquiryCopy}>Looking for a specific kind of land in Coorg?<br />Tell us what you are looking for.</p>
      <button ref={openButton} type="button" className={`${styles.enquiryButton} ${formStyles.button}`} onClick={() => { if (open) closeForm(); else { focusAfterOpen.current = true; setOpen(true); setStatus(""); } }} aria-expanded={open} aria-controls="private-enquiry-form">{open ? "Close Enquiry" : "Start an Enquiry"}{open ? <LuMinus aria-hidden="true" /> : <LuArrowUpRight aria-hidden="true" />}</button>
      <p className={styles.contactNote}>Call <a href={`tel:${contactTelephone}`}>{contactPhone}</a> or enquire on WhatsApp.</p>
      </>}
      <AnimatePresence initial={false}>
      {open && (
        <motion.div key="enquiry-form" className={formStyles.formMotion} initial={{ height: reduced ? "auto" : 0, opacity: 0, overflow: "hidden" }} animate={{ height: "auto", opacity: 1, transitionEnd: { overflow: "visible" } }} exit={{ height: reduced ? "auto" : 0, opacity: 0, overflow: "hidden" }} transition={{ duration: reduced ? 0.08 : 0.5, ease: [0.16, 1, 0.3, 1] }} onAnimationComplete={() => {
          if (open && focusAfterOpen.current) { firstInput.current?.focus({ preventScroll: true }); firstInput.current?.scrollIntoView({ block: "center", behavior: reduced ? "instant" : "smooth" }); focusAfterOpen.current = false; }
        }}>
        <div id="private-enquiry-form" className={`${styles.formPanel} ${formStyles.panel}`}>
          <div className={styles.formHeader}>
            <h3 id="enquiry-form-heading">A little about your search.</h3>
            {!standalone && <button type="button" onClick={closeForm} className={`${styles.closeForm} ${formStyles.close}`} aria-label="Close enquiry form"><LuX aria-hidden="true" /></button>}
          </div>
          <p className={styles.formHelp}>Call <a href={`tel:${contactTelephone}`}>{contactPhone}</a> · <a href={whatsappUrl()} target="_blank" rel="noreferrer">Chat on WhatsApp</a></p>
          <p id="enquiry-form-help" className={styles.formHelp}>Continue to WhatsApp with your details filled in. Review the message there, then tap Send.</p>
          <form onSubmit={openWhatsApp} aria-describedby="enquiry-form-help" onInput={(event) => {
            const target = event.target;
            if (target instanceof HTMLInputElement) target.setCustomValidity("");
            if (status) setStatus("");
          }}>
            <div className={styles.formGrid}>
              <label htmlFor="enquiry-name">Your name <span aria-hidden="true">*</span><input ref={firstInput} id="enquiry-name" name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Name" /></label>
              <label htmlFor="enquiry-contact">Email or phone <span aria-hidden="true">*</span><input id="enquiry-contact" name="contact" required maxLength={180} placeholder="How you would like to be contacted" /></label>
              <AnimatedSelect id="enquiry-interest" name="interest" label="What draws you here?" className={styles.fullField} defaultValue="Still exploring" options={["Still exploring", "Star Garden", "Managed Farmlands", "Madikeri Estate", "Plantation Estates", "Private Hill Retreats", "Curated Estate Plots", "Forest & Mountain Land", "Countryside Homes"]} onValueChange={() => setStatus("")} />
              <label htmlFor="enquiry-note" className={styles.fullField}>A little more <span className={styles.optional}>(optional)</span><textarea id="enquiry-note" name="note" maxLength={3000} rows={3} placeholder="Your ideal setting, preferred area, or what matters most to you…" /></label>
            </div>
            <button type="submit" className={`${styles.downloadButton} ${formStyles.button}`}>Continue on WhatsApp <FaWhatsapp aria-hidden="true" /></button>
            <p role="status" aria-live="polite" className={styles.formStatus}>{status}</p>
          </form>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
}
