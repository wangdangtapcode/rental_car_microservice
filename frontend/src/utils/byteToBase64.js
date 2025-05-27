export const arrayBufferToBase64 = (buffer) => {
  const binary = buffer.reduce(
    (acc, byte) => acc + String.fromCharCode(byte),
    ""
  );
  return btoa(binary);
};
