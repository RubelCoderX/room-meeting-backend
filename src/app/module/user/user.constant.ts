export const USER_ROLE = {
  user: "user",
  admin: "admin",
} as const;

import jwt, { JwtPayload } from "jsonwebtoken";
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
