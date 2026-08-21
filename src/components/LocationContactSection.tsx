import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { MapPin, Phone, Mail, Clock, Send, Sparkles, CheckCircle2 } from 'lucide-react';

export const LocationContactSection: React.FC = () => {
  const { t } = useLanguage();
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
      className={`py-20 bg-white relative reveal-fade-up ${isVisible ? 'is-revealed' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-hotel-sand border border-hotel-gold/50 text-hotel-navy text-xs font-bold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-hotel-goldDark" />
            <span>{t('contact.eyebrow')}</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-hotel-navy">
            {t('contact.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-hotel-cream p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 card-hover-effect">
                <div className="w-10 h-10 rounded-xl bg-hotel-navy text-hotel-gold flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-hotel-navy mb-1">{t('contact.address_title')}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {t('contact.address')}
                  </p>
                </div>
              </div>

              <div className="bg-hotel-cream p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 card-hover-effect">
                <div className="w-10 h-10 rounded-xl bg-hotel-navy text-hotel-gold flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-hotel-navy mb-1">{t('contact.phone_title')}</h4>
                  <p className="text-xs text-gray-600 font-semibold">
                    {t('contact.phone')}
                  </p>
                </div>
              </div>

              <div className="bg-hotel-cream p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 card-hover-effect">
                <div className="w-10 h-10 rounded-xl bg-hotel-navy text-hotel-gold flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-hotel-navy mb-1">{t('contact.email_title')}</h4>
                  <p className="text-xs text-gray-600">
                    {t('contact.email')}
                  </p>
                </div>
              </div>

              <div className="bg-hotel-cream p-5 rounded-2xl border border-gray-100 flex items-start gap-3.5 card-hover-effect">
                <div className="w-10 h-10 rounded-xl bg-hotel-navy text-hotel-gold flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-hotel-navy mb-1">{t('contact.hours_title')}</h4>
                  <p className="text-xs text-gray-600">
                    {t('contact.hours_desc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-luxury border border-gray-200 h-72 w-full relative transition-transform duration-500 hover:shadow-2xl">
              <iframe
                title="Galaxy Hotel Location"
                src="https://maps.google.com/maps?q=125%20L%C3%AA%20Th%C3%A1nh%20T%C3%B4n,%20Qu%E1%BA%ADn%201,%20H%E1%BB%93%20Ch%C3%AD%20Minh&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Quick Inquiry Form */}
          <div className="lg:col-span-5 bg-hotel-cream p-8 rounded-3xl border border-hotel-gold/30 shadow-luxury card-hover-effect">
            <h3 className="font-serif font-bold text-2xl text-hotel-navy mb-2">
              {t('contact.inquiry_title')}
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm mb-6">
              {t('contact.inquiry_sub')}
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center animate-fade-in">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h4 className="font-bold text-green-800 font-serif text-lg">Gửi Thành Công!</h4>
                <p className="text-xs text-green-700 mt-1">
                  Cảm ơn quý khách. Chúng tôi sẽ liên hệ lại trong ít phút.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {t('contact.form_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Nguyễn Văn A"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hotel-gold transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {t('contact.form_phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0901234567"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hotel-gold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      {t('contact.form_email')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hotel-gold transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {t('contact.form_message')}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Quý khách cần hỗ trợ thêm thông tin gì về đặt phòng, xe đưa đón..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hotel-gold transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-magnetic w-full py-3.5 rounded-xl bg-gradient-to-r from-hotel-navy to-hotel-deep hover:from-hotel-deep hover:to-hotel-navy text-hotel-gold font-bold text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-hotel-gold" />
                  <span>{t('contact.form_send')}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
