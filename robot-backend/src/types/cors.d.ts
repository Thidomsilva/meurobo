declare module 'cors' {
  import { RequestHandler } from 'express';
  type StaticOrigin = boolean | string | RegExp | (boolean | string | RegExp)[];
  interface CorsOptions {
    origin?: StaticOrigin | ((requestOrigin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void);
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
  }
  function cors(options?: CorsOptions): RequestHandler;
  export = cors;
}
