
import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  action: () => void;
  preview: string;
  previewIcon: LucideIcon;
}
