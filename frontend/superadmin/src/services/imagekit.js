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
 * Generates ImageKit client-side authentication parameters (signature, token, expire)
 * Uses Web Crypto HMAC-SHA1 matching ImageKit's authentication specification
 */
export const generateImageKitAuth = async () => {
  const token = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'tok_' + Math.random().toString(36).substring(2) + Date.now();
  const expire = Math.floor(Date.now() / 1000) + 1800; // 30 minutes expiry
  const message = token + expire;

  try {
    const enc = new TextEncoder();
    const keyData = enc.encode(IMAGEKIT_CONFIG.privateKey);
    const msgData = enc.encode(message);

    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    );

    const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signature = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return { token, expire, signature };
  } catch (err) {
    console.warn('WebCrypto HMAC generation failed:', err);
    return { token, expire, signature: '' };
  }
};

/**
 * Uploads an image to ImageKit via backend API or direct authenticated endpoint
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
    console.warn('Backend upload endpoint unreachable, attempting direct ImageKit upload...', backendErr);
  }

  // 2. Direct authenticated upload to ImageKit with HMAC-SHA1 signature
  try {
    const auth = await generateImageKitAuth();
    const formData = new FormData();
    if (file instanceof File) {
      formData.append('file', file);
    } else {
      formData.append('file', fileData);
    }
    formData.append('fileName', cleanName || `img_${Date.now()}`);
    formData.append('publicKey', IMAGEKIT_CONFIG.publicKey);
    if (auth.signature) {
      formData.append('signature', auth.signature);
      formData.append('token', auth.token);
      formData.append('expire', String(auth.expire));
    }
    formData.append('folder', folder);
    formData.append('useUniqueFileName', 'true');

    const directRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
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
    console.warn('ImageKit direct upload failed, falling back to data URL:', directErr);
  }

  // 3. Fallback: Return base64 data URL so company creation and preview never break
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
