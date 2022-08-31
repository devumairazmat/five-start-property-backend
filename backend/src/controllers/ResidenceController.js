import fs from 'fs';
import Residence from '../models/Residence.js';

export const getAllResidences = async (req, res) => {
    const currentPage = req.query.page || 1;
    const perPage = req.query.perPage || 6;
    let totalData;

    try {
        let count = await Residence.find().countDocuments();
        totalData = count;

        let data = await Residence.find()
            .skip(parseInt(currentPage - 1) * parseInt(perPage))
            .limit(parseInt(perPage));

        res.status(200).json({
            data,
            message: 'Post Data successfully found!',
            totalData,
            perPage,
            currentPage,
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const createResidence = async (req, res) => {
    try {
        if (req.file) req.body.image = req.file.filename;
        let data = await Residence.create(req.body);
        res.status(201).json({ data, message: 'New residence successfully created!' });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const getResidence = async (req, res) => {
    try {
        let data = await Residence.findOne({ slug: req.params.slug });
        if (data === null) res.status(404).json({ message: 'Residence not found!' });
        res.status(200).json({ data, message: 'Residence successfully found!' });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const updateResidence = async (req, res) => {
    try {
        let residence = await Residence.findOne({ slug: req.params.slug });
        console.log(residence.image, req.file);

        if (req.file) {
            fs.realpath(`public/assets/images/residence_images/${residence.image}`, [], (err, resolvedPath) => {
                if (err) return res.status(400).send(err);
                removeResidenceImage(resolvedPath);
            });
            residence.image = req.file.filename;
        }

        let data = await Residence.updateOne({ slug: req.params.slug }, req.body);
        if (data === null) res.status(404).json({ message: 'Residence not found!' });
        res.status(200).json({ data, message: 'Residence successfully updated!' });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const destroyResidence = async (req, res) => {
    try {
        let residence = await Residence.findOne({ slug: req.params.slug });

        if (residence.image !== 'https://source.unsplash.com/random/800x400?residence') {
            fs.realpath(`public/assets/images/residence_images/${residence.image}`, [], (err, resolvedPath) => {
                if (err) return res.status(400).send(err);
                removeResidenceImage(resolvedPath);
            });
            residence.image = req.file.filename;
        }

        let data = await Residence.findOneAndRemove({ slug: req.params.slug });
        if (data === null) res.status(404).json({ message: 'Residence not found!' });
        res.status(200).json({ data, message: 'Residence successfully deleted!' });
    } catch (err) {
        res.status(400).send(err);
    }
};

const removeResidenceImage = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) res.status(400).send(err);
    });
};
