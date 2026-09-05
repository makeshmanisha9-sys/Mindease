import React from 'react';
import { ShieldAlert, Phone, MessageSquare, ExternalLink, X, HeartHandshake, Wind } from 'lucide-react';
import { CRISIS_HOTLINES } from '../../utils/constants';
import { TrustedContact } from '../../types';

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  trustedContacts: TrustedContact[];
  onOpenBreathing: () => void;
}

export const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  trustedContacts,
  onOpenBreathing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/70 rounded-3xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Immediate Support & Crisis Care</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Free, confidential help is available 24/7. You don't have to carry this alone.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reassurance Notice */}
        <div className="my-4 p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40">
          <p className="text-xs sm:text-sm text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
            If you are in immediate danger, feel unable to keep yourself safe, or are having thoughts of self-harm, please connect with a live crisis counselor or emergency services right now.
          </p>
        </div>

        {/* Hotlines List */}
        <div className="space-y-2.5 my-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">24/7 Crisis Helplines</h3>
          {CRISIS_HOTLINES.map((hotline, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <div>
                <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">{hotline.region}</span>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{hotline.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{hotline.description}</p>
              </div>
              <a
                href={hotline.callLink}
                target={hotline.isExternal ? '_blank' : '_self'}
                rel="noreferrer"
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 shadow-sm shrink-0 transition-colors"
              >
                {hotline.isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <Phone className="w-3.5 h-3.5" />}
                <span>{hotline.number}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Trusted Contacts Quick Action */}
        {trustedContacts.length > 0 && (
          <div className="my-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Reach Out to a Trusted Contact</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {trustedContacts.map(contact => (
                <div key={contact.id} className="p-3 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-900/50 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{contact.name}</h5>
                    <p className="text-[11px] text-slate-500">{contact.relationship}</p>
                  </div>
                  <a
                    href={`sms:${contact.phone}?body=Hey%20${encodeURIComponent(contact.name)},%20I'm%20having%20a%20hard%20time%20right%20now.%20Do%20you%20have%20a%20moment%20to%20talk?`}
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-brand-600 text-white text-[11px] font-semibold hover:bg-brand-700"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Send SMS</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Grounding Button */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenBreathing();
            }}
            className="flex items-center space-x-2 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <Wind className="w-4 h-4" />
            <span>Need a 60-second breathing reset first?</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-300 dark:hover:bg-slate-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
