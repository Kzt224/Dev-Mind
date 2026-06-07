import jwt from 'jsonwebtoken';

export const generateToken = (result: any) => {
    const secret = process?.env.JWT_SECRET;

    const userId = result?.id;
    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }
    if (result.name.startsWith('guest')) {
        const token = jwt.sign({ userId, guest: true }, secret);
        return token;
    } else {
        const token = jwt.sign({ userId, guest: false }, secret);
        return token;
    }
};

export const decodeToken = (token: string) => {
    const secret = process?.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }
    return jwt.verify(token, secret);
};
