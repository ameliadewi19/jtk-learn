const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/uploads/materials'); 
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${file.originalname}`);
  },
});

const uploadMaterial = multer({
  storage: storage,
  limits: { fileSize: Infinity }, 
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|mp4|avi|mov/;
    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    if (filetypes.test(extname) && filetypes.test(mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('File type not allowed')); 
    }
  },
});

module.exports = uploadMaterial;
