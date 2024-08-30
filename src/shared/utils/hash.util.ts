import * as bcrypt from 'bcrypt';

// Fungsi untuk melakukan hash pada password
export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Fungsi untuk memverifikasi password yang diinput dengan hash yang tersimpan
export function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
