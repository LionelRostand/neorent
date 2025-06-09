
export interface SMTPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'none' | 'tls' | 'ssl';
  fromEmail: string;
  fromName: string;
}

export interface IMAPSettings {
  host: string;
  port: number;
  username: string;
  password: string;
  security: 'none' | 'tls' | 'ssl';
  folder: string;
}

export interface EmailSettings {
  smtp: SMTPSettings;
  imap: IMAPSettings;
  enabled: boolean;
  testMode: boolean;
}

export const defaultSMTPSettings: SMTPSettings = {
  host: '',
  port: 587,
  username: '',
  password: '',
  security: 'tls',
  fromEmail: '',
  fromName: ''
};

export const defaultIMAPSettings: IMAPSettings = {
  host: '',
  port: 993,
  username: '',
  password: '',
  security: 'ssl',
  folder: 'INBOX'
};

export const defaultEmailSettings: EmailSettings = {
  smtp: defaultSMTPSettings,
  imap: defaultIMAPSettings,
  enabled: false,
  testMode: true
};
