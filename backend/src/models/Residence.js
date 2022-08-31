import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Residence = new Schema(
    {
        image: {
            type: String,
            default: 'https://source.unsplash.com/random/800x400?residence',
        },
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        location: {
            type: String,
            required: true,
        },
        bed: {
            type: Number,
            required: true,
        },
        bath: {
            type: Number,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Residence', Residence, 'residences');
