const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Garante que o diretório de uploads exista (usando a pasta mapeada no volume do docker)
const uploadDir = path.resolve(__dirname, '../../uploads/brasoes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Usa um timestamp para evitar colisão de nomes
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
  }
});

const fileFilter = (req, file, cb) => {
  // Aceita apenas arquivos .png (imagem do tipo image/png)
  if (file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos .png são permitidos!'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite de 5MB
  }
});

module.exports = upload;
