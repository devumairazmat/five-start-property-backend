import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            data: user,
            message: 'User successfully registered!',
        });
    } catch (err) {
        res.status(400).send(err);
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(401).json({ message: 'Wrong password!' });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            'sayasukangoding',
            {
                expiresIn: '1d',
            }
        );

        res.status(200).json({
            token,
            user: {
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                image: user.image,
            },
            message: 'Login successfully!',
        });
    } catch (err) {
        res.status(400).send(err);
    }
};
