import { Router, Request, Response } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page -1) * limit;

  try {
    const result = await pool.query(
      'SELECT * FROM rooms ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM rooms');
    const totalRooms = parseInt(countResult.rows[0].count);

    res.json({
      rooms: result.rows,
      page,
      limit,
      totalRooms,
      totalPages: Math.ceil(totalRooms / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

export default router;