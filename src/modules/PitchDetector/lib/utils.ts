export function throttle(cb: (...args: any[]) => void, delay: number) {
  let wait = false;

  return (...args: any[]) => {
    if (wait) {
      return;
    }

    cb(...args);
    wait = true;
    setTimeout(() => {
      wait = false;
    }, delay)
  }
}

