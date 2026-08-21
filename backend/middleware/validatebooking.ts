import { Request, Response, NextFunction } from 'express';

export const validateBooking = (req: Request, res: Response, next: NextFunction) => {
    const { firstname, lastname, email, phone, checkin, checkout, roomID } = req.body;

    if (!firstname || !lastname || !email || !phone || !checkin || !checkout || !roomID) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    next();
}