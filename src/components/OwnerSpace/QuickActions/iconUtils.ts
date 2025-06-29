
import {
  LayoutDashboard,
  Building,
  FileText,
  Users,
  Globe,
  Settings,
  Home,
  User,
  CreditCard,
  Search,
  Calendar,
  BarChart3,
  Wrench,
  Mail,
  Receipt,
  TrendingUp,
  HelpCircle,
  FileContract,
  ClipboardList,
  DollarSign,
  Plus
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  Building,
  FileText,
  Users,
  Globe,
  Settings,
  Home,
  User,
  CreditCard,
  Search,
  Calendar,
  BarChart3,
  Wrench,
  Mail,
  Receipt,
  TrendingUp,
  HelpCircle,
  FileContract,
  ClipboardList,
  DollarSign,
  Plus
};

export const getIconComponent = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Settings;
};

export const getAvailableIcons = () => {
  return Object.keys(iconMap);
};
