export type UserProfile = "participant" | "organisateur" | null;

export interface LocalUser {
  email: string;
  password: string;
  country: string;
  profile: UserProfile;
}

const USERS_KEY = "xona_tsa_users";
const SESSION_KEY = "xona_tsa_session";
const RECOVERY_KEY = "xona_tsa_recovery";

function users(): LocalUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]") as LocalUser[]; }
  catch { return []; }
}

function saveUsers(list: LocalUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

export function register(email: string, password: string, country: string): void {
  const clean = email.trim().toLowerCase();
  const list = users();
  if (list.some(u => u.email === clean)) throw new Error("Cette adresse e-mail est déjà utilisée.");
  list.push({ email: clean, password, country, profile: null });
  saveUsers(list);
}

export function login(email: string, password: string): LocalUser {
  const clean = email.trim().toLowerCase();
  const user = users().find(u => u.email === clean && u.password === password);
  if (!user) throw new Error("Adresse e-mail ou mot de passe incorrect.");
  localStorage.setItem(SESSION_KEY, clean);
  return user;
}

export function currentUser(): LocalUser | null {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return users().find(u => u.email === email) ?? null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function setProfile(profile: Exclude<UserProfile, null>) {
  const user = currentUser();
  if (!user) throw new Error("Session introuvable.");
  const list = users().map(u => u.email === user.email ? { ...u, profile } : u);
  saveUsers(list);
}

export function createRecoveryCode(email: string): string {
  const clean = email.trim().toLowerCase();
  if (!users().some(u => u.email === clean)) throw new Error("Aucun compte ne correspond à cette adresse e-mail.");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  localStorage.setItem(RECOVERY_KEY, JSON.stringify({ email: clean, code, expires: Date.now() + 10 * 60 * 1000 }));
  return code;
}

export function verifyRecoveryCode(email: string, code: string): boolean {
  try {
    const item = JSON.parse(localStorage.getItem(RECOVERY_KEY) || "null") as {email:string;code:string;expires:number} | null;
    if (!item || item.email !== email.trim().toLowerCase() || item.code !== code) return false;
    return Date.now() < item.expires;
  } catch { return false; }
}
