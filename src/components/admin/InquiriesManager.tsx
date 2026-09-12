import React, { useState } from 'react';
import { useBookings } from '../../context/BookingContext';
import { Inquiry } from '../../types';
import { 
  Inbox, Search, Filter, Phone, MessageSquare, Calendar, 
  User, Mail, CheckCircle2, Clock, XCircle, Trash2, Edit3, 
  ExternalLink, Sparkles, RefreshCw, AlertCircle 
} from 'lucide-react';

export const InquiriesManager: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry, refreshInquiries } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshInquiries();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch = 
      item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      (item.email && item.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.roomType && item.roomType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.message && item.message.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && item.status === filterStatus;
  });

  const countNew = inquiries.filter(i => i.status === 'new').length;
  const countContacted = inquiries.filter(i => i.status === 'contacted').length;
  const countResolved = inquiries.filter(i => i.status === 'resolved').length;
  const countCancelled = inquiries.filter(i => i.status === 'cancelled').length;

  const handleStartEditNotes = (inq: Inquiry) => {
    setEditingNotesId(inq.id);
    setTempNotes(inq.notes || '');
  };

  const handleSaveNotes = (id: string, currentStatus: Inquiry['status']) => {
    updateInquiryStatus(id, currentStatus, tempNotes);
    setEditingNotesId(null);
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Mới nhận (Cần gọi)
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Phone className="w-3.5 h-3.5 text-blue-600" />
            Đã gọi / Đang tư vấn
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Đã giải quyết / Đã đặt phòng
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <XCircle className="w-3.5 h-3.5 text-neutral-400" />
            Đã hủy / Không liên lạc được
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#8A6943] uppercase tracking-wider mb-1">
            <Inbox className="w-4 h-4" />
            <span>Chăm Sóc Khách Hàng & Tư Vấn</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight font-serif">
            Hộp Thư Yêu Cầu & Tư Vấn
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Tiếp nhận tất cả form "Gửi Yêu Cầu / Tư Vấn Đặt Phòng" từ khách hàng trên website và tự động thông báo qua email.
          </p>
        </div>

        {/* Quick Stats & Refresh Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Đồng bộ dữ liệu mới nhất từ server"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E8DCB9] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Đang tải...' : 'Làm Mới'}</span>
          </button>

          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/60 text-center">
            <div className="text-lg font-black text-amber-700">{countNew}</div>
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Mới Nhận</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-blue-50 border border-blue-200/60 text-center">
            <div className="text-lg font-black text-blue-700">{countContacted}</div>
            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Đã Gọi</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200/60 text-center">
            <div className="text-lg font-black text-emerald-700">{countResolved}</div>
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Hoàn Tất</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-center">
            <div className="text-lg font-black text-neutral-700">{inquiries.length}</div>
            <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Tổng Số</div>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, email, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:bg-white focus:outline-none focus:border-[#C29A64]"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Tất Cả ({inquiries.length})
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'new'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Mới Nhận ({countNew})
          </button>
          <button
            onClick={() => setFilterStatus('contacted')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'contacted'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            Đã Gọi ({countContacted})
          </button>
          <button
            onClick={() => setFilterStatus('resolved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'resolved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Đã Xử Lý ({countResolved})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'cancelled'
                ? 'bg-neutral-600 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
          >
            Đã Hủy ({countCancelled})
          </button>
        </div>
      </div>

      {/* List / Cards */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-neutral-200 shadow-sm">
          <div className="w-14 h-14 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <Inbox className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-800">Không có yêu cầu nào phù hợp</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Khi khách hàng gửi form liên hệ hoặc tư vấn đặt phòng từ website, thông tin sẽ lập tức xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredInquiries.map((inq) => {
            const isNew = inq.status === 'new';
            const cleanPhone = inq.phone.replace(/[^0-9]/g, '');

            return (
              <div
                key={inq.id}
                className={`bg-white rounded-2xl p-5 border transition-all shadow-sm hover:shadow-md ${
                  isNew ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-neutral-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Customer & Request Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      {getStatusBadge(inq.status)}
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleString('vi-VN') : 'Vừa gửi'}
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">
                        #{inq.id}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/70">
                      {/* Customer Info */}
                      <div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <User className="w-3 h-3" />
                          <span>Khách hàng</span>
                        </div>
                        <div className="text-sm font-bold text-neutral-900">{inq.fullName}</div>
                        <div className="text-xs text-neutral-600 flex items-center gap-1 mt-0.5 font-medium">
                          <Phone className="w-3 h-3 text-neutral-400" />
                          <a href={`tel:${cleanPhone}`} className="text-blue-600 hover:underline font-bold">
                            {inq.phone}
                          </a>
                        </div>
                        {inq.email && (
                          <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5 truncate">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            <a href={`mailto:${inq.email}`} className="hover:underline">
                              {inq.email}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Room & Stay Preference */}
                      <div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Sparkles className="w-3 h-3 text-[#C29A64]" />
                          <span>Hạng phòng quan tâm</span>
                        </div>
                        <div className="text-sm font-bold text-amber-900">
                          {inq.roomType || 'Tư vấn hạng phòng phù hợp'}
                        </div>
                        <div className="text-xs text-neutral-600 mt-0.5">
                          Số lượng khách: <strong>{inq.guestsCount || 1} người</strong>
                        </div>
                      </div>

                      {/* Check-in / Check-out Dates */}
                      <div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>Thời gian dự kiến</span>
                        </div>
                        {inq.checkInDate ? (
                          <div className="text-xs font-semibold text-neutral-800">
                            {inq.checkInDate} ➔ {inq.checkOutDate || '1 ngày'}
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-400 italic">Chưa xác định ngày cụ thể</div>
                        )}
                      </div>
                    </div>

                    {/* Customer Message */}
                    <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#EAE6DF]">
                      <div className="text-[10px] font-bold text-[#8A6943] uppercase tracking-wider mb-1">
                        💬 Lời Nhắn / Nội Dung Yêu Cầu:
                      </div>
                      <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line font-normal">
                        {inq.message || 'Không có lời nhắn kèm theo.'}
                      </p>
                    </div>

                    {/* Staff Notes */}
                    {editingNotesId === inq.id ? (
                      <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/80 space-y-2">
                        <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                          <Edit3 className="w-3 h-3" />
                          <span>Ghi chú nội bộ lễ tân</span>
                        </div>
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Nhập ghi chú (VD: Khách hẹn gọi lại lúc 18h, cần phòng tầng cao...)"
                          rows={2}
                          className="w-full p-2 text-xs border border-amber-200 rounded-lg bg-white focus:outline-none focus:border-amber-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2.5 py-1 text-xs font-medium text-neutral-500 hover:bg-neutral-100 rounded"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleSaveNotes(inq.id, inq.status)}
                            className="px-3 py-1 text-xs font-bold bg-amber-600 text-white rounded hover:bg-amber-700 shadow-sm"
                          >
                            Lưu Ghi Chú
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200/60">
                        <div className="flex items-center gap-2 truncate text-neutral-600">
                          <strong className="text-neutral-700 shrink-0">Ghi chú lễ tân:</strong>
                          <span className="italic truncate">{inq.notes || 'Chưa có ghi chú'}</span>
                        </div>
                        <button
                          onClick={() => handleStartEditNotes(inq)}
                          className="text-[11px] font-bold text-[#8A6943] hover:underline shrink-0 ml-2"
                        >
                          {inq.notes ? 'Sửa' : '+ Thêm ghi chú'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Quick Call / Zalo & Status Dropdown */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-neutral-100">
                    {/* Quick Call & Zalo Buttons */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 active:scale-95 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi Điện</span>
                      </a>

                      <a
                        href={`https://zalo.me/${cleanPhone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-blue-700 active:scale-95 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Nhắn Zalo</span>
                      </a>
                    </div>

                    {/* Status Select */}
                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as Inquiry['status'])}
                        className="text-xs font-bold bg-neutral-100 border border-neutral-300 rounded-xl px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                      >
                        <option value="new">🟡 Mới nhận</option>
                        <option value="contacted">🔵 Đã gọi / Tư vấn</option>
                        <option value="resolved">🟢 Đã đặt / Giải quyết</option>
                        <option value="cancelled">⚪ Đã hủy / Không liên lạc</option>
                      </select>

                      <button
                        onClick={() => {
                          if (window.confirm(`Bạn có chắc chắn muốn xóa yêu cầu từ khách hàng ${inq.fullName}?`)) {
                            deleteInquiry(inq.id);
                          }
                        }}
                        title="Xóa yêu cầu này"
                        className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
