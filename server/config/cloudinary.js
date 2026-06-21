const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for notes/documents
const noteStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    const resourceType = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext) ? 'image' : 'raw';
    return {
      folder: 'enginotes/notes',
      resource_type: resourceType,
      allowed_formats: ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'jpg', 'jpeg', 'png', 'zip'],
      public_id: `note_${Date.now()}_${file.originalname.split('.')[0]}`,
    };
  },
});

// Storage for profile photos
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'enginotes/avatars',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  },
});

const uploadNote = multer({
  storage: noteStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/jpeg', 'image/png', 'image/gif', 'application/zip',
      'application/x-zip-compressed'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: PDF, DOCX, PPTX, Images, ZIP'), false);
    }
  }
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed for profile photo'), false);
    }
  }
});

const deleteFromCloudinary = async (publicId, resourceType = 'raw') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};

module.exports = { cloudinary, uploadNote, uploadAvatar, deleteFromCloudinary };
