import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';

export const LocationContactSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLElement>(0.1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section 
      id="contact" 
      ref={sectionRef} 
      className={`py-24 bg-white relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8A6943] block mb-2">
            {lang === 'vi' ? 'VỊ TRÍ & LIÊN HỆ' : 'LOCATION & CONTACT'}
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 tracking-tight">
            {t('contact.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#E8DCB9]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 uppercase tracking-wider mb-1">{t('contact.address_title')}</h4>
                  <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                    {t('contact.address')}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-[#E8DCB9]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 uppercase tracking-wider mb-1">{t('contact.phone_title')}</h4>
                  <p className="text-xs text-neutral-800 font-semibold font-sans">
                    {t('contact.phone')}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#E8DCB9]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 uppercase tracking-wider mb-1">{t('contact.email_title')}</h4>
                  <p className="text-xs text-neutral-600 font-sans">
                    {t('contact.email')}
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF9F5] p-5 rounded-xl border border-neutral-200/80 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#E8DCB9]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-neutral-900 uppercase tracking-wider mb-1">{t('contact.hours_title')}</h4>
                  <p className="text-xs text-neutral-600 font-sans">
                    {t('contact.hours_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-xl overflow-hidden border border-neutral-200/90 shadow-sm h-72 w-full relative">
              <iframe
                title="Galaxy Boutique Hotel Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5621599203555!2d106.69309!3d10.768188!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752fcaf428be75%3A0x323b5d4e6f707fb0!2sGalaxy%20Boutique%20Hotel!5e0!3m2!1svi!2s!4v1784154591201!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Clean Inquiry Form */}
          <div className="lg:col-span-5 bg-[#FAF9F5] p-7 sm:p-8 rounded-2xl border border-neutral-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <h3 className="font-serif font-semibold text-2xl text-neutral-900 mb-1 tracking-tight">
              {t('contact.inquiry_title')}
            </h3>
            <p className="text-neutral-500 text-xs sm:text-sm mb-6 font-sans">
              {t('contact.inquiry_sub')}
            </p>

            {submitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
                <Check className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-900 text-base">Gửi Thành Công!</h4>
                <p className="text-xs text-emerald-700 mt-1 font-sans">
                  Cảm ơn quý khách. Chúng tôi sẽ phản hồi trong ít phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                    {t('contact.form_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                      {t('contact.form_phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0901 234 567"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                      {t('contact.form_email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-neutral-600 mb-1.5">
                    {t('contact.form_msg')} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'vi' ? 'Quý khách cần hỗ trợ thêm thông tin gì...' : 'How can we help you...'}
                    className="w-full bg-white border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-magnetic w-full py-3 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5 text-[#B89369]" />
                  <span>{t('contact.form_submit')}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
