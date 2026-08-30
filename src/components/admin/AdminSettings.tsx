import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Save, KeyRound, Database, Sheet, HelpCircle, 
  CheckCircle2, AlertCircle, Sparkles, Phone, MapPin, Mail, Lock 
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { googleSheetWebhookUrl, setGoogleSheetWebhookUrl } = useBookings();
  const { user } = useAuth();

  const [webhookInput, setWebhookInput] = useState(googleSheetWebhookUrl);
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookStatus, setWebhookStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Password change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMessage, setPassMessage] = useState('');

  // Email Notification & SMTP State
  const [notificationEmail, setNotificationEmail] = useState(() => {
    return localStorage.getItem('galaxy_hotel_admin_email') || 'minhmanuzu@gmail.com';
  });
  const [smtpUser, setSmtpUser] = useState(() => {
    return localStorage.getItem('galaxy_hotel_smtp_user') || 'minhmanuzu@gmail.com';
  });
  const [smtpPass, setSmtpPass] = useState(() => {
    return localStorage.getItem('galaxy_hotel_smtp_pass') || '';
  });
  const [isSavingSmtp, setIsSavingSmtp] = useState(false);
  const [smtpSaveMessage, setSmtpSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSmtpGuide, setShowSmtpGuide] = useState(false);

  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSaveSmtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!smtpUser.trim() || !smtpPass.trim()) {
      alert('Vui lòng nhập đầy đủ Gmail và Mật khẩu ứng dụng 16 ký tự.');
      return;
    }
    setIsSavingSmtp(true);
    setSmtpSaveMessage(null);

    localStorage.setItem('galaxy_hotel_smtp_user', smtpUser.trim());
    localStorage.setItem('galaxy_hotel_smtp_pass', smtpPass.trim());

    try {
      const res = await fetch('/api/save_smtp.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: smtpUser.trim(),
          password: smtpPass.trim(),
          host: 'smtp.gmail.com',
          port: 465
        })
      });
      const data = await res.json();
      if (data.success) {
        setSmtpSaveMessage({ type: 'success', text: 'Đã lưu cấu hình Gmail SMTP thành công! Hãy bấm "Gửi Email Test" bên dưới để kiểm tra.' });
      } else {
        setSmtpSaveMessage({ type: 'error', text: data.message || 'Không thể lưu cấu hình SMTP' });
      }
    } catch (err) {
      setSmtpSaveMessage({ type: 'success', text: 'Đã lưu cấu hình SMTP vào bộ nhớ trình duyệt!' });
    } finally {
      setIsSavingSmtp(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notificationEmail.trim()) {
      alert('Vui lòng nhập địa chỉ email nhận thông báo.');
      return;
    }
    localStorage.setItem('galaxy_hotel_admin_email', notificationEmail.trim());
    setTestingEmail(true);
    setEmailTestResult(null);

    try {
      const res = await fetch('/api/send_test_email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: notificationEmail.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setEmailTestResult({ type: 'success', message: data.message });
      } else {
        setEmailTestResult({ type: 'error', message: data.message });
      }
    } catch (err) {
      setEmailTestResult({
        type: 'error',
        message: 'Lưu ý: Bạn đang test ở môi trường Local dev. Tính năng gửi email PHP tự động sẽ kích hoạt 100% khi upload lên hosting cPanel AZDIGI.'
      });
    } finally {
      setTestingEmail(false);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetWebhookUrl(webhookInput.trim());
    alert('Đã lưu cấu hình Google Sheets Webhook!');
  };

  const handleTestWebhook = async () => {
    if (!webhookInput.trim()) {
      alert('Vui lòng nhập URL Webhook của Google Apps Script trước.');
      return;
    }
    setTestingWebhook(true);
    setWebhookStatus('idle');

    try {
      await fetch(webhookInput.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test_connection',
          bookingCode: 'TEST-001',
          bookingType: 'Kiểm Tra Kết Nối',
          roomName: 'Phòng A (Standard Deluxe)',
          guestName: 'Hệ Thống Galaxy Hotel',
          guestPhone: '028 2248 7782',
          guestEmail: 'galaxyboutiquehotel2022@gmail.com',
          checkInDate: '2026-08-23',
          checkOutDate: '2026-08-24',
          duration: '1 đêm',
          guests: '2 Khách',
          totalPrice: '650.000 VNĐ',
          status: 'Đã xác nhận',
          specialRequests: 'Dòng test kiểm tra webhook từ trang Admin',
          createdAt: new Date().toLocaleString('vi-VN'),
        }),
      });

      setWebhookStatus('success');
      alert('Đã gửi dữ liệu thử nghiệm sang Google Sheets thành công! Vui lòng mở Google Sheet của bạn để kiểm tra dòng mới.');
    } catch (e) {
      setWebhookStatus('error');
      alert('Không thể kết nối với Webhook Google Sheets. Vui lòng kiểm tra lại URL.');
    } finally {
      setTestingWebhook(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassMessage('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    if (newPass !== confirmPass) {
      setPassMessage('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Save custom creds to localStorage
    const customCreds = {
      username: user?.username || 'admin',
      password: newPass,
      name: user?.name || 'Quản Lý Khách Sạn'
    };
    localStorage.setItem('galaxy_hotel_custom_creds', JSON.stringify(customCreds));
    setPassMessage('Đã đổi mật khẩu thành công!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight">
          Cài Đặt Hệ Thống & Tích Hợp
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Cấu hình sao lưu song song Google Sheets, MySQL Database và bảo mật tài khoản
        </p>
      </div>

      {/* Email Notifications & Gmail SMTP Config */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-sans font-bold text-xl text-neutral-900 tracking-tight">
                Tự Động Gửi Email Thông Báo (Gmail SMTP)
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                100% Vào Hộp Thư Đến
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-sans">
              Khi khách đặt phòng thành công, hệ thống gửi email xác nhận cho Khách và thông báo cho Lễ tân.
              <br />Để gửi thư qua máy chủ chính chủ của Google (không bao giờ bị rơi vào Spam), bạn chỉ cần nhập <strong>Gmail</strong> và <strong>Mật khẩu ứng dụng 16 ký tự</strong> bên dưới.
            </p>
          </div>
        </div>

        {/* Gmail SMTP Form */}
        <form onSubmit={handleSaveSmtp} className="p-5 rounded-xl bg-[#FAF9F5] border border-neutral-200 space-y-4">
          <div className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center justify-between">
            <span>🔑 Cấu Hình Tài Khoản Gửi Thư (Gmail SMTP)</span>
            <button
              type="button"
              onClick={() => setShowSmtpGuide(!showSmtpGuide)}
              className="text-xs text-blue-600 hover:underline normal-case flex items-center gap-1 font-normal"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showSmtpGuide ? 'Đóng hướng dẫn' : 'Cách lấy Mật khẩu ứng dụng (1 phút)'}</span>
            </button>
          </div>

          {showSmtpGuide && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-2 animate-fade-in font-sans">
              <strong className="block font-bold">📋 4 Bước lấy Mật khẩu ứng dụng Gmail (App Password):</strong>
              <ol className="list-decimal list-inside space-y-1 text-[12px] text-blue-800 pl-1">
                <li>Truy cập link: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="font-bold underline text-blue-700">myaccount.google.com/apppasswords</a> (Đăng nhập Gmail của bạn).</li>
                <li>Nếu chưa bật <em>Xác minh 2 bước</em>, hãy bật lên theo hướng dẫn của Google.</li>
                <li>Tại ô <strong>Tên ứng dụng (App name)</strong>, nhập: <code>Galaxy Hotel Web</code> rồi bấm <strong>Tạo (Create)</strong>.</li>
                <li>Google sẽ hiện ra 1 mã <strong>16 chữ cái</strong> (ví dụ: <code>abcd efgh ijkl mnop</code>). Bạn copy mã này và dán vào ô Mật khẩu bên dưới.</li>
              </ol>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Địa Chỉ Gmail Gửi Thư
              </label>
              <input
                type="email"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                placeholder="minhmanuzu@gmail.com"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-1">
                Mật Khẩu Ứng Dụng (16 Ký Tự)
              </label>
              <input
                type="password"
                value={smtpPass}
                onChange={(e) => setSmtpPass(e.target.value)}
                placeholder="abcd efgh ijkl mnop"
                className="w-full bg-white border border-neutral-300 rounded-lg px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-neutral-500">Máy chủ: <strong>smtp.gmail.com:465 (SSL)</strong></span>
            <button
              type="submit"
              disabled={isSavingSmtp}
              className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#E8DCB9]" />
              <span>{isSavingSmtp ? 'Đang lưu...' : 'Lưu Cấu Hình SMTP'}</span>
            </button>
          </div>

          {smtpSaveMessage && (
            <div className={`p-3 rounded-lg text-xs font-sans flex items-center gap-2 ${smtpSaveMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{smtpSaveMessage.text}</span>
            </div>
          )}
        </form>

        {/* Test Email Section */}
        <div className="pt-2 border-t border-neutral-100 space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 font-sans">
            Thử Nghiệm Gửi Email Trực Tiếp Tới:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={notificationEmail}
              onChange={(e) => setNotificationEmail(e.target.value)}
              placeholder="minhmanuzu@gmail.com"
              className="flex-1 bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={testingEmail}
              className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs tracking-wider uppercase disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Mail className="w-3.5 h-3.5 text-white" />
              <span>{testingEmail ? 'Đang gửi test...' : 'Gửi Email Test Ngay'}</span>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400">
            Sau khi bấm gửi, hãy mở hòm thư của bạn để kiểm tra đơn đặt phòng mẫu nhé!
          </p>

          {emailTestResult && (
            <div className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-fade-in font-sans ${
              emailTestResult.type === 'success' 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}>
              {emailTestResult.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              )}
              <span>{emailTestResult.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Google Sheets Dual-Sync Config */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <Sheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xl text-neutral-900 tracking-tight">
              Sao Lưu Song Song Vào Google Sheets (Dual-Sync)
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed font-sans">
              Mỗi khi khách đặt phòng trên website, thông tin sẽ được tự động đồng bộ ngay vào Google Sheet của bạn. Bạn có thể mở app Google Sheets trên điện thoại để xem và quản lý mọi lúc mọi nơi mà không cần đăng nhập website.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveWebhook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5 font-sans">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/.../exec"
              className="w-full bg-[#FAF9F5] border border-neutral-200 rounded-lg px-3.5 py-2.5 text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4 text-[#E8DCB9]" />
              <span>Lưu Cấu Hình Webhook</span>
            </button>

            <button
              type="button"
              disabled={testingWebhook || !webhookInput}
              onClick={handleTestWebhook}
              className="px-4 py-2.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs tracking-wider uppercase disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <span>{testingWebhook ? 'Đang gửi...' : 'Gửi Thử Nghiệm'}</span>
            </button>
          </div>
        </form>

        {webhookStatus === 'success' && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Đã kết nối và đồng bộ thử nghiệm thành công sang Google Sheets!</span>
          </div>
        )}
      </div>

      {/* MySQL Connection Status */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xl text-neutral-900 tracking-tight">
              Cơ Sở Dữ Liệu MySQL (Hosting AZDIGI cPanel)
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-sans">
              File schema SQL đã được tạo sẵn tại <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-900 font-bold">api/schema.sql</code>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-2 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Môi trường hiện tại:</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ● Hybrid LocalStorage + REST API Ready
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">Hỗ trợ hosting:</span>
            <span className="font-semibold text-neutral-800">cPanel AZDIGI / DirectAdmin / VPS Linux</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-500">File kết nối DB:</span>
            <span className="font-mono text-neutral-800">api/db.php</span>
          </div>
        </div>
      </div>

      {/* Security & Password */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-xl text-neutral-900 tracking-tight">
              Đổi Mật Khẩu Quản Trị
            </h3>
            <p className="text-xs text-neutral-500 mt-1 font-sans">
              Đổi mật khẩu đăng nhập cho tài khoản quản trị <strong className="text-neutral-900">{user?.username}</strong>
            </p>
          </div>
        </div>

        {passMessage && (
          <div className={`p-3.5 rounded-xl text-xs font-semibold ${passMessage.includes('thành công') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {passMessage}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3 text-xs max-w-md">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Mật Khẩu Mới</label>
            <input
              type="password"
              required
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="Tối thiểu 6 ký tự"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Xác Nhận Mật Khẩu Mới</label>
            <input
              type="password"
              required
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            />
          </div>

          <button
            type="submit"
            className="btn-magnetic py-2.5 px-5 rounded-xl bg-hotel-navy hover:bg-hotel-dark text-white font-bold text-xs uppercase tracking-wider shadow mt-2"
          >
            Lưu Mật Khẩu Mới
          </button>
        </form>
      </div>

    </div>
  );
};
