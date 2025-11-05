import  jwt from 'jsonwebtoken';
import type { Secret, JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Define a type for your custom payload data
interface UserPayload extends JwtPayload {
  _id: string;
  email: string;
  name: string;
}
export const generateJti = () => uuidv4();
 const SECRET_KEY: Secret = process.env.JWT_ACCESS_SECRET || 'fallback_secret'; // Use a fallback or throw an error if missing
// const expiresIn:any=process.env.JWT_EXPIRES_IN||'1d';
export const generateToken = (payload: { _id: string, email: string,name:string,type:string,jti:string },secret:any,expiresIn:any): string => {
  const token = jwt.sign(payload, secret, {
    expiresIn:expiresIn, // Token expires in 1 day
  });
  return token;
};

export const verifyToken = (token: string): UserPayload | undefined => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
    return decoded;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw error; // Let middleware handle expired token
    }
    console.error('JWT verification failed:', error);
    return undefined;
  }
};