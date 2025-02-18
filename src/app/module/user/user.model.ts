import { Schema, model } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    profileImg: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

// password hashing
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.name && user.email) {
    const emailParts = user.email.split("@");
    user.name = emailParts[0];
  }
  user.password = await bcrypt.hash(user.password, 10);
  next();
});

// // set '' after saving password
// userSchema.post("save", function (doc, next) {
//   doc.password = "";
//   next();
// });

// Static method to check if a user exists by
userSchema.statics.isUserExitsByEmail = async function (email: string) {
  return await User.findOne({ email });
};
// Static method to check if the password matches
userSchema.statics.isPasswordMatched = async function (
  palinTextPassword,
  hashedTextPassword
) {
  return await bcrypt.compare(palinTextPassword, hashedTextPassword);
};
export const User = model<TUser, UserModel>("User", userSchema);
