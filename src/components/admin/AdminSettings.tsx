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
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="font-serif font-bold text-2xl text-hotel-navy">
          Cài Đặt Hệ Thống & Tích Hợp
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Cấu hình sao lưu song song Google Sheets, MySQL Database và bảo mật tài khoản
        </p>
      </div>

      {/* Google Sheets Dual-Sync Config */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
            <Sheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-hotel-navy">
              Sao Lưu Song Song Vào Google Sheets (Dual-Sync)
            </h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Mỗi khi khách đặt phòng trên website, thông tin sẽ được tự động đồng bộ ngay vào Google Sheet của bạn. Bạn có thể mở app Google Sheets trên điện thoại để xem và quản lý mọi lúc mọi nơi mà không cần đăng nhập website.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveWebhook} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Google Apps Script Web App URL
            </label>
            <input
              type="url"
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-hotel-gold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="btn-magnetic px-5 py-2.5 rounded-xl bg-hotel-navy hover:bg-hotel-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-hotel-gold" />
              <span>Lưu Cấu Hình Webhook</span>
            </button>

            <button
              type="button"
              onClick={handleTestWebhook}
              disabled={testingWebhook}
              className="btn-magnetic px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2"
            >
              {testingWebhook ? 'Đang gửi...' : 'Gửi Dữ Liệu Test Thử'}
            </button>
          </div>
        </form>

        {/* Setup guide collapsible box */}
        <div className="p-5 rounded-2xl bg-hotel-sand/50 border border-hotel-gold/30 text-xs text-gray-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-hotel-navy">
            <HelpCircle className="w-4 h-4 text-hotel-goldDark" />
            <span>Hướng dẫn tạo Webhook Google Sheets trong 2 phút:</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-[11px] text-gray-600 pl-1">
            <li>Mở một Google Sheet mới tại <strong>sheets.new</strong> và đặt tên sheet là "Galaxy Hotel Bookings".</li>
            <li>Vào mục <strong>Tiện ích mở rộng (Extensions) → Apps Script</strong>.</li>
            <li>Mở file <code className="bg-white px-1 py-0.5 rounded border">api/google_apps_script_template.js</code> trong dự án này, copy toàn bộ code và dán vào Apps Script.</li>
            <li>Bấm <strong>Triển khai (Deploy) → Tùy chọn triển khai mới → Ứng dụng web (Web App)</strong> (Quyền truy cập: Bất kỳ ai / Anyone).</li>
            <li>Copy URL ứng dụng web nhận được và dán vào ô bên trên.</li>
          </ol>
        </div>
      </div>

      {/* MySQL & Hosting Information (AZDIGI cPanel) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-hotel-navy">
              Cơ Sở Dữ Liệu MySQL (Hosting AZDIGI cPanel)
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              File schema SQL đã được tạo sẵn tại <code className="bg-gray-100 px-1.5 py-0.5 rounded text-hotel-navy font-bold">api/schema.sql</code>.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Môi trường hiện tại:</span>
            <span className="font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
              ● Hybrid LocalStorage + REST API Ready
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Hỗ trợ hosting:</span>
            <span className="font-semibold text-gray-800">cPanel AZDIGI / DirectAdmin / VPS Linux</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">File kết nối DB:</span>
            <span className="font-mono text-gray-800">api/db.php</span>
          </div>
        </div>
      </div>

      {/* Security & Password */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xl text-hotel-navy">
              Đổi Mật Khẩu Quản Trị
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Đổi mật khẩu đăng nhập cho tài khoản quản trị <strong className="text-hotel-navy">{user?.username}</strong>
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
