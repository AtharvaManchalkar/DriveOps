import React, { useState, useRef } from 'react';
import '../styles/DragDropUploader.css';

const DragDropUploader = ({ onFilesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const processFiles = (files) => {
    // Create array from FileList object
    const filesArray = Array.from(files);
    
    // Filter for image files only
    const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
    
    // Create preview URLs
    const newPreviewImages = imageFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setPreviewImages([...previewImages, ...newPreviewImages]);
    
    // Pass back just the file objects to the parent component
    onFilesChange([...previewImages.map(p => p.file), ...imageFiles]);
  };

  const removeImage = (indexToRemove) => {
    const updatedPreviews = previewImages.filter((_, index) => index !== indexToRemove);
    setPreviewImages(updatedPreviews);
    
    // Pass back updated file list to parent
    onFilesChange(updatedPreviews.map(preview => preview.file));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[indexToRemove].preview);
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="drag-drop-uploader">
      <div 
        className={`drop-area ${isDragging ? 'dragging' : ''}`} 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="drop-message">
          <i className="upload-icon"></i>
          <p>Drag & drop car images here or click to browse</p>
          <span className="file-info">Supports: JPG, PNG, WEBP</span>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>
      
      {previewImages.length > 0 && (
        <div className="image-preview-container">
          {previewImages.map((preview, index) => (
            <div key={index} className="image-preview">
              <img src={preview.preview} alt={`Preview ${index}`} />
              <button 
                type="button" 
                className="remove-image-btn"
                onClick={() => removeImage(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropUploader;