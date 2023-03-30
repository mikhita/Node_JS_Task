declare module global {
  namespace NodeJS {
    interface ProcessEnv {
      PASSWORD: string;
    }
  }
}
