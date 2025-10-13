// Type declarations for modules without official @types packages

declare module 'event-emitter' {
  interface EventEmitter {
    on(event: string, listener: (...args: any[]) => void): this;
    off(event: string, listener?: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
    once(event: string, listener: (...args: any[]) => void): this;
    allOff(event?: string): this;
  }

  interface EventEmitterStatic {
    (target?: object): EventEmitter;
    new (target?: object): EventEmitter;
  }

  const EventEmitter: EventEmitterStatic;
  export = EventEmitter;
}

declare module 'path-webpack' {
  interface Path {
    resolve(...paths: string[]): string;
    join(...paths: string[]): string;
    dirname(path: string): string;
    basename(path: string, ext?: string): string;
    extname(path: string): string;
    relative(from: string, to: string): string;
    normalize(path: string): string;
    isAbsolute(path: string): boolean;
    sep: string;
    delimiter: string;
    parse(path: string): {
      root: string;
      dir: string;
      base: string;
      ext: string;
      name: string;
    };
    format(pathObject: {
      root?: string;
      dir?: string;
      base?: string;
      ext?: string;
      name?: string;
    }): string;
  }

  const path: Path;
  export = path;
}
