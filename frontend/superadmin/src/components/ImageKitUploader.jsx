import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, X, Image as ImageIcon, ExternalLink, Link2 } from 'lucide-react';
import { uploadImageToImageKit } from '../services/imagekit';

export default function ImageKitUploader({
  value = '',
  onChange,
  label = 'Company Logo',
  folder = '/company-logos',
  companyName = 'company',
  subText = 'Stored & optimized on ImageKit CDN'
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(value);
  const fileInputRef = useRef(null);

  const handleFileSelected = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image file size must be less than 10MB.');
      return;
    }

    setUploadError('');
    setIsUploading(true);

    try {
      const cleanSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30) || 'logo';
      const ext = file.name.split('.').pop() || 'png';
      const fileName = `${cleanSlug}_${Date.now()}.${ext}`;

      const result = await uploadImageToImageKit(file, fileName, folder);
      if (result && result.url) {
        onChange(result.url);
        setManualUrl(result.url);
      }
    } catch (err) {
      console.error('ImageKit upload error:', err);
      setUploadError(err.message || 'Failed to upload image to ImageKit.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = () => {
    onChange('');
    setManualUrl('');
    setUploadError('');
  };

  const handleManualUrlSubmit = (e) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setShowUrlInput(false);
    }
  };

  const isImageKitUrl = value && value.includes('ik.imagekit.io');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          style={{
            background: 'none',
            border: 'none',
            color: '#0284c7',
            fontSize: '0.72rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Link2 size={12} />
          {showUrlInput ? 'Upload File' : 'Paste Direct URL'}
        </button>
      </div>

      {/* Manual URL Input Option */}
      {showUrlInput && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
          <input
            type="url"
            placeholder="https://ik.imagekit.io/bc9nnctkf/..."
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.82rem'
            }}
          />
          <button
            type="button"
            onClick={handleManualUrlSubmit}
            style={{
              padding: '8px 14px',
              background: '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
      )}

      {/* Uploaded Image Preview Mode */}
      {value ? (
        <div style={{
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '12px 14px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <img
                src={value}
                alt="Logo Preview"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%2394a3b8" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                }}
              />
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  color: isImageKitUrl ? '#0369a1' : '#475569',
                  background: isImageKitUrl ? '#e0f2fe' : '#f1f5f9',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px'
                }}>
                  {isImageKitUrl && <CheckCircle2 size={10} color="#0284c7" />}
                  {isImageKitUrl ? 'IMAGEKIT CDN HOSTED' : 'EXTERNAL URL'}
                </span>
              </div>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '0.74rem',
                  color: '#0284c7',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '280px'
                }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</span>
                <ExternalLink size={11} style={{ flexShrink: 0 }} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{
                padding: '6px 10px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              style={{
                padding: '6px 8px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.74rem',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Remove Logo"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '10px',
            padding: '20px 16px',
            textAlign: 'center',
            background: isUploading ? '#f8fafc' : '#ffffff',
            cursor: isUploading ? 'wait' : 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            if (!isUploading) {
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.background = '#f0f9ff';
            }
          }}
          onMouseLeave={(e) => {
            if (!isUploading) {
              e.currentTarget.style.borderColor = '#cbd5e1';
              e.currentTarget.style.background = '#ffffff';
            }
          }}
        >
          {isUploading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={24} color="#0284c7" className="spin" />
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0284c7' }}>
                Uploading to ImageKit CDN...
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Optimizing format and generating high-speed URLs</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#f0f9ff',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px'
              }}>
                <UploadCloud size={22} />
              </div>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#1e293b' }}>
                Click to upload logo or drag &amp; drop
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                PNG, JPG, SVG, WebP up to 10MB &bull; Stored on ImageKit
              </span>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && handleFileSelected(e.target.files[0])}
        accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
        style={{ display: 'none' }}
      />

      {/* Error Message */}
      {uploadError && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#ef4444',
          fontSize: '0.74rem',
          marginTop: '2px'
        }}>
          <AlertCircle size={14} style={{ flexShrink: 0 }} />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}
