import bcrypt from "bcryptjs";

export const encryptPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export const descryptPassword = (password: string, hashPassword: string) => {
    return bcrypt.compareSync(password, hashPassword);
}