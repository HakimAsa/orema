import Joi from 'joi';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      unique: true,
      index: true,
      trim: true,
      sparse: true,
      maxlength: 50,
      time: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      trim: true,
    },
    reviews: [reviewSchema],
    reviewRates: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    totalReview: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    weight: {
      type: Number,
      required: true,
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
      default: 0,
    },
    pLength: {
      type: Number,
      required: true,
      default: 0,
    },
    pWidth: {
      type: Number,
      required: true,
      default: 0,
    },
    pHeight: {
      type: Number,
      required: true,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    dimensions: {
      type: String,
      required: true,
      default: '10 x 14.9 x 22', //inches
    },
    brand: {
      type: String,
      required: true,
    },
    category: { type: String, required: true },
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

function validateProduct(product, isRequired = true) {
  const schema = Joi.object({
    name: isRequired
      ? Joi.string().min(5).max(50).required()
      : Joi.string().min(5).max(50),
    description: isRequired
      ? Joi.string().min(5).max(255).required()
      : Joi.string().min(5).max(255),
    dimensions: isRequired
      ? Joi.string().min(5).max(25).required()
      : Joi.string().min(5).max(25),
    reviewRates: isRequired
      ? Joi.number().min(0).max(5).required()
      : Joi.number().min(0).max(5),
    price: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    weight: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    pLength: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    pWidth: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    pHeight: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    capacity: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    countInStock: isRequired
      ? Joi.number().min(0).required()
      : Joi.number().min(0),
    totalReview: isRequired
      ? Joi.number().min(0).required()
      : Joi.number().min(0),
    likes: isRequired ? Joi.number().min(0).required() : Joi.number().min(0),
    category: isRequired ? Joi.string().required() : Joi.string(),
    brand: isRequired ? Joi.string().required() : Joi.string(),
  });

  return schema.validate(product);
}

export { Product, validateProduct as validate };
