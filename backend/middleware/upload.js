const multer = require('multer');
const path = require('path');

// Set up storage engine untuk gambar
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/uploads/images'); // Menyimpan gambar di folder 'uploads/images'
  },
  filename: (req, file, cb) => {
    // Menyimpan nama file dengan menambahkan timestamp
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Inisialisasi multer dengan konfigurasi
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set limit file size 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

module.exports = upload;
