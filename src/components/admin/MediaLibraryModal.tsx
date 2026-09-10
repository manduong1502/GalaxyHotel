import React, { useState, useEffect } from 'react';
import { 
  X, FolderOpen, Search, RefreshCw, Check, Image as ImageIcon, 
  Upload, HardDrive, Calendar, FileText, CheckCircle2, Eye, Sparkles, Loader2 
} from 'lucide-react';
import { compressImage } from '../../utils/imageCompressor';

export interface UploadedMediaItem {
  filename: string;
  url: string;
  size?: number;
  sizeFormatted?: string;
  updatedAt?: string;
  timestamp?: number;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  mode?: 'single' | 'multiple';
  title?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  mode = 'single',
  title = 'Thư Viện Ảnh Đã Tải Lên (/uploads/)'
}) => {
  const [items, setItems] = useState<UploadedMediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [isUploadingNew, setIsUploadingNew] = useState(false);

  const fetchUploadedImages = async () => {
    setIsLoading(true);
    try {
      // 1. Try list_uploads.php
      const res = await fetch('/api/list_uploads.php');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setItems(data.data);
        return;
      }
      
      // 2. Try upload_image.php GET
      const res2 = await fetch('/api/upload_image.php');
      const data2 = await res2.json();
      if (data2 && data2.success && Array.isArray(data2.data)) {
        setItems(data2.data);
        return;
      }
    } catch (e) {
      console.warn('Could not fetch server upload list, using fallback scan', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrls([]);
      setActivePreview(null);
      setSearchTerm('');
      fetchUploadedImages();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = items.filter(item => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return item.filename.toLowerCase().includes(term) || (item.updatedAt && item.updatedAt.includes(term));
  });

  const handleToggleSelect = (url: string) => {
    setActivePreview(url);
    if (mode === 'single') {
      setSelectedUrls([url]);
    } else {
      setSelectedUrls(prev => 
        prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
      );
    }
  };

  const handleConfirm = () => {
    if (selectedUrls.length === 0) {
      alert('Vui lòng chọn ít nhất 1 hình ảnh');
      return;
    }
    onSelect(selectedUrls);
    onClose();
  };

  const handleUploadFromModal = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;

    setIsUploadingNew(true);
    for (const file of files) {
      try {
        const compressed = await compressImage(file, 1600, 1600, 0.82);
        const formData = new FormData();
        formData.append('image', compressed.compressedFile);
        const res = await fetch('/api/upload_image.php', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data && data.success && data.url) {
          if (mode === 'single') {
            setSelectedUrls([data.url]);
          } else {
            setSelectedUrls(prev => [...prev, data.url]);
          }
        }
      } catch (err) {
        console.error('Upload error in modal', err);
      }
    }
    setIsUploadingNew(false);
    await fetchUploadedImages();
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in font-sans">
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden animate-scale-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                <span>{title}</span>
                <span className="text-xs font-normal text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {items.length} ảnh trong kho
                </span>
              </h3>
              <p className="text-xs text-neutral-300">
                {mode === 'single' ? 'Nhấp chọn 1 ảnh để sử dụng' : 'Có thể chọn nhiều ảnh cùng lúc'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Upload new, Refresh */}
        <div className="p-4 sm:px-6 bg-neutral-50/80 border-b border-neutral-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên file (VD: img_2026, checkin, phong...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-white border border-neutral-200 focus:outline-none focus:border-amber-600 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            {mode === 'multiple' && filteredItems.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (selectedUrls.length === filteredItems.length) {
                    setSelectedUrls([]);
                  } else {
                    setSelectedUrls(filteredItems.map(item => item.url));
                  }
                }}
                className="px-3 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold border border-neutral-200 shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>{selectedUrls.length === filteredItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}</span>
              </button>
            )}

            <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95">
              <Upload className="w-3.5 h-3.5 text-amber-300" />
              <span>{isUploadingNew ? 'Đang tải lên...' : 'Tải thêm ảnh mới'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={isUploadingNew}
                onChange={handleUploadFromModal}
                className="hidden"
              />
            </label>

            <button
              onClick={fetchUploadedImages}
              disabled={isLoading}
              title="Làm mới danh sách"
              className="p-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200 transition-colors shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Body Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-100/50">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-neutral-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
              <p className="text-xs font-medium">Đang quét thư mục /uploads/ trên máy chủ...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl border border-dashed border-neutral-300">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <ImageIcon className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-sm text-neutral-800">Chưa có ảnh nào phù hợp</h4>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm">
                {searchTerm ? 'Không tìm thấy file khớp với từ khóa tìm kiếm.' : 'Thư mục uploads trên hosting hiện đang trống.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {filteredItems.map((item, idx) => {
                const isSelected = selectedUrls.includes(item.url);
                return (
                  <div
                    key={item.url + idx}
                    onClick={() => handleToggleSelect(item.url)}
                    className={`group relative rounded-2xl overflow-hidden bg-white border-2 cursor-pointer transition-all duration-200 flex flex-col shadow-sm ${
                      isSelected 
                        ? 'border-amber-500 ring-4 ring-amber-400/30 shadow-md scale-[1.02]' 
                        : 'border-neutral-200 hover:border-neutral-400 hover:shadow'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.filename}
                        onError={e => { e.currentTarget.src = '/images/rooms/phong-a.jpg'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      {/* Selected Badge */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow-lg font-bold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}

                      {/* Size Badge */}
                      {item.sizeFormatted && (
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-white/90">
                          {item.sizeFormatted}
                        </span>
                      )}
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2.5 bg-white flex flex-col justify-between flex-1">
                      <p className="text-[11px] font-bold text-neutral-800 truncate" title={item.filename}>
                        {item.filename}
                      </p>
                      {item.updatedAt && (
                        <p className="text-[10px] text-neutral-400 mt-0.5 flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>{item.updatedAt.split(' ')[0]}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-600 flex items-center gap-2">
            {selectedUrls.length > 0 ? (
              <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Đã chọn {selectedUrls.length} ảnh
              </span>
            ) : (
              <span>Chưa chọn ảnh nào</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-colors"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selectedUrls.length === 0}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{mode === 'single' ? 'Sử dụng ảnh này' : `Chọn (${selectedUrls.length}) ảnh đã đánh dấu`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
