import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/authenticate';
import pool from '../db';

const router = Router();

// GET all bookings
router.get('/', authenticate, async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// getting a single booking by id
router.get('/:id', authenticate, async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Booking not found'});
      return;
    }

    res.json(result.rows[0]);
  } catch (err : any) {
    console.error(err)

    if (err.code === '22P02') {
      res.status(400).json({ error: 'Invalid booking ID' });
      return;
    }

    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// POST a new booking
router.post('/', async (req: Request, res: Response) => {
    const { firstname, lastname, email, phone, checkin, checkout, roomID } = req.body;

    if (!firstname || !lastname || !email || !phone || !checkin || !checkout || !roomID) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }

    try {
        const result = await pool.query(
            `INSERT INTO bookings (room_id, firstname, lastname, email, phone, checkin, checkout)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
            [roomID, firstname, lastname, email, phone, checkin, checkout]
        );
        res.status(201).json(result.rows[0]);
    } catch (err: any) {
        console.error(err);

        if (err.code === '23503') {
            res.status(400).json({ error: 'Room does not exist' });
            return;
        }

        if (err.code === '23514') {
            res.status(400).json({ error: 'Check-out date must be after check-in date' });
            return;
        }

        res.status(500).json({ error: 'Failed to create booking' });
    }
});

// DELETE a booking
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

export default router;