import pako from "pako";

/**
 * Giải mã base64 -> Uint8Array
 */
function base64ToUint8Array(base64) {
  const binaryStr = atob(base64);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
}

/**
 * Hàm chính: từ base64 (compressed), trả về ảnh base64 đã giải nén
 */
export const decompressBase64Image = (base64Compressed) => {
  try {
    const compressedBytes = base64ToUint8Array(base64Compressed);
    const decompressedBytes = pako.inflate(compressedBytes);

    // Convert decompressed bytes to base64 string
    let binary = "";
    for (let i = 0; i < decompressedBytes.length; i++) {
      binary += String.fromCharCode(decompressedBytes[i]);
    }

    const base64Image = btoa(binary);
    return `${base64Image}`;
  } catch (e) {
    console.error("Decompression failed:", e);
    return null;
  }
};
