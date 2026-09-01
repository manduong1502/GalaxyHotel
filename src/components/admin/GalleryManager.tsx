import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, Image as ImageIcon, CheckCircle, Heart, Eye } from 'lucide-react';

interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  category: 'checkin' | 'facilities';
  date?: string;
}

const defaultPhotos: GalleryPhoto[] = [
  { id: '1', url: '/images/checkin-1.jpg', title: 'Check-in nụ cười du khách tại sảnh', category: 'checkin', date: '2026-08-30' },
  { id: '2', url: '/images/welcome-1.jpg', title: 'Phòng Hạng Sang Máy Chiếu ấm cúng', category: 'checkin', date: '2026-08-28' },
  { id: '3', url: '/images/hero-1.jpg', title: 'Sảnh đón tiếp & Quầy thông tin Tour', category: 'facilities', date: '2026-08-25' },
  { id: '4', url: '/images/facility-1.jpg', title: 'Khu vực tiếp khách & thư giãn', category: 'facilities', date: '2026-08-20' },
  { id: '5', url: '/images/welcome-2.jpg', title: 'Góc phòng xinh xắn đón nắng sáng', category: 'checkin', date: '2026-08-15' },
  { id: '6', url: '/images/hero-2.jpg', title: 'Không gian ấm cúng Galaxy Boutique', category: 'facilities', date: '2026-08-10' },
];

export const GalleryManager: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('galaxy_hotel_gallery_photos');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return defaultPhotos;
  });

  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'checkin' | 'facilities'>('checkin');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch photos from server on mount
  useEffect(() => {
    fetch('/api/gallery.php')
      .then(res => res.json())
      .then(res => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPhotos(res.data);
          localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(res.data));
        }
      })
      .catch(() => {});
  }, []);

  const savePhotos = async (updated: GalleryPhoto[]) => {
    setPhotos(updated);
    localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(updated));
    try {
      await fetch('/api/gallery.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_all', photos: updated })
      });
    } catch (e) {}
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleUploadNewPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !selectedFile) {
      alert('Vui lòng chọn file hình ảnh từ thiết bị');
      return;
    }

    setIsUploading(true);
    let finalUrl = '';

    // Upload to server if real file
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        const res = await fetch('/api/upload_image.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data && data.success && data.url) {
          finalUrl = data.url;
        } else {
          // Fallback to base64 upload
          const base64 = await fileToBase64(selectedFile);
          const b64Res = await fetch('/api/upload_image.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ base64 })
          });
          const b64Data = await b64Res.json();
          if (b64Data && b64Data.success && b64Data.url) {
            finalUrl = b64Data.url;
          } else {
            finalUrl = base64; // Direct base64 image string as persistent fallback
          }
        }
      } catch (err) {
        try {
          const base64 = await fileToBase64(selectedFile);
          finalUrl = base64;
        } catch (e) {
          alert('Không thể tải ảnh lên máy chủ. Vui lòng kiểm tra dung lượng ảnh.');
          setIsUploading(false);
          return;
        }
      }
    } else {
      finalUrl = previewUrl;
    }

    const newPhoto: GalleryPhoto = {
      id: Date.now().toString(),
      url: finalUrl,
      title: newTitle || (newCategory === 'checkin' ? 'Khoảnh khắc khách hàng check-in' : 'Không gian khách sạn'),
      category: newCategory,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newPhoto, ...photos];
    await savePhotos(updated);

    setSelectedFile(null);
    setPreviewUrl('');
    setNewTitle('');
    setIsUploading(false);
    setSuccessMsg('Đã đăng ảnh check-in mới lên "Góc nhỏ yêu thương" thành công và đồng bộ cho tất cả khách!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi Góc nhỏ yêu thương?')) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(updated));
      try {
        await fetch(`/api/gallery.php?id=${id}`, { method: 'DELETE' });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-xl font-bold text-neutral-900">Quản Lý "Góc Nhỏ Yêu Thương"</h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Đăng ảnh khách chụp check-in thực tế và hình ảnh không gian khách sạn trực tiếp lên website
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-neutral-100 border border-neutral-200 text-xs font-bold text-neutral-700">
          Tổng số ảnh: <span className="text-neutral-950 font-extrabold">{photos.length}</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload New Photo Form */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#8A6943]" />
          <span>Đăng Ảnh Check-in / Không Gian Mới</span>
        </h3>

        <form onSubmit={handleUploadNewPhoto} className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* File Picker / Drag Drop */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold text-neutral-700 mb-2">
              Chọn hình ảnh từ thiết bị *
            </label>
            <div className="relative border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-2xl p-4 flex flex-col items-center justify-center text-center bg-neutral-50 hover:bg-white transition-colors cursor-pointer min-h-[160px]">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {previewUrl ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden shadow-sm">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    Thay ảnh khác
                  </span>
                </div>
              ) : (
                <div className="space-y-2 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">Nhấp để tải ảnh lên</p>
                  <p className="text-[10px] text-neutral-400">JPG, PNG, WEBP (Tối đa 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Form details */}
          <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Tiêu đề / Lời tựa cho bức ảnh
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="VD: Gia đình anh Tuấn check-in vui vẻ tại sảnh..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Phân loại hiển thị
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNewCategory('checkin')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    newCategory === 'checkin'
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  📸 Ảnh khách check-in
                </button>
                <button
                  type="button"
                  onClick={() => setNewCategory('facilities')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    newCategory === 'facilities'
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  🏨 Không gian chung
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading || (!selectedFile && !previewUrl)}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
            >
              {isUploading ? (
                <span>Đang tải lên...</span>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#E8DCB9]" />
                  <span>Đăng ảnh lên Website ngay</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>

      {/* Photos Grid List */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">
          Danh Sách Ảnh Đang Hiển Thị Trên Website ({photos.length})
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 shadow-sm flex flex-col justify-between"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-200">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded shadow text-white ${
                  photo.category === 'checkin' ? 'bg-rose-600' : 'bg-neutral-800'
                }`}>
                  {photo.category === 'checkin' ? 'Check-in' : 'Không gian'}
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <p className="text-xs font-semibold text-neutral-800 line-clamp-1 flex-1 pr-2">
                  {photo.title}
                </p>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
