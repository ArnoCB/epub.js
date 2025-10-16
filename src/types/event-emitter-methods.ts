// EventEmitter method signatures for use as a type
export type EventEmitterMethods = {
  emit: (...args: any[]) => void;
  on: (...args: any[]) => void;
  off?: (...args: any[]) => void;
  once?: (...args: any[]) => void;
};
