
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventCommonPasswords: boolean;
  passwordExpiry: number; // en jours
}

export interface TwoFactorSettings {
  enabled: boolean;
  method: 'sms' | 'email' | 'authenticator';
  backupCodes: string[];
  lastUpdated?: string;
}

export interface SecuritySettings {
  passwordPolicy: PasswordPolicy;
  twoFactor: TwoFactorSettings;
  sessionTimeout: number; // en minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // en minutes
}

export const defaultPasswordPolicy: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
  preventCommonPasswords: true,
  passwordExpiry: 90
};

export const defaultTwoFactorSettings: TwoFactorSettings = {
  enabled: false,
  method: 'email',
  backupCodes: []
};

export const defaultSecuritySettings: SecuritySettings = {
  passwordPolicy: defaultPasswordPolicy,
  twoFactor: defaultTwoFactorSettings,
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  lockoutDuration: 15
};
