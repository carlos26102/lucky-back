const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const multer = require('multer');

const storage = multer.memoryStorage();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer(storage);

const uploadFile = function(imageName) {
  return upload.single(imageName);
};

const uploadToCloudinary = function(req, res, next) {
  const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'img',
      },
      function(err, savedImage) {
        req.fileNewName = savedImage.url;
        next();
      },
  );
  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = {
  uploadFile,
  uploadToCloudinary,
};
