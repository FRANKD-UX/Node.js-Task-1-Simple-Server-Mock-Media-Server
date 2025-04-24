
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define paths for media files
const MEDIA_DIR = path.join(__dirname, 'media');
const ALLOWED_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'video/mp4': '.mp4',
  'audio/mpeg': '.mp3',
  'audio/wav': '.wav'
};

// Function to ensure media directory exists
const ensureMediaDirectoryExists = () => {
  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
    console.log(`Created media directory at ${MEDIA_DIR}`);
  }
};

// Generate a unique filename
const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
};

// Function to save a media file
const saveMediaFile = (fileBuffer, contentType, originalFilename) => {
  ensureMediaDirectoryExists();
  
  // Verify content type is allowed
  if (!ALLOWED_TYPES[contentType]) {
    throw new Error(`Content type ${contentType} not allowed`);
  }
  
  // Generate unique filename
  const filename = generateUniqueFilename(originalFilename);
  const filePath = path.join(MEDIA_DIR, filename);
  
  // Write file to disk
  fs.writeFileSync(filePath, fileBuffer);
  
  // Return metadata for the saved file
  return {
    filename,
    originalFilename,
    contentType,
    size: fileBuffer.length,
    path: `/media/${filename}`
  };
};

// Function to get a media file
const getMediaFile = (filename) => {
  const filePath = path.join(MEDIA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return {
    data: fs.readFileSync(filePath),
    contentType: getContentTypeFromFilename(filename),
    filePath
  };
};

// Function to determine content type from filename
const getContentTypeFromFilename = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  
  // Map extension back to content type
  const contentTypeMap = Object.entries(ALLOWED_TYPES)
    .reduce((acc, [type, ext]) => ({...acc, [ext]: type}), {});
  
  return contentTypeMap[extension] || 'application/octet-stream';
};

// Function to delete a media file
const deleteMediaFile = (filename) => {
  const filePath = path.join(MEDIA_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  fs.unlinkSync(filePath);
  return true;
};

module.exports = {
  ensureMediaDirectoryExists,
  saveMediaFile,
  getMediaFile,
  deleteMediaFile,
  MEDIA_DIR
};
