const { Schema, model } = require("mongoose");
const Joi = require("joi");

const STATUS_SUBSCRIPTION = {
  STARTER: "starter",
  PRO: "pro",
  BUSINESS: "business",
};

const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
// номер телефону у форматі хххххххххххх
const regexPhone = /\+[0-9]{2}[0-9]{3}[0-9]{7}/;

// Валідатор даних на сервері
const schemaDBUserValidator = new Schema(
  {
    userName: {
      type: String,
      maxlentgth: 16,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: regexEmail,
    },
    birthday: {
      type: Date,
      default: new Date(0), // 1 січня 1970 року
    },
    phone: {
      type: String,
      default: "",
      match: regexPhone,
    },
    avatarURL: String,
    token: { type: String, default: "" },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

const User = model("user", schemaDBUserValidator);

// Валідатори отриманих з клієнта даних
const userValidator = Joi.object({
  password: Joi.string().min(3).required(),
  email: Joi.string().pattern(regexEmail).required(),
});

const userSubscriptionValidator = Joi.object({
  subscription: Joi.valid(...Object.values(STATUS_SUBSCRIPTION)).required(),
});

const userEmailValidator = Joi.object({
  email: Joi.string().pattern(regexEmail).required(),
});

const schemas = {
  userValidator,
  userSubscriptionValidator,
  userEmailValidator,
};

module.exports = { schemas, User };
