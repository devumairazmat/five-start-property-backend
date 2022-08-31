import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const User = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },
        image: {
            type: String,
            default: 'https://source.unsplash.com/random/300x300',
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

User.pre('save', async function (next) {
    this.role = 'USER';
    this.image = 'https://source.unsplash.com/random/300x300';

    if (!this.isModified('password')) next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

export default mongoose.model('User', User, 'users');
