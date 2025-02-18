import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { LoginInfo, TUser } from "./user.interface";
import { User } from "./user.model";
import jwt from "jsonwebtoken";
import config from "../../config";
import { verifyToken } from "./user.constant";

const createUser = async (payload: TUser) => {
  // Check if user already exists
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists");
  }

  // create new user
  const newUser = new User(payload);

  await newUser.save();
  return newUser;
};

const createSignIn = async (payload: LoginInfo) => {
  // check if user not found
  const user = await User.isUserExitsByEmail(payload.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  // check password matched
  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, "Password do not matched!!");
  }

  // create token send to the client
  const jwtPayload = {
    userId: user?._id,
    name: user?.name,
    email: user?.email,
    role: user?.role,
  };

  const createToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    { expiresIn: "10d" }
  );

  return { user, accessToken: createToken, refreshToken: refreshToken };
};
const refreshTokenIntoDB = async (token: string) => {
  // check if the token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { userEmail } = decoded;
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!!");
  }
  const jwtPayload = {
    userId: user._id,
    userEmail: user.email,
    name: user.name,
    image: user.profileImg,
    role: user.role,
  };
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "10m",
  });
  return {
    accessToken,
  };
};

export const userService = {
  createUser,
  createSignIn,
  refreshTokenIntoDB,
};
