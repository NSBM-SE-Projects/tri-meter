import multer from 'multer';

// Multer storage
const storage = multer.memoryStorage();

// File filter - only allow image files
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

// File filter - allow images and PDFs for ID cards
const idCardFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG images and PDF files are allowed.'), false);
  }
};

// File filter for user uploads (idCard can be PDF, profilePhoto must be image)
const userFileFilter = (req, file, cb) => {
  if (file.fieldname === 'idCard') {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid ID card file type. Only JPEG, PNG images and PDF files are allowed.'), false);
    }
  } else if (file.fieldname === 'profilePhoto') {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid profile photo file type. Only JPEG, PNG images are allowed.'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Configure multer for customer images
const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Configure multer for user uploads (ID card + profile photo)
export const userUpload = multer({
  storage: storage,
  fileFilter: userFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
  }
});

export default upload;
