import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Plus, Image as ImageIcon, CheckCircle, Heart, Eye, Loader2, Sparkles } from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

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
    } catch (e) {}
    return defaultPhotos;
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'checkin' | 'facilities'>('checkin');
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fallbackBase64, setFallbackBase64] = useState<string>('');
  const [sizeInfo, setSizeInfo] = useState<{ orig: number; comp: number } | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch photos from server on mount
  useEffect(() => {
    fetch('/api/gallery.php')
      .then(res => res.json())
      .then(res => {
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          setPhotos(res.data);
          try {
            localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(res.data));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  const savePhotos = async (updated: GalleryPhoto[]) => {
    setPhotos(updated);
    try {
      localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(updated));
    } catch (e) {
      console.warn('localStorage storage full, using backend database', e);
    }
    try {
      await fetch('/api/gallery.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_all', photos: updated })
      });
    } catch (e) {}
  };

  const processFile = async (file: File) => {
    if (!file) return;
    setIsCompressing(true);
    try {
      // Compress file client-side to ~200KB-300KB
      const result = await compressImage(file, 1600, 1600, 0.82);
      setSelectedFile(result.compressedFile);
      setFallbackBase64(result.base64);
      setPreviewUrl(result.base64 || URL.createObjectURL(result.compressedFile));
      setSizeInfo({
        orig: result.originalSizeKb,
        comp: result.compressedSizeKb
      });
    } catch (err) {
      console.error('Compression error, using raw file', err);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } finally {
      setIsCompressing(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleUploadNewPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !selectedFile) {
      alert('Vui lòng chọn hình ảnh từ thiết bị');
      return;
    }

    setIsUploading(true);
    let finalUrl = '';

    // 1. Upload to persistent server directory (/uploads/)
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
        } else if (fallbackBase64) {
          finalUrl = fallbackBase64;
        }
      } catch (err) {
        console.warn('Upload API endpoint unreachable, using direct optimized base64', err);
        finalUrl = fallbackBase64 || previewUrl;
      }
    } else {
      finalUrl = fallbackBase64 || previewUrl;
    }

    const newPhoto: GalleryPhoto = {
      id: 'gal-' + Date.now(),
      url: finalUrl,
      title: newTitle.trim() || (newCategory === 'checkin' ? 'Khoảnh khắc khách hàng check-in' : 'Không gian khách sạn'),
      category: newCategory,
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [newPhoto, ...photos];
    await savePhotos(updated);

    setSelectedFile(null);
    setPreviewUrl('');
    setFallbackBase64('');
    setSizeInfo(null);
    setNewTitle('');
    setIsUploading(false);
    setSuccessMsg('Đã lưu ảnh mới vào "Góc nhỏ yêu thương" và hiển thị lên website thành công!');
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi Góc nhỏ yêu thương?')) {
      const updated = photos.filter(p => p.id !== id);
      setPhotos(updated);
      try {
        localStorage.setItem('galaxy_hotel_gallery_photos', JSON.stringify(updated));
      } catch (e) {}
      try {
        await fetch(`/api/gallery.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
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
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[170px] ${
                isDragging 
                  ? 'border-neutral-900 bg-amber-50/60 scale-[1.01]' 
                  : 'border-neutral-300 hover:border-neutral-900 bg-neutral-50 hover:bg-white'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              
              {isCompressing ? (
                <div className="space-y-2 py-4 flex flex-col items-center">
                  <Loader2 className="w-8 h-8 text-[#8A6943] animate-spin" />
                  <p className="text-xs font-bold text-neutral-800">Đang tối ưu hóa hình ảnh...</p>
                  <p className="text-[10px] text-neutral-400">Nén ảnh chuẩn HD để tải lên siêu nhanh</p>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full h-36 rounded-xl overflow-hidden shadow-sm group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                    Nhấp để đổi ảnh khác
                  </div>
                  {sizeInfo && (
                    <span className="absolute bottom-1.5 left-1.5 bg-neutral-900/80 backdrop-blur-sm text-[#E8DCB9] text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{sizeInfo.orig}KB ➔ {sizeInfo.comp}KB</span>
                    </span>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    Đã sẵn sàng
                  </span>
                </div>
              ) : (
                <div className="space-y-2 pointer-events-none py-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center mx-auto text-neutral-600">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-neutral-800">Nhấp hoặc Kéo thả ảnh vào đây</p>
                  <p className="text-[10px] text-neutral-400">JPG, PNG, WEBP, HEIC (Tự động nén HD)</p>
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
              disabled={isUploading || isCompressing || (!selectedFile && !previewUrl)}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang tải và lưu ảnh...</span>
                </>
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
