"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, CheckCircle2, Mail, AlertCircle, Loader2, Copy, Check, ExternalLink, PenLine, Inbox, Reply } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { usePortfolio } from "@/context/PortfolioContext";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/social";
import Magnetic from "@/components/fx/Magnetic";
import { Reveal, SplitWords } from "@/components/fx/Reveal";

type Status = "idle" | "sending" | "success" | "error";

/** Sends from the browser so FormSubmit sees the site's origin. Checks the JSON body, not just HTTP 200. */
async function sendEmail(data: { name: string; email: string; message: string }) {
  const res = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      message: data.message,
      _subject: `Portafolio · Nuevo mensaje de ${data.name}`,
      _replyto: data.email,
      _template: "table",
      _captcha: "false",
    }),
  });
  const json = (await res.json().catch(() => ({}))) as { success?: string | boolean; message?: string };
  const ok = res.ok && (json.success === true || json.success === "true");
  return { ok, detail: json.message ?? "" };
}

export default function Contact() {
  const { isEnglish } = usePortfolio();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [sentTo, setSentTo] = useState("");
  const [copied, setCopied] = useState(false);

  const t = isEnglish
    ? {
        eyebrow: "Contact · Email form",
        title1: "Send me an",
        title2: "email.",
        intro: "Fill in this form and your message arrives straight to my Gmail inbox. I'll reply to the email address you write here.",
        steps: [
          { icon: PenLine, k: "Write", v: "Your name, your email and your message." },
          { icon: Send, k: "Send", v: "Press “Send email”. No account needed." },
          { icon: Reply, k: "Get a reply", v: "I answer directly to your email." },
        ],
        formTitle: "Email form",
        formTo: "Arrives to",
        name: "Your name",
        namePh: "e.g. Laura Gómez or ACME Inc.",
        email: "Your email (so I can reply)",
        emailPh: "you@example.com",
        message: "Your message",
        messagePh: "Hi Carlos, I'd like to talk about…",
        send: "Send email",
        sending: "Sending your email…",
        okTitle: "Email sent!",
        okBody: (to: string) => `Your message is in my inbox. I'll reply to ${to}.`,
        another: "Send another",
        errTitle: "The email couldn't be sent from here",
        errBody: "No worries — send it from your own email app with one click (your message is already filled in):",
        gmail: "Open in Gmail",
        mailApp: "Open email app",
        copy: "Copy my email",
        copiedTxt: "Copied!",
        alt: "Prefer your own email app?",
        social: "Or find me on",
        privacy: "Your data is only used to answer you.",
      }
    : {
        eyebrow: "Contacto · Formulario de correo",
        title1: "Envíame un",
        title2: "correo.",
        intro: "Llena este formulario y tu mensaje llega directo a mi bandeja de Gmail. Te responderé al correo que escribas aquí.",
        steps: [
          { icon: PenLine, k: "Escribe", v: "Tu nombre, tu correo y tu mensaje." },
          { icon: Send, k: "Envía", v: "Presiona “Enviar correo”. No necesitas cuenta." },
          { icon: Reply, k: "Recibe respuesta", v: "Te contesto directo a tu correo." },
        ],
        formTitle: "Formulario de correo",
        formTo: "Llega a",
        name: "Tu nombre",
        namePh: "Ej. Laura Gómez o Empresa S.A.S.",
        email: "Tu correo (para responderte)",
        emailPh: "tucorreo@ejemplo.com",
        message: "Tu mensaje",
        messagePh: "Hola Carlos, me gustaría hablar sobre…",
        send: "Enviar correo",
        sending: "Enviando tu correo…",
        okTitle: "¡Correo enviado!",
        okBody: (to: string) => `Tu mensaje ya está en mi bandeja. Te responderé a ${to}.`,
        another: "Enviar otro",
        errTitle: "No se pudo enviar el correo desde aquí",
        errBody: "Tranquilo — envíalo desde tu propio correo con un clic (tu mensaje ya va escrito):",
        gmail: "Abrir en Gmail",
        mailApp: "Abrir app de correo",
        copy: "Copiar mi correo",
        copiedTxt: "¡Copiado!",
        alt: "¿Prefieres usar tu propio correo?",
        social: "O encuéntrame en",
        privacy: "Tus datos solo se usan para responderte.",
      };

  const subject = `Portafolio · ${form.name || (isEnglish ? "Contact" : "Contacto")}`;
  const body = form.message ? `${form.message}\n\n— ${form.name}\n${form.email}` : "";
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const mailtoHref = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the address is visible anyway */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return; // bot trap
    setStatus("sending");
    try {
      const { ok } = await sendEmail(form);
      if (ok) {
        setSentTo(form.email);
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const input =
    "w-full h-13 px-4 rounded-2xl bg-base/60 border border-glass-border text-ink placeholder:text-muted/60 outline-none focus:border-accent focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)] transition-all";

  return (
    <section id="contacto" className="relative w-full px-5 sm:px-8 lg:px-12 py-28 sm:py-40">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 font-mono text-[11px] tracking-[0.3em] uppercase text-muted">
          <span className="text-accent-ink">06</span>
          <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
          <span>{t.eyebrow}</span>
        </div>

        <h2 className="font-display font-extrabold uppercase leading-[0.85] text-ink text-[clamp(3rem,10vw,9.5rem)]">
          <SplitWords text={t.title1} />{" "}
          <span className="font-serif-i normal-case font-normal text-gradient text-glow">
            <SplitWords text={t.title2} delay={0.2} />
          </span>
        </h2>

        <div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* ---------- Explanation ---------- */}
          <Reveal className="lg:col-span-5 flex flex-col gap-8">
            <p className="text-lg sm:text-xl text-ink/85 leading-relaxed">{t.intro}</p>

            <ol className="flex flex-col gap-3">
              {t.steps.map((s, i) => (
                <li key={s.k} className="glass rounded-2xl p-4 flex items-start gap-4">
                  <span className="relative shrink-0 w-11 h-11 rounded-xl bg-accent/12 border border-accent/30 flex items-center justify-center">
                    <s.icon className="w-5 h-5 text-accent-ink" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-[#030407] font-mono text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </span>
                  <div>
                    <div className="font-display font-bold text-ink">{s.k}</div>
                    <div className="text-sm text-muted">{s.v}</div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="flex flex-col gap-3">
              <div className="font-mono text-[10.5px] tracking-[0.25em] text-muted uppercase">{t.social}</div>
              <div className="flex items-center gap-3">
                {[
                  { href: LINKEDIN_URL, label: "LinkedIn", icon: <LinkedinIcon className="w-5 h-5" /> },
                  { href: GITHUB_URL, label: "GitHub", icon: <GithubIcon className="w-5 h-5" /> },
                ].map((s) => (
                  <Magnetic key={s.label} strength={0.5}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.label}
                      className="btn-ghost h-12 px-5 rounded-full flex items-center gap-2 text-sm font-semibold hover:border-accent hover:text-accent-ink transition-all"
                    >
                      {s.icon}
                      {s.label}
                    </a>
                  </Magnetic>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ---------- Form ---------- */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="glass glow-border rounded-[2.2rem] overflow-hidden">
              {/* Envelope header: makes it obvious this is an email */}
              <div className="flex items-center gap-4 px-6 sm:px-10 py-5 border-b border-glass-border bg-accent/5">
                <span className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-[0_0_30px_-4px_var(--glow)]">
                  <Mail className="w-6 h-6 text-[#030407]" />
                </span>
                <div className="min-w-0">
                  <div className="font-display font-bold text-lg text-ink">{t.formTitle}</div>
                  <div className="text-sm text-muted truncate">
                    {t.formTo}: <span className="font-mono text-accent-ink">{EMAIL}</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="ok"
                    className="px-6 sm:px-10 py-14 flex flex-col items-center text-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  >
                    <motion.span
                      className="w-20 h-20 rounded-full bg-accent/15 border border-accent/40 flex items-center justify-center"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-10 h-10 text-accent-ink" />
                    </motion.span>
                    <h3 className="font-display font-extrabold text-3xl text-ink">{t.okTitle}</h3>
                    <p className="text-muted max-w-sm">{t.okBody(sentTo)}</p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="btn-ghost mt-2 h-12 px-6 rounded-full font-semibold hover:border-accent transition-colors"
                    >
                      {t.another}
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="px-6 sm:px-10 py-8 flex flex-col gap-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* honeypot (hidden from humans) */}
                    <input
                      type="text"
                      name="_honey"
                      value={honey}
                      onChange={(e) => setHoney(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-ink">{t.name}</span>
                        <input
                          type="text"
                          name="name"
                          required
                          autoComplete="name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder={t.namePh}
                          className={`${input} h-13`}
                        />
                      </label>
                      <label className="flex flex-col gap-2">
                        <span className="text-sm font-semibold text-ink">{t.email}</span>
                        <input
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder={t.emailPh}
                          className={`${input} h-13`}
                        />
                      </label>
                    </div>

                    <label className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-ink">{t.message}</span>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={t.messagePh}
                        className={`${input} h-auto py-3.5 resize-none`}
                      />
                    </label>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-2xl border border-accent-3/40 bg-accent-3/8 p-4 sm:p-5">
                            <div className="flex items-center gap-2 font-display font-bold text-ink">
                              <AlertCircle className="w-5 h-5 text-accent-3" />
                              {t.errTitle}
                            </div>
                            <p className="mt-1.5 text-sm text-muted">{t.errBody}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <a
                                href={gmailHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-neon h-11 px-5 rounded-full text-sm font-bold inline-flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {t.gmail}
                              </a>
                              <a
                                href={mailtoHref}
                                className="btn-ghost h-11 px-5 rounded-full text-sm font-semibold inline-flex items-center gap-2 hover:border-accent"
                              >
                                <Inbox className="w-4 h-4" />
                                {t.mailApp}
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Magnetic strength={0.2} className="w-full">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="btn-neon w-full h-16 rounded-full font-display font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t.sending}
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            {t.send}
                          </>
                        )}
                      </button>
                    </Magnetic>
                    <p className="text-center text-xs text-muted">{t.privacy}</p>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Always-available alternatives */}
              <div className="px-6 sm:px-10 py-5 border-t border-glass-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm text-muted">{t.alt}</span>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={gmailHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost h-10 px-4 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 hover:border-accent hover:text-accent-ink transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Gmail
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="btn-ghost h-10 px-4 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 hover:border-accent hover:text-accent-ink transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? t.copiedTxt : t.copy}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
