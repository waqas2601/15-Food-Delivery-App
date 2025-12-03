import mongoose from "mongoose";

const restaurantModel = new mongoose.Schema({
  name: String,
  email: String,
  pass: String,
  restoName: String,
  city: String,
  adress: String,
  phone: String,
});
export const restaurantSchema =
  mongoose.models.restaurants || mongoose.model("restaurants", restaurantModel);
