const multer = require('multer');

module.exports = multer({
  // dest: 'src/public/img/avatars', // remove this to pass the image through the next middleware
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error('Please upload an image'), false);

    cb(undefined, true);
  },
});
