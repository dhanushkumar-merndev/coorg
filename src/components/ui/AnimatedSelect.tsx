"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import styles from "./AnimatedSelect.module.css";

type AnimatedSelectProps = {
  id: string;
  name: string;
  label: string;
  options: readonly string[];
  defaultValue?: string;
  className?: string;
  onValueChange?: (value: string) => void;
};

export function AnimatedSelect({ id, name, label, options, defaultValue, className, onValueChange }: AnimatedSelectProps) {
  const initial = Math.max(0, options.indexOf(defaultValue ?? ""));
  const [selected, setSelected] = useState(initial);
  const [active, setActive] = useState(initial);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState({ side: "bottom", height: 286 });
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const optionElements = useRef<Array<HTMLLIElement | null>>([]);
  const list = useRef<HTMLUListElement>(null);
  const search = useRef({ value: "", time: 0 });
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!container.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    const option = optionElements.current[active];
    if (!open || !option || !list.current) return;
    const top = option.offsetTop;
    const bottom = top + option.offsetHeight;
    if (top < list.current.scrollTop) list.current.scrollTop = top;
    else if (bottom > list.current.scrollTop + list.current.clientHeight) list.current.scrollTop = bottom - list.current.clientHeight;
  }, [active, open]);

  function openList() {
    const bounds = trigger.current?.getBoundingClientRect();
    if (bounds) {
      const below = window.innerHeight - bounds.bottom - 18;
      const above = bounds.top - 100;
      const side = below < 286 && above > below ? "top" : "bottom";
      setPlacement({ side, height: Math.max(138, Math.min(286, side === "top" ? above : below)) });
    }
    setOpen(true);
  }

  function choose(index: number) {
    setSelected(index);
    setActive(index);
    setOpen(false);
    onValueChange?.(options[index]);
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Tab") {
      if (open) choose(active);
      return;
    }
    if (event.key === "Escape") {
      if (open) { event.preventDefault(); event.stopPropagation(); setOpen(false); setActive(selected); }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) openList();
      setActive((index) => event.key === "Home" ? 0 : event.key === "End" ? options.length - 1
        : !open ? selected : Math.max(0, Math.min(options.length - 1, index + (event.key === "ArrowDown" ? 1 : -1))));
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) choose(active);
      else { setActive(selected); openList(); }
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const time = performance.now();
      const value = (time - search.current.time < 650 ? search.current.value : "") + event.key.toLowerCase();
      search.current = { value, time };
      const index = options.findIndex((option) => option.toLowerCase().startsWith(value));
      if (index >= 0) { setActive(index); if (!open) openList(); }
    }
  }

  return (
    <div ref={container} className={`${styles.field} ${className ?? ""}`} onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
    }}>
      <label id={`${id}-label`} htmlFor={id} className={styles.label}>{label}</label>
      <input type="hidden" name={name} value={options[selected]} />
      <button ref={trigger} id={id} type="button" role="combobox" className={styles.trigger}
        aria-labelledby={`${id}-label ${id}-value`} aria-controls={`${id}-listbox`} aria-haspopup="listbox"
        aria-expanded={open} aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        onKeyDown={handleKey} onClick={() => { setActive(selected); if (open) setOpen(false); else openList(); }}>
        <span id={`${id}-value`}>{options[selected]}</span>
        <motion.span className={styles.chevron} animate={{ rotate: open ? 180 : 0 }} transition={{ duration: reduced ? 0 : 0.22 }}>
          <LuChevronDown aria-hidden="true" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && <motion.div className={styles.popup} data-side={placement.side} initial={{ height: reduced ? "auto" : 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }} exit={{ height: reduced ? "auto" : 0, opacity: 0 }}
          transition={{ duration: reduced ? 0.08 : 0.24, ease: [0.16, 1, 0.3, 1] }}>
          <ul ref={list} id={`${id}-listbox`} role="listbox" tabIndex={-1} aria-labelledby={`${id}-label`} className={styles.list} style={{ maxHeight: placement.height }}>
            {options.map((option, index) => <li key={option} id={`${id}-option-${index}`} role="option"
              ref={(element) => { optionElements.current[index] = element; }} aria-selected={selected === index}
              className={styles.option} data-active={active === index}
              onPointerMove={() => setActive(index)} onPointerDown={(event) => event.preventDefault()}
              onClick={() => { choose(index); trigger.current?.focus({ preventScroll: true }); }}>
              <span>{option}</span><LuCheck aria-hidden="true" className={selected === index ? styles.check : styles.hiddenCheck} />
            </li>)}
          </ul>
        </motion.div>}
      </AnimatePresence>
    </div>
  );
}
