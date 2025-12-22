import React from 'react';
import { 
  Youtube, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Github, 
  FileText, 
  Newspaper, 
  ShoppingBag, 
  Link as LinkIcon,
} from 'lucide-react';
import { Platform } from '../types';

export const PlatformIcon = ({ platform, className = "w-4 h-4" }: { platform: Platform, className?: string }) => {
  // Colors are now handled by parent component (PinCard)
  switch (platform) {
    case 'youtube': return <Youtube className={className} />;
    case 'instagram': return <Instagram className={className} />;
    case 'twitter': return <Twitter className={className} />;
    case 'linkedin': return <Linkedin className={className} />;
    case 'github': return <Github className={className} />;
    case 'blog': return <FileText className={className} />;
    case 'news': return <Newspaper className={className} />;
    case 'shopping': return <ShoppingBag className={className} />;
    default: return <LinkIcon className={className} />;
  }
};