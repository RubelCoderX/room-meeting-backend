import express from "express";
import validateRequest from "../../mddleware/validateRequest";
import { userValidationSchema } from "./user.validation";
import { userController } from "./user.controller";
const route = express.Router();

route.post(
  "/signup",
  validateRequest(userValidationSchema),
  userController.signUp
);
route.post("/login", userController.signIn);
export const userRoute = route;
