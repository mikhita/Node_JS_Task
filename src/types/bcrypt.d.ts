declare module 'bcrypt' {
  export function hash(plaintext: string, saltRounds: number): Promise<string>;
  export function compare(plaintext: string, hash: string): Promise<boolean>;
}
