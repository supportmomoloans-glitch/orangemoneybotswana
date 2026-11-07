// LocalStorage-based session and loan application persistence for MoMo login
const SESSION_KEY = 'momo_session';
const APP_KEY = 'momo_application';

export interface MoMoSession {
  phone: string;
  country: string;
  countryCode: string;
  loggedIn: boolean;
}

export interface LoanApplication {
  amount: string;
  purpose: string;
  type: string;
  repayment: string;
  firstName: string;
  lastName: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'reviewing';
}

export function getSession(): MoMoSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setSession(session: MoMoSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getApplication(): LoanApplication | null {
  try {
    const raw = localStorage.getItem(APP_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setApplication(app: LoanApplication) {
  localStorage.setItem(APP_KEY, JSON.stringify(app));
}

export function clearApplication() {
  localStorage.removeItem(APP_KEY);
}
