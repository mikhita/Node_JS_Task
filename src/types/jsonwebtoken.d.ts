declare module 'jsonwebtoken' {
  interface Jwt {
    header: {
      alg: string;
      typ: string;
    };
    payload: JwtPayload;
    signature: string;
  }

  interface JwtPayload {
    username: string;
    id: string;
  }

  export function sign(payload: JwtPayload, secretOrPrivateKey: string): string;
  export function verify(token: string, secretOrPrivateKey: string): Jwt;
}
