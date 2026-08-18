"use client";

import { Mail, Phone } from "lucide-react";
import Modal from "@/components/ui/Modal";
import WhatsAppIcon from "@/components/common/WhatsAppIcon";

export default function ReferrerProfileModal({ user, onClose }) {
  if (!user) return null;

  const fullName = user.fullName || user.full_name || "Referrer User";
  const referralCode = user.referralCode || user.referral_code || "CODE";
  const phone = user.phone || "";
  const email = user.email || "";

  return (
    <Modal open={true} onClose={onClose} title="Referrer User Profile">
      <div className="flex flex-col gap-5 p-2">
        {/* Header Avatar & Name */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
          <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-300 font-black text-lg sm:text-xl shadow-md shrink-0">
            {fullName.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-col min-w-0">
            <h3 className="font-display text-base sm:text-lg font-bold text-white truncate">{fullName}</h3>
            <span className="text-xs text-amber-400 font-mono font-semibold">
              Code: {referralCode}
            </span>
          </div>
        </div>

        {/* Contact Info Items */}
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-slate-950/60 min-w-0">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0">
              <Mail className="h-3.5 w-3.5 text-brand-400" />
              Email Address:
            </span>
            <span className="font-mono font-bold text-brand-300 text-xs sm:text-sm truncate ml-2">
              {email || "Not available"}
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-slate-950/60 min-w-0">
            <span className="text-xs text-slate-400 flex items-center gap-1.5 shrink-0">
              <Phone className="h-3.5 w-3.5 text-amber-400" />
              Mobile Phone:
            </span>
            <span className="font-mono font-bold text-white text-xs sm:text-sm shrink-0">
              {phone || "Not provided"}
            </span>
          </div>

          {user.points != null && (
            <div className="flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-slate-950/60">
              <span className="text-xs text-slate-400 font-semibold">Confirmed Contest Points:</span>
              <span className="font-black text-amber-300 text-sm sm:text-base">
                {user.points} {user.points === 1 ? "Point" : "Points"}
              </span>
            </div>
          )}
        </div>

        {/* Quick Contact Buttons */}
        <div className="flex items-center gap-2.5 pt-2">
          {phone ? (
            <>
              <a
                href={`https://wa.me/91${phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/15 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition-all shadow-md"
              >
                <WhatsAppIcon className="h-4 w-4 fill-current" />
                WhatsApp
              </a>

              <a
                href={`tel:${phone}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-slate-200 hover:bg-white/10 hover:text-white transition-all shadow-md"
              >
                <Phone className="h-4 w-4 text-amber-400" />
                Call
              </a>
            </>
          ) : (
            <p className="text-xs text-slate-500 italic text-center w-full">No phone number associated with this profile.</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
