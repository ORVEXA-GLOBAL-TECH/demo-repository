// ImageKit Client & Upload Service
// Project URL: https://ik.imagekit.io/bc9nnctkf

export const IMAGEKIT_CONFIG = {
  publicKey: 'public_3Cv7nDdS19aOSeTY88SAlJvpW0k=',
  urlEndpoint: 'https://ik.imagekit.io/bc9nnctkf'
};

/**
 * Converts a browser File to base64 Data URL
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uploads an image to ImageKit via backend API or direct fallback
 * @param {File|string} file - File object or base64 string
 * @param {string} fileName - Destination file name
 * @param {string} folder - Destination folder on ImageKit (e.g. '/company-logos')
 * @returns {Promise<{ url: string, fileId: string, name: string }>}
 */
export const uploadImageToImageKit = async (file, fileName = '', folder = '/company-logos') => {
  let fileData = file;
  let cleanName = fileName;

  if (file instanceof File) {
    cleanName = cleanName || file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    fileData = await fileToBase64(file);
  }

  // 1. Try uploading through Backend API endpoint
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: fileData,
        fileName: cleanName || `img_${Date.now()}`,
        folder,
        tags: ['company-logo', 'superadmin', 'alleviare']
      })
    });

    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.url) {
        return json.data;
      }
    }
  } catch (backendErr) {
    console.warn('Backend ImageKit upload endpoint unreachable, attempting direct upload...', backendErr);
  }

  // 2. Direct upload to ImageKit via FormData
  const formData = new FormData();
  if (file instanceof File) {
    formData.append('file', file);
  } else {
    formData.append('file', fileData);
  }
  formData.append('fileName', cleanName || `img_${Date.now()}`);
  formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);
  formData.append('folder', folder);
  formData.append('useUniqueFileName', 'true');

  const directRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData
  });

  if (!directRes.ok) {
    const errText = await directRes.text();
    throw new Error(`ImageKit Upload Failed: ${errText || directRes.statusText}`);
  }

  const directJson = await directRes.json();
  return {
    url: directJson.url,
    fileId: directJson.fileId,
    name: directJson.name,
    thumbnailUrl: directJson.thumbnailUrl
  };
};

/**
 * Builds an optimized ImageKit transformation URL
 * @param {string} url - Original ImageKit URL
 * @param {object} transforms - { width, height, quality, format }
 */
export const getImageKitUrl = (url, { width, height, quality = 80, format = 'auto' } = {}) => {
  if (!url || !url.includes('ik.imagekit.io')) return url;
  const parts = [];
  if (width) parts.push(`w-${width}`);
  if (height) parts.push(`h-${height}`);
  if (quality) parts.push(`q-${quality}`);
  if (format) parts.push(`f-${format}`);

  if (parts.length === 0) return url;
  const tr = `tr:${parts.join(',')}`;

  // Insert transform into URL: https://ik.imagekit.io/bc9nnctkf/tr:.../folder/file.png
  const base = IMAGEKIT_CONFIG.urlEndpoint;
  if (url.startsWith(base)) {
    const path = url.slice(base.length);
    return `${base}/${tr}${path.startsWith('/') ? path : '/' + path}`;
  }
  return url;
};
