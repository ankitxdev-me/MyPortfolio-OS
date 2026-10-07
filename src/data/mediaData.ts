export interface MediaAsset {
  id: string;
  name: string;
  filename?: string;
  originalName?: string;
  type: 'Image' | 'Document' | 'Diagram';
  url: string;
  optimizedUrl?: string;
  thumbnailUrl?: string;
  publicId?: string;
  mimeType?: string;
  size: string | number;
  width?: number;
  height?: number;
  dimensions?: string;
  format?: string;
  folder?: string;
  altText?: string;
  tags?: string[];
  uploadedAt: string;
}

export const MEDIA_STATS = {
  usedStorageMb: 412,
  totalStorageMb: 1024,
  totalFiles: 24,
  imagesCount: 16,
  documentsCount: 5,
  diagramsCount: 3,
};

export const MEDIA_ASSETS_LIST: MediaAsset[] = [
  {
    id: '1',
    name: 'autoops-architecture-diagram.png',
    type: 'Diagram',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    size: '1.4 MB',
    dimensions: '1920x1080',
    format: 'png',
    uploadedAt: '2026-07-20',
  },
  {
    id: '2',
    name: 'ankit-gupta-headshot.png',
    type: 'Image',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
    size: '840 KB',
    dimensions: '800x800',
    format: 'png',
    uploadedAt: '2026-07-15',
  },
  {
    id: '3',
    name: 'resume-ankit-gupta.pdf',
    type: 'Document',
    url: '/assets/resume.pdf',
    size: '220 KB',
    format: 'pdf',
    uploadedAt: '2026-07-10',
  },
  {
    id: '4',
    name: 'telegram-bot-suite-preview.png',
    type: 'Image',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    size: '1.1 MB',
    dimensions: '1280x720',
    format: 'png',
    uploadedAt: '2026-07-05',
  },
];
