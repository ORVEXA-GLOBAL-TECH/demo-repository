import { Router } from 'express';
import { imagekit } from '../config/imagekit.js';

const router = Router();

// GET /api/upload/auth - Generates authentication parameters for client-side uploads
router.get('/auth', (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    res.json({
      success: true,
      ...authParams,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_3Cv7nDdS19aOSeTY88SAlJvpW0k=',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/bc9nnctkf'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/upload - Upload image to ImageKit (accepts base64, data URL, or remote URL)
router.post('/', async (req, res) => {
  try {
    const { file, fileName, folder = '/company-logos', tags = ['company-logo', 'superadmin'] } = req.body;

    if (!file) {
      return res.status(400).json({ success: false, error: 'No file or image data provided.' });
    }

    const cleanFileName = (fileName || `img_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');

    const response = await imagekit.upload({
      file,
      fileName: cleanFileName,
      folder,
      tags: Array.isArray(tags) ? tags : [tags],
      useUniqueFileName: true
    });

    res.json({
      success: true,
      data: {
        fileId: response.fileId,
        name: response.name,
        url: response.url,
        thumbnailUrl: response.thumbnailUrl,
        size: response.size,
        fileType: response.fileType,
        height: response.height,
        width: response.width
      }
    });
  } catch (err) {
    console.error('ImageKit upload error:', err);
    res.status(500).json({ success: false, error: err.message || 'ImageKit upload failed' });
  }
});

export default router;
