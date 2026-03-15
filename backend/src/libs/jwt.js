import jwt from 'jsonwebtoken';

export const generateToken = (result) => {
    const userId = result.id;
    if (result.name.startsWith('guest')) {
        const token = jwt.sign({ userId, guest: true }, process.env.JWT_SECRET);
        return token;
    } else {
        const token = jwt.sign({ userId, guest: false }, process.env.JWT_SECRET);
        return token;
    }
};

export const decodeToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
