/**
 * @summary Provides browser downloads for binary API responses.
 * @author FreshGuard
 */

/**
 * Downloads a Blob using a temporary browser object URL.
 *
 * @param {Blob} blob Binary file content.
 * @param {string} fileName Downloaded file name.
 * @returns {void}
 */
export function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
