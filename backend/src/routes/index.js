import express from 'express';
import multer from 'multer';
import { login, register } from '../controllers/AuthController.js';
import { createResidence, getAllResidences, getResidence, destroyResidence, updateResidence } from '../controllers/ResidenceController.js';

const residenceStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/residence_images');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime() + '-' + file.originalname);
    },
});

const residenceFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadResidenceImage = multer({ storage: residenceStorage, fileFilter: residenceFilter, limits: { fieldSize: 3 * 1024 * 1024 } }).single('image');

const router = express.Router();

// Auth
router.post('/register', register);
router.post('/login', login);

// Residence
router.get('/residences', getAllResidences);
router.post('/residences', uploadResidenceImage, createResidence);
router.get('/residences/:slug', getResidence);
router.patch('/residences/:slug', uploadResidenceImage, updateResidence);
router.delete('/residences/:slug', destroyResidence);

export default router;
