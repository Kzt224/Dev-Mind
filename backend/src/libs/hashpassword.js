import bcrypt from "bcryptjs";

export const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password,salt);
}

export const descryptPassword = (password,hashPassword) => {
    return bcrypt.compareSync(password,hashPassword);
}