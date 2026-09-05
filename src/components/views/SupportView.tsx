import React, { useState } from 'react';
import {
  LifeBuoy,
  Phone,
  MessageSquare,
  ExternalLink,
  Trash2,
  Copy,
  Printer,
  Check,
  ShieldAlert,
  UserPlus
} from 'lucide-react';
import { MoodEntry, TrustedContact, UserSettings } from '../../types';
import { CRISIS_HOTLINES } from '../../utils/constants';
import { AICompanionService } from '../../services/aiCompanionService';

interface SupportViewProps {
  entries: MoodEntry[];
  settings: UserSettings;
  trustedContacts: TrustedContact[];
  onAddContact: (contact: Omit<TrustedContact, 'id'>) => void;
  onDeleteContact: (id: string) => void;
}

export const SupportView: React.FC<SupportViewProps> = ({
  entries,
  settings: _settings,
  trustedContacts,
  onAddContact,
  onDeleteContact,
}) => {
  const [activeTab, setActiveTab] = useState<'crisis' | 'contacts' | 'doctor_summary' | 'resources'>('crisis');
  
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactRelationship, setContactRelationship] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactNotes, setContactNotes] = useState('');

  const [counselorNotes, setCounselorNotes] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;
    onAddContact({
      name: contactName.trim(),
      relationship: contactRelationship.trim() || 'Friend',
      phone: contactPhone.trim(),
      notes: contactNotes.trim() || undefined,
    });
    setContactName('');
    setContactRelationship('');
    setContactPhone('');
    setContactNotes('');
    setIsAddingContact(false);
  };

  const doctorSummaryText = AICompanionService.generateDoctorSummary(entries, counselorNotes);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(doctorSummaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C4635A] block">
          Human Connection & Care
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif text-[#1B2430] dark:text-white tracking-tight">
          Support Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connect with trusted loved ones, professional care, and generate clear summaries for appointments.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[#E9E2D6] dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'crisis', label: '24/7 Crisis Helplines' },
          { id: 'contacts', label: 'My Trusted Contacts' },
          { id: 'doctor_summary', label: 'Doctor / Counselor Summary' },
          { id: 'resources', label: 'Professional Guide' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-[#C4635A] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Crisis */}
      {activeTab === 'crisis' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-rose-50/80 dark:bg-rose-950/40 border border-[#C4635A]/30 flex items-start space-x-4">
            <ShieldAlert className="w-6 h-6 text-[#C4635A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-rose-950 dark:text-rose-200">
                Immediate, free, and confidential support
              </h3>
              <p className="text-xs sm:text-sm text-rose-900/80 dark:text-rose-300 leading-relaxed">
                Trained counselors are available 24/7 to listen and support you without judgment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CRISIS_HOTLINES.map((hotline, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#436c86] dark:text-[#7FA7C4] uppercase tracking-wider">
                    {hotline.region}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">{hotline.name}</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{hotline.description}</p>
                </div>
                <a
                  href={hotline.callLink}
                  target={hotline.isExternal ? '_blank' : '_self'}
                  rel="noreferrer"
                  className="flex items-center justify-center space-x-2 py-3 rounded-2xl bg-[#C4635A] text-white font-bold text-xs hover:bg-[#ad4e45] shadow-xs transition-all"
                >
                  {hotline.isExternal ? <ExternalLink className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span>{hotline.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Contacts */}
      {activeTab === 'contacts' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Your Personal Support Circle</h3>
              <p className="text-xs text-slate-400">People you feel safe reaching out to when you need connection.</p>
            </div>
            {!isAddingContact && (
              <button
                onClick={() => setIsAddingContact(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Contact</span>
              </button>
            )}
          </div>

          {isAddingContact && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-[#7FA7C4]/50 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                New Trusted Contact
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                  placeholder="Name (e.g. Maya, Dr. Smith)"
                  className="px-4 py-2.5 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={contactRelationship}
                  onChange={e => setContactRelationship(e.target.value)}
                  placeholder="Relationship (Friend, Partner, Therapist)"
                  className="px-4 py-2.5 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="Phone number (+1 555-0199)"
                  className="px-4 py-2.5 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  value={contactNotes}
                  onChange={e => setContactNotes(e.target.value)}
                  placeholder="Notes (optional, e.g. Free after 6pm)"
                  className="px-4 py-2.5 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => setIsAddingContact(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContact}
                  className="px-5 py-2 rounded-xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
                >
                  Save Contact
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trustedContacts.map(contact => (
              <div key={contact.id} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{contact.name}</h4>
                    <span className="text-xs font-semibold text-[#436c86] dark:text-[#7FA7C4]">
                      {contact.relationship}
                    </span>
                    {contact.notes && (
                      <p className="text-xs text-slate-400 mt-1 italic">“{contact.notes}”</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="text-slate-400 hover:text-[#C4635A] p-1.5 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex space-x-2 pt-3 border-t border-[#E9E2D6] dark:border-slate-800">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`sms:${contact.phone}?body=Hey%20${encodeURIComponent(contact.name)},%20I'm%20having%20a%20bit%20of%20a%20tough%20day.%20Do%20you%20have%20time%20to%20chat?`}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-2xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send SMS</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Doctor Summary */}
      {activeTab === 'doctor_summary' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Shareable Wellbeing Summary</h3>
              <p className="text-xs text-slate-400">
                Organized mood patterns and coping attempts ready for your appointment.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCopySummary}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-[#E9E2D6] hover:bg-slate-50"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSummary ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handlePrintSummary}
                className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#7FA7C4] text-white text-xs font-bold hover:bg-[#6c97b5]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
              Personal notes for your appointment (Optional):
            </label>
            <input
              type="text"
              value={counselorNotes}
              onChange={e => setCounselorNotes(e.target.value)}
              placeholder="e.g. I want help navigating work stress and sleep fatigue."
              className="w-full px-4 py-3 rounded-2xl border border-[#E9E2D6] dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="p-8 rounded-3xl whitespace-pre-line text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-mono leading-relaxed bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs">
            {doctorSummaryText}
          </div>
        </div>
      )}

      {/* TAB 4: Resources */}
      {activeTab === 'resources' && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-[#E9E2D6] dark:border-slate-800 shadow-2xs space-y-4 animate-in fade-in">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Finding Professional Mental Health Support</h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            If emotional stress is persistent or interfering with daily life, working with a licensed counselor or therapist can provide personalized clinical care that AI cannot replace.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {[
              { name: 'Psychology Today Directory', url: 'https://www.psychologytoday.com/us/therapists', desc: 'Find licensed therapists filtered by location, insurance, and specialty.' },
              { name: 'Open Path Collective', url: 'https://openpathcollective.org/', desc: 'Affordable, sliding-scale psychotherapy sessions ($30–$80).' },
              { name: 'Find A Helpline Worldwide', url: 'https://findahelpline.com/', desc: 'Search free, confidential support lines in over 130 countries.' },
              { name: 'Crisis Text Line', url: 'https://www.crisistextline.org/', desc: 'Free 24/7 text support with volunteer crisis counselors.' }
            ].map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-[#E9E2D6] dark:border-slate-700 hover:border-[#7FA7C4] transition-colors flex flex-col justify-between"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                    <span>{res.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{res.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
