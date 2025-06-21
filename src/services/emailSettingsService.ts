
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { EmailSettings, defaultEmailSettings } from '@/components/Settings/types/email';

export const emailSettingsService = {
  async fetchSettings(): Promise<EmailSettings> {
    const docRef = doc(db, 'email_settings', 'global');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { ...defaultEmailSettings, ...docSnap.data() } as EmailSettings;
    }
    
    return defaultEmailSettings;
  },

  async saveSettings(settings: EmailSettings): Promise<void> {
    const docRef = doc(db, 'email_settings', 'global');
    await setDoc(docRef, settings);
  }
};
