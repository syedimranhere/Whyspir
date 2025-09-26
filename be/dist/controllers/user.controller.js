import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();
const options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24 * 15
};
export const registerUser = async function (req, res) {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const { avatar } = req.files;
        const exist = await client.user.findUnique({
            where: {
                username
            }
        });
        if (exist) {
            return res.status(400).json({ message: "Username already exists" });
        }
        await client.user.create({
            data: {
                username,
                password: await bcrypt.hash(password, 10),
                //handle avatar later
            }
        });
        return res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.log(error.message);
        return res.status(400).json({ message: "Error" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await client.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }
        const token = jwt.sign({ id: user.id }, process.env.token, { expiresIn: process.env.token_expiry });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 15
        });
        return res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=user.controller.js.map