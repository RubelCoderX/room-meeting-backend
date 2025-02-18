import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TUser = {
  name: string;
  email: string;
  password: string;
  profileImg: string;
  address: string;
  role: "user" | "admin";
};

export type LoginInfo = {
  email: string;
  password: string;
};

export interface UserModel extends Model<TUser> {
  isUserExitsByEmail(email: string): Promise<TUser>;
  isPasswordMatched(
    palinTextPassword: string,
    hashedTextPassword: string
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
