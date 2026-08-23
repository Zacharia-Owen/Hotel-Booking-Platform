import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { rateLimit } from "express-rate-limit";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(
    process.env.ADMIN_PASSWORD || "admin123",
    10
);

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
    message: "Too many login attempts from this IP, please try again after 15 minutes",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

router.post('/login', loginLimiter, (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).json({ message: "Username and password are required." });
        return;
    }

    const usernameMatch = username === ADMIN_USERNAME;
    const passwordMatch = bcrypt.compareSync(password, ADMIN_PASSWORD_HASH);

    if (!usernameMatch || !passwordMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
    }

    const token = jwt.sign(
        { username },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '8h' }
    );

    res.json({ token });
});

export default router;