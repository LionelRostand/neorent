
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface CategoryPriorityFieldsProps {
  category: string;
  priority: string;
  onCategoryChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

const CategoryPriorityFields = ({ category, priority, onCategoryChange, onPriorityChange }: CategoryPriorityFieldsProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category">{t('maintenance.categoryField')}</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('maintenance.selectCategory')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Plomberie">{t('maintenance.categories.plumbing')}</SelectItem>
            <SelectItem value="Électricité">{t('maintenance.categories.electricity')}</SelectItem>
            <SelectItem value="Chauffage">{t('maintenance.categories.heating')}</SelectItem>
            <SelectItem value="Peinture">{t('maintenance.categories.painting')}</SelectItem>
            <SelectItem value="Serrurerie">{t('maintenance.categories.locksmith')}</SelectItem>
            <SelectItem value="Ménage">{t('maintenance.categories.cleaning')}</SelectItem>
            <SelectItem value="Autre">{t('maintenance.categories.other')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">{t('maintenance.priorityField')}</Label>
        <Select value={priority} onValueChange={onPriorityChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('maintenance.selectPriority')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">{t('maintenance.priorities.urgent')}</SelectItem>
            <SelectItem value="normal">{t('maintenance.priorities.normal')}</SelectItem>
            <SelectItem value="faible">{t('maintenance.priorities.low')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default CategoryPriorityFields;
