import React, { useEffect, useState, useCallback, useRef } from 'react';
import { apiClient } from '@/lib/api';
import type { MediaFileDTO } from '@/lib/types/api.types';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { StorageWidget } from '@/components/dashboard/StorageWidget';
import { Upload, Search, Trash2, Copy, FileText, Loader2, RefreshCw, RefreshCcw } from 'lucide-react';

export const MediaDashboard: React.FC = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFileDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Images' | 'Docs'>('All');
  const [uploading, setUploading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.media.getFiles({
        search: search || undefined,
      });

      if (res && res.data) {
        setMediaFiles(res.data);
      }
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to fetch media assets' });
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification(null);
    try {
      await apiClient.media.upload(file, 'portfolio');
      setNotification({ type: 'success', message: 'Asset uploaded successfully' });
      await fetchMedia();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to upload asset' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileReplace = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !replaceTargetId) return;

    setActionLoadingId(replaceTargetId);
    setNotification(null);
    try {
      await apiClient.media.replace(replaceTargetId, file);
      setNotification({ type: 'success', message: 'Asset replaced successfully' });
      await fetchMedia();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to replace asset' });
    } finally {
      setActionLoadingId(null);
      setReplaceTargetId(null);
      if (replaceInputRef.current) replaceInputRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file?')) return;

    setActionLoadingId(id);
    try {
      await apiClient.media.delete(id);
      setNotification({ type: 'success', message: 'Asset deleted successfully' });
      await fetchMedia();
    } catch (err: any) {
      setNotification({ type: 'error', message: err?.message || 'Failed to delete asset' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setNotification({ type: 'success', message: 'Image URL copied to clipboard!' });
  };

  const filteredMedia = mediaFiles.filter((m) => {
    if (filterType === 'Images') {
      return (m.mimeType || '').startsWith('image/') || (m as any).type === 'Image';
    }
    if (filterType === 'Docs') {
      return !(m.mimeType || '').startsWith('image/');
    }
    return true;
  });

  const totalBytes = mediaFiles.reduce((acc, f) => acc + (f.sizeBytes || 0), 0);
  const usedStorageMb = Math.round(totalBytes / 1024 / 1024) || 24;

  return (
    <div className="space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,application/pdf"
      />
      <input
        type="file"
        ref={replaceInputRef}
        onChange={handleFileReplace}
        className="hidden"
        accept="image/*,application/pdf"
      />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Media Assets Library</h1>
          <p className="text-xs text-muted-foreground">Upload and manage case study images, architecture diagrams, and PDF resources.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchMedia} disabled={loading}>
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Upload Asset'}
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`p-3 rounded-lg text-xs flex items-center justify-between ${
          notification.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
        }`}>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-xs font-bold hover:opacity-80">✕</button>
        </div>
      )}

      {/* Storage Widget & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <StorageWidget usedStorageMb={usedStorageMb} totalStorageMb={1024} />
        </div>
        <Card variant="glass" padding="md" className="space-y-2 flex flex-col justify-center border-primary/20">
          <span className="text-xs font-mono text-muted-foreground uppercase">Total Media Files</span>
          <p className="text-2xl font-extrabold font-mono text-primary">{mediaFiles.length} Assets</p>
          <span className="text-xs text-muted-foreground">
            {mediaFiles.filter((m) => (m.mimeType || '').startsWith('image/')).length} Images · {mediaFiles.filter((m) => !(m.mimeType || '').startsWith('image/')).length} Docs
          </span>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search media files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-border text-foreground text-xs focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterType === 'All' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface hover:bg-surface-hover text-muted-foreground'
            }`}
          >
            All Files
          </button>
          <button
            onClick={() => setFilterType('Images')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterType === 'Images' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface hover:bg-surface-hover text-muted-foreground'
            }`}
          >
            Images
          </button>
          <button
            onClick={() => setFilterType('Docs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              filterType === 'Docs' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-surface hover:bg-surface-hover text-muted-foreground'
            }`}
          >
            Docs
          </button>
        </div>
      </div>

      {/* Asset Thumbnail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading && mediaFiles.length === 0 ? (
          <div className="col-span-full p-12 text-center text-muted-foreground font-mono">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
            Loading media library...
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground font-mono">
            No media assets found matching search criteria.
          </div>
        ) : (
          filteredMedia.map((asset) => {
            const isImage = (asset.mimeType || '').startsWith('image/') || (asset as any).type === 'Image';
            return (
              <Card key={asset.id} variant="glass" padding="sm" className="space-y-3 group overflow-hidden border-border/80">
                <div className="h-32 w-full rounded-lg bg-surface overflow-hidden relative border border-border/60">
                  {isImage ? (
                    <img src={asset.url} alt={asset.filename || asset.altText || 'Media Asset'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-accent text-muted-foreground">
                      <FileText className="w-8 h-8 mb-1 text-primary" />
                      <span className="text-[10px] font-mono uppercase">{asset.mimeType?.split('/')[1] || 'DOC'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-foreground text-xs truncate" title={asset.filename}>
                    {asset.filename || 'Untitled Asset'}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-1">
                    <span>{asset.sizeBytes ? `${Math.round(asset.sizeBytes / 1024)} KB` : 'N/A'}</span>
                    <span>{asset.dimensions ? `${asset.dimensions.width}x${asset.dimensions.height}` : 'Asset'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(asset.url)}
                    className="p-1 rounded text-muted-foreground hover:text-primary text-[11px] font-mono inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy URL
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setReplaceTargetId(asset.id);
                        replaceInputRef.current?.click();
                      }}
                      className="p-1 rounded text-muted-foreground hover:text-primary"
                      title="Replace File"
                    >
                      <RefreshCcw className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(asset.id)}
                      disabled={actionLoadingId === asset.id}
                      className="p-1 rounded text-muted-foreground hover:text-rose-400"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
