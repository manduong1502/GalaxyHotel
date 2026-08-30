import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, ArrowLeft, ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onBackToWebsite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToWebsite }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('galaxy2026');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await login(username, password);
    setLoading(false);
    if (!res.success) {
      setError(res.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-hotel-navy flex items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-hotel-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hotel-goldDark/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToWebsite}
        className="btn-magnetic absolute top-6 left-6 text-gray-300 hover:text-white flex items-center gap-2 text-xs font-semibold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Về trang chủ khách sạn</span>
      </button>

      {/* Login Card */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-hotel-gold/40 relative z-10 animate-fade-in">
        {/* Brand Logo Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-neutral-950 p-2.5 flex items-center justify-center shadow-md border border-neutral-800">
            <img 
              src="/images/logo.png" 
              alt="Hotel Galaxy Boutique" 
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">
            GALAXY ADMIN
          </h2>
          <p className="text-xs text-neutral-500 font-semibold tracking-widest uppercase mt-1">
            Hệ Thống Quản Trị Khách Sạn
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <ShieldCheck className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Tài Khoản Đăng Nhập
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tên đăng nhập"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-hotel-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Mật Khẩu Quản Trị
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-hotel-gold transition-all"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-hotel-sand/50 border border-hotel-gold/30 text-[11px] text-gray-600 flex items-start gap-2">
            <KeyRound className="w-3.5 h-3.5 text-hotel-goldDark flex-shrink-0 mt-0.5" />
            <span>
              <strong>Tài khoản mặc định:</strong> <br />
              • Admin: <code className="text-hotel-navy font-bold">admin / galaxy2026</code><br />
              • Lễ tân: <code className="text-hotel-navy font-bold">letan / 123456</code>
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-magnetic w-full py-3.5 rounded-xl bg-gradient-to-r from-hotel-gold to-hotel-goldDark hover:from-hotel-goldDark hover:to-hotel-gold text-hotel-navy font-bold text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 mt-6 transition-all"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-hotel-navy border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-hotel-navy" />
                <span>Đăng Nhập Quản Trị</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            Galaxy Boutique Hotel • 269/19 Đề Thám, Quận 1, TP.HCM
          </p>
        </div>
      </div>
    </div>
  );
};
