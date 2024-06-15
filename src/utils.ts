export function buf2hex(buffer: ArrayBufferLike): string {
  // buffer is an ArrayBuffer
  return (
    '0x' +
    [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('')
  );
}

export const getRandomUint8Array = (length = 16) => {
  const array = new Uint8Array(length);
  return globalThis.crypto.getRandomValues(array);
};

export function getRandomString(): string {
  return buf2hex(globalThis.crypto.getRandomValues(new Uint8Array(16)));
}
