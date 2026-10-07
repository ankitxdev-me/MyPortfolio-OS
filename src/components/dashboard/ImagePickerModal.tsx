import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import type { MediaFileDTO } from '@/lib/types/api.types';
import { Button } from '@/components/ui/Button';
import { Search, Upload, Check, X, Loader2, Image as ImageIcon, FileText } from 'lucide-react';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, asset?: MediaFileDTO) => void;
  title?: string;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  title = 'Select Media Asset',
}) => {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaFiles, setMediaFiles] = useState<MediaFileDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<MediaFileDTO | null>(null);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    if (!isOpen) return;
    setLoading(true);
    try {
      const res = await apiClient.media.getFiles({ search: search || undefined });
      if (res && res.data) {
        setMediaFiles(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch media assets' });
    } finally {
      setLoading(false);
    }
  }, [isOpen, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);
    try {
      const res = await apiClient.media.upload(file, 'portfolio');
      if (res && res.data) {
        setNotification({ type: 'success', message: 'Asset uploaded successfully!' });
        onSelectImage(res.data.url, res.data);
        onClose();
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedAsset) {
      onSelectImage(selectedAsset.url, selectedAsset);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-xl max-w-3xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">Choose an asset from Media Library or upload a new image.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-border/60">
          <button
            onClick={() => setActiveTab('library')}
            className={`pb-3 text-xs font-mono font-semibold transition-colors border-b-2 ${
              activeTab === 'library' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Media Library
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-3 text-xs font-mono font-semibold transition-colors border-b-2 ${
              activeTab === 'upload' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Upload New File
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {notification && (
            <div className={`p-3 rounded-lg text-xs flex items-center justify-between ${
              notification.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              <span>{notification.message}</span>
              <button onClick={() => setNotification(null)} className="text-xs font-bold">✕</button>
            </div>
          )}

          {activeTab === 'library' ? (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search media files by filename..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-border text-foreground text-xs focus:border-primary focus:outline-none"
                />
              </div>

              {/* Grid of Assets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                {loading && mediaFiles.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground font-mono">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading Media Library...
                  </div>
                ) : mediaFiles.length === 0 ? (
                  <div className="col-span-full py-12 text-center text-muted-foreground font-mono">
                    No media files found. Upload a new image to get started.
                  </div>
                ) : (
                  mediaFiles.map((asset) => {
                    const isSelected = selectedAsset?.id === asset.id;
                    const isImage = (asset.mimeType || '').startsWith('image/') || (asset as any).type === 'Image';

                    return (
                      <div
                        key={asset.id}
                        onClick={() => setSelectedAsset(asset)}
                        className={`rounded-lg overflow-hidden border cursor-pointer relative group transition-all ${
                          isSelected ? 'border-primary ring-2 ring-primary/40' : 'border-border/80 hover:border-primary/50'
                        }`}
                      >
                        <div className="h-24 w-full bg-surface overflow-hidden relative">
                          {isImage ? (
                            <img src={asset.url} alt={asset.filename} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                              <FileText className="w-6 h-6 text-primary" />
                            </div>
                          )}
                        </div>

                        <div className="p-2 bg-surface border-t border-border/60">
                          <p className="text-[10px] font-bold text-foreground truncate" title={asset.filename}>
                            {asset.filename || 'Untitled'}
                          </p>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2 right-2 p-1 rounded-full bg-primary text-primary-foreground shadow">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Upload Tab */
            <div className="py-8 text-center space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*,application/pdf"
                className="hidden"
              />

              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-foreground text-sm">Upload New Asset</h4>
                <p className="text-xs text-muted-foreground">Select an image file (PNG, JPG, WebP) up to 10MB.</p>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {uploading ? 'Uploading to Cloudinary...' : 'Choose File from Computer'}
              </Button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-surface/40">
          <span className="text-xs font-mono text-muted-foreground">
            {selectedAsset ? `Selected: ${selectedAsset.filename}` : 'No asset selected'}
          </span>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmSelection}
              disabled={!selectedAsset || activeTab === 'upload'}
            >
              Use Selected Asset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
