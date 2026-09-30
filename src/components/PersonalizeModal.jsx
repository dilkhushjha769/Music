import React, { useState } from 'react';
import sounds from '../audio/soundEffects';

export default function PersonalizeModal({
  isOpen,
  onClose,
  data,
  onSave,
}) {
  const [formData, setFormData] = useState(data);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    sounds.playTap();
    sounds.playSparkle();
    onSave(formData);
    onClose();
  };

  const handleCopyLink = () => {
    sounds.playTap();
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('name', formData.girlfriendName);
    if (formData.specialDate) url.searchParams.set('date', formData.specialDate);
    if (formData.personalMessage) url.searchParams.set('msg', formData.personalMessage);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative max-w-md w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-rose-100">
          <div>
            <h3 className="text-xl font-serif text-[#331C24] font-medium">
              Personalize Surprise ✨
            </h3>
            <p className="text-xs text-[#9E6573] font-sans mt-0.5">
              Customize with her name &amp; sweet memories
            </p>
          </div>
          <button
            onClick={() => {
              sounds.playTap();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-rose-50 text-rose-400 hover:bg-rose-100 flex items-center justify-center text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#663A46] uppercase tracking-wider mb-1.5">
              Girlfriend's Name [HER_NAME]
            </label>
            <input
              type="text"
              name="girlfriendName"
              value={formData.girlfriendName}
              onChange={handleChange}
              placeholder="e.g. Nonsense 🙃"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-sm text-[#382229] bg-[#FFFBFD]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#663A46] uppercase tracking-wider mb-1.5">
              Our Special Date [OUR_SPECIAL_DATE]
            </label>
            <input
              type="text"
              name="specialDate"
              value={formData.specialDate}
              onChange={handleChange}
              placeholder="e.g. October 24, 2023"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-sm text-[#382229] bg-[#FFFBFD]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#663A46] uppercase tracking-wider mb-1.5">
              Final Personal Message [PERSONAL_MESSAGE]
            </label>
            <textarea
              name="personalMessage"
              rows={3}
              value={formData.personalMessage}
              onChange={handleChange}
              placeholder="e.g. No matter how many websites I build, this one will always be my favorite. ❤️"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400/50 text-sm text-[#382229] bg-[#FFFBFD] resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5">
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-full bg-gradient-to-r from-[#FF4B72] to-[#E62248] text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            Save &amp; Update Now ❤️
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full py-2.5 rounded-full bg-rose-50 border border-rose-200 text-[#C43854] text-xs font-semibold uppercase tracking-wider hover:bg-rose-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{copied ? '✓ Link Copied to Clipboard!' : '🔗 Copy Shareable Link for Her'}</span>
          </button>
        </div>

        <p className="text-[11px] text-[#A67E88] text-center mt-3 font-sans">
          The link automatically encodes her name and message so she sees the customized surprise when opened!
        </p>
      </div>
    </div>
  );
}
