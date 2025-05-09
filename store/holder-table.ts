type Listener = () => void;

let total: number = 0;
let listeners: Set<Listener> = new Set();

export const getTotal = (): number => total;

export const setTotal = (newTotal: number): void => {
  total = newTotal;
  listeners.forEach((listener) => listener());
};

export const subscribe = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
