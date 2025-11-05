import type { Request, Response } from "express";
import * as bcrypt from "bcrypt-ts";
import * as jwt from "jsonwebtoken";
import User from "../models/User.ts";
import { generateJti, generateToken } from "../utils/jwtUtils.ts";
import Session from "../models/Session.ts";
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    name: firstName + " " + lastName,
    email: req.body.email,
    passwordHash,
  });

  try {
    const newUser = await user.save();
    res.status(201).json({ status: true, newUser });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
export const loginUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const jti = generateJti();

    const user: any = await User.findOne({ email: email });
    const payload = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      type: user.type, // if exists
      jti,
    };
    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (isPasswordValid) {
        const accessToken = generateToken(
          payload,
          process.env.JWT_ACCESS_SECRET!,
          process.env.ACCESS_TOKEN_EXPIRY!
        );
        const refreshToken = generateToken(
          payload,
          process.env.JWT_REFRESH_SECRET!,
          process.env.REFRESH_TOKEN_EXPIRY!
        );
        const userId = user._id;
        // 2. Save Session details (including JTI and expiry)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Example: 7 days from now
        await Session.create({ userId, jti, expiresAt });

        // 3. Send refresh token in secure HTTP-only cookie
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure:
            process.env.NODE_ENV === "production" ||
            process.env.NODE_ENV === "development", // Use secure cookies in production
          sameSite: "strict",
          expires: expiresAt,
        });
        res
          .status(200)
          .json({ status: true, message: "Login successful", accessToken });
      } else {
        res.status(400).json({ status: false, message: "Invalid password" });
      }
    } else {
      res.status(400).json({ status: false, message: "User not found" });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ status: false, message: err });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).send("Refresh Token Required");
  }

  try {
    // 1. Verify the old refresh token
    const decoded: any = jwt.verify(
      oldRefreshToken,
      process.env.JWT_REFRESH_SECRET!
    );
    const { _id, jti } = decoded.payload.user;

    // 2. Check the session record in DB
    const session = await Session.findOne({ userId: _id, jti });

    if (!session || session.revoked || session.expiresAt < new Date()) {
      return res.status(401).send("Invalid or expired session");
    }

    // Optional: Revoke the old session immediately to enforce one-time use
    // await Session.updateOne({ jti }, { revoked: true });
    // If you do this, you must generate a new JTI below.

    // 3. Generate NEW tokens and NEW JTI (if you chose to revoke the old JTI)
    const newJti = generateJti(); // Use new JTI to invalidate old tokens
    const accessToken = generateToken(
      decoded.payload.user as {
        _id: string;
        email: string;
        name: string;
        type: string;
        jti: string;
      },
      process.env.JWT_ACCESS_SECRET!,
      process.env.ACCESS_TOKEN_EXPIRY!
    );
    const newRefreshToken = generateToken(
      decoded.payload.user as {
        _id: string;
        email: string;
        name: string;
        type: string;
        jti: string;
      },
      process.env.JWT_REFRESH_SECRET!,
      process.env.REFRESH_TOKEN_EXPIRY!
    );
    // 4. Create new session record and delete old one
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.deleteOne({ jti }); // Delete the old session
    await Session.create({ userId: _id, jti: newJti, expiresAt }); // Create the new one

    // 5. Set the new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: expiresAt,
    });

    res.status(200).json({ accessToken });
  } catch (error) {
    // Handle specific JWT errors
    return res.status(403).send("Forbidden: Token validation failed");
  }
};


export const logoutUser = async (req: any , res: Response) => {
    console.log("Logout endpoint called",req);
  const refreshToken = req.cookie?.refreshToken;
  if (refreshToken) {
    try {
      const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
      const { jti } = decoded;

      // Invalidate the specific session in the database
      await Session.updateOne({ jti }, { revoked: true });
    } catch (error) {
      // If the token is invalid/expired, we just proceed to clear the cookie
      console.log("Logout: Invalid token provided, clearing cookie.");
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      return res.status(200).send({status:true,message:'Logged out successfully'});
    }
  }

  // Clear the cookie client-side
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(200).send({status:true,message:'Logged out successfully'});
}
