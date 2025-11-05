import { verifyToken } from "../utils/jwtUtils.ts";
import type { Request, Response } from 'express';

export const authenticateToken = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer TOKEN"

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    const decodedUser = verifyToken(token);
    if (!decodedUser) {
      return res.sendStatus(403); // Forbidden (invalid token)
    }
    (req as any).user = decodedUser;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'jwt expired' });
    }
    return res.sendStatus(403);
  }
};