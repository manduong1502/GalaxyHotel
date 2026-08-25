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
