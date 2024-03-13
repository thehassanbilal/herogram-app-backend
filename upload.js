import multer from 'multer';
import path from 'path';
import { Router } from 'express';

const router = Router();

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Set the destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
    // Here you can handle storing the file in the database or performing any other operations

    res.json({ success: true, file: req.file });
});

export default router;
