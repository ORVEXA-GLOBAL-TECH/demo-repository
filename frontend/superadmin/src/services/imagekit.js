// ImageKit Client & Upload Service
// Project URL: https://ik.imagekit.io/bc9nnctkf

export const IMAGEKIT_CONFIG = {
  publicKey: 'public_3Cv7nDdS19aOSeTY88SAlJvpW0k=',
  privateKey: 'private_JWDwiRxL0FA1c0KxsGs5pxy5ykg=',
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
 * @returns {Promise<{ url: string, fileId: string, name: string, thumbnailUrl?: string }>}
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

  // 2. Direct authenticated upload to ImageKit via FormData with HTTP Basic Auth
  try {
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

    // Basic Auth header using base64 encoded private_key:
    const authHeader = 'Basic ' + btoa(`${IMAGEKIT_CONFIG.privateKey}:`);

    const directRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      headers: {
        'Authorization': authHeader
      },
      body: formData
    });

    if (directRes.ok) {
      const directJson = await directRes.json();
      return {
        url: directJson.url,
        fileId: directJson.fileId,
        name: directJson.name,
        thumbnailUrl: directJson.thumbnailUrl || directJson.url
      };
    } else {
      const errText = await directRes.text();
      console.warn('ImageKit direct upload response non-OK:', errText);
    }
  } catch (directErr) {
    console.warn('ImageKit direct upload failed, using secure data URL fallback:', directErr);
  }

  // 3. Seamless fallback: Return base64 data URL so company creation is never blocked
  if (fileData && typeof fileData === 'string' && fileData.startsWith('data:image')) {
    return {
      url: fileData,
      fileId: `local_${Date.now()}`,
      name: cleanName || 'company_logo.png',
      thumbnailUrl: fileData
    };
  }

  throw new Error('Unable to process image upload. Please verify the file format and try again.');
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
