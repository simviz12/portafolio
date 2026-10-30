"use client";

import { useState } from "react";
import { Send, CheckCircle2, Mail, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";
import { usePortfolio } from "@/context/PortfolioContext";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "@/data/social";
import { sendContactMessage } from "@/app/actions/contact";

export default function Contact() {
  const { isEnglish } = usePortfolio();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const payload = new FormData();
    payload.set("name", formData.name);
    payload.set("email", formData.email);
    payload.set("message", formData.message);

    const result = await sendContactMessage(payload);

    if (result.ok) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
      return;
    }

    const subject = encodeURIComponent(`Portafolio · ${formData.name}`);
    const body = encodeURIComponent(`${formData.message}\n\n— ${formData.name}\n${formData.email}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setStatus("error");
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section id="contacto" className="w-full px-4 sm:px-6 lg:px-8 pt-16 pb-12 flex flex-col items-center bg-tactical-grid">
      <div className="w-full max-w-5xl rounded-3xl bg-[#0f1923]/95 border border-[#00f5d4]/40 p-8 sm:p-12 shadow-2xl flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] font-valorant-mono text-xs self-start font-semibold">
            <span>{isEnglish ? "DIRECT CHANNEL • PROFESSIONAL CONTACT" : "CANAL DIRECTO • CONTACTO PROFESIONAL"}</span>
          </div>
          <h3 className="font-valorant-title text-4xl sm:text-5xl text-[#ece8e1] tracking-wide uppercase leading-none">
            {isEnglish ? "LET'S START A CONVERSATION" : "INICIEMOS UNA CONVERSACIÓN"}
          </h3>
          <p className="text-base text-[#8b9bb4] font-valorant-hud">
            {isEnglish
              ? "The form delivers a real email to my Gmail. First time ever, FormSubmit may ask me to confirm the inbox — after that, messages land directly."
              : "El formulario envía un correo real a mi Gmail. La primera vez FormSubmit puede pedirme confirmar la bandeja; después los mensajes llegan directo."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1.5">
            <label className="font-valorant-mono text-xs text-[#00f5d4] font-semibold">
              {isEnglish ? "FULL NAME" : "NOMBRE COMPLETO"}
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={isEnglish ? "Your name or company" : "Tu nombre o empresa"}
              className="w-full h-12 px-4 rounded-xl bg-[#16222f] text-[#ece8e1] font-valorant-hud text-base border border-white/10 outline-none focus:border-[#00f5d4] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-valorant-mono text-xs text-[#00f5d4] font-semibold">
              {isEnglish ? "EMAIL ADDRESS" : "CORREO ELECTRÓNICO"}
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="nombre@ejemplo.com"
              className="w-full h-12 px-4 rounded-xl bg-[#16222f] text-[#ece8e1] font-valorant-hud text-base border border-white/10 outline-none focus:border-[#00f5d4] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-valorant-mono text-xs text-[#00f5d4] font-semibold">
              {isEnglish ? "PROJECT MESSAGE / PROPOSAL" : "MENSAJE DEL PROYECTO O PROPUESTA"}
            </label>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={isEnglish ? "Tell me about the goals, scope, and technical vision..." : "Cuéntame sobre el objetivo, requerimientos y alcance..."}
              className="w-full p-4 rounded-xl bg-[#16222f] text-[#ece8e1] font-valorant-hud text-base border border-white/10 outline-none focus:border-[#00f5d4] transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full py-4 mt-2 rounded-full bg-gradient-to-r from-[#00f5d4] to-[#00c4a7] text-[#090e14] font-valorant-title text-base sm:text-lg tracking-wider font-bold shadow-[0_0_25px_rgba(0,245,212,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {status === "sending" ? (
              <span>{isEnglish ? "SENDING..." : "ENVIANDO..."}</span>
            ) : status === "success" ? (
              <span className="flex items-center gap-2 text-emerald-950 font-black">
                <CheckCircle2 className="w-5 h-5" />
                {isEnglish ? "EMAIL SENT" : "CORREO ENVIADO"}
              </span>
            ) : status === "error" ? (
              <span className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {isEnglish ? "OPENING EMAIL APP..." : "ABRIENDO TU CORREO..."}
              </span>
            ) : (
              <>
                <Send className="w-5 h-5 text-[#090e14]" />
                <span>{isEnglish ? "SEND EMAIL" : "ENVIAR CORREO"}</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-valorant-mono text-xs text-[#8b9bb4]">
            {isEnglish ? "DIRECT EMAIL & SOCIAL LINKS:" : "CORREO ELECTRÓNICO DIRECTO & REDES:"}
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#121c26] hover:bg-[#00f5d4] text-[#00f5d4] hover:text-[#090e14] border border-[#00f5d4]/40 transition-all font-valorant-mono text-xs font-bold"
            >
              <Mail className="w-4 h-4" />
              <span>{EMAIL}</span>
            </a>

            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#121c26] hover:bg-[#00f5d4] text-[#ece8e1] hover:text-[#090e14] border border-white/10 hover:border-[#00f5d4] transition-all"
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>

            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-[#121c26] hover:bg-[#00f5d4] text-[#ece8e1] hover:text-[#090e14] border border-white/10 hover:border-[#00f5d4] transition-all"
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
