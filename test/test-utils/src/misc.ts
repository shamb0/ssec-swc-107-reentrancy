/**
 * Sleeps for a number of milliseconds.
 * @param ms Number of ms to sleep.
 * @returns a promise that resolves after the number of ms.
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
