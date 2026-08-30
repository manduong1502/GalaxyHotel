import React, { useState } from 'react';
import { Compass, Sparkles, Check, MapPin, Shirt, CheckCircle, Save } from 'lucide-react';

interface ServiceBox {
  id: string;
  tag: string;
  title: string;
  desc: string;
  items: string[];
}

const defaultBoxes: ServiceBox[] = [
  {
    id: 'box-1',
    tag: 'TOUR TRẢI NGHIỆM',
    title: 'Tour Trải Nghiệm & Khám Phá',
    desc: 'Hỗ trợ đặt tour chất lượng cao khám phá vẻ đẹp Nam Bộ và lịch sử Sài Gòn hào hùng.',
    items: [
      'Hành Trình Miền Tây (Mekong delta)',
      'Khám phá Địa đạo Củ Chi (Cu Chi Tunnels)',
      'Một vòng Sài Gòn (City Tour)'
    ]
  },
  {
    id: 'box-2',
    tag: 'GIẶT ỦI LẤY NHANH',
    title: 'Dịch Vụ Giặt Sấy',
    desc: 'Dịch vụ giặt sấy thơm tho sạch sẽ trong ngày, giao nhận tận phòng nhanh chóng và chu đáo.',
    items: [
      'Giặt sấy khô thơm tho lấy ngay trong ngày',
      'Ủi và chăm sóc trang phục theo yêu cầu',
      'Giá cả bình dân, hỗ trợ giao nhận tại phòng'
    ]
  },
  {
    id: 'box-3',
    tag: 'TRUNG TÂM QUẬN 1',
    title: 'Vị Trí Vàng Trung Tâm Sài Gòn',
    desc: 'Nằm trong hẻm 269 Đề Thám yên tĩnh nhưng chỉ cách phố đi bộ Bùi Viện và chợ Bến Thành vài bước chân.',
    items: [
      'Đi bộ 2 phút ra Phố Tây Bùi Viện',
      'Đi bộ 5 phút đến Chợ Bến Thành & Công viên 23/9',
      'Gần Dinh Độc Lập, Nhà thờ Đức Bà & Bến Bạch Đằng'
    ]
  }
];

export const ServicesManager: React.FC = () => {
  const [boxes, setBoxes] = useState<ServiceBox[]>(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_services_boxes');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return defaultBoxes;
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdateBox = (index: number, field: keyof ServiceBox, value: any) => {
    const updated = [...boxes];
    updated[index] = { ...updated[index], [field]: value };
    setBoxes(updated);
  };

  const handleUpdateItem = (boxIndex: number, itemIndex: number, value: string) => {
    const updated = [...boxes];
    const newItems = [...updated[boxIndex].items];
    newItems[itemIndex] = value;
    updated[boxIndex] = { ...updated[boxIndex], items: newItems };
    setBoxes(updated);
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('galaxy_hotel_services_boxes', JSON.stringify(boxes));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
    alert('Đã lưu nội dung Dịch vụ & Tour trải nghiệm thành công!');
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <h2 className="font-sans font-bold text-2xl text-neutral-900 tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#8A6943]" />
            <span>Quản Lý Dịch Vụ & Tour Trải Nghiệm</span>
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Chỉnh sửa 3 ô dịch vụ: Tour trải nghiệm (Mekong, Củ Chi, City Tour), Dịch vụ giặt sấy và Vị trí trung tâm
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-2 shadow transition-all active:scale-95"
        >
          <Save className="w-4 h-4 text-[#E8DCB9]" />
          <span>Lưu Toàn Bộ Thay Đổi</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Đã lưu nội dung các ô dịch vụ lên website thành công!</span>
        </div>
      )}

      {/* 3 Boxes Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {boxes.map((box, boxIdx) => (
          <div key={box.id} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <span className="text-xs font-extrabold uppercase text-[#8A6943]">
                  Ô {boxIdx + 1}: {box.tag}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Thẻ Nhãn (Tag)</label>
                <input
                  type="text"
                  value={box.tag}
                  onChange={(e) => handleUpdateBox(boxIdx, 'tag', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Tiêu Đề Dịch Vụ</label>
                <input
                  type="text"
                  value={box.title}
                  onChange={(e) => handleUpdateBox(boxIdx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">Mô Tả</label>
                <textarea
                  rows={2}
                  value={box.desc}
                  onChange={(e) => handleUpdateBox(boxIdx, 'desc', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs leading-relaxed text-neutral-700"
                />
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                  3 Điểm Nổi Bật (Bullets):
                </label>
                {box.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-400">#{itemIdx + 1}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleUpdateItem(boxIdx, itemIdx, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-medium text-neutral-800"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveAll}
              className="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Cập Nhật Ô Này</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
