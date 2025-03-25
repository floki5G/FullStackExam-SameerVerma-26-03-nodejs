// const mongoose = require('mongoose');
import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a product price'],
    min: [0, 'Price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['electronics', 'clothing', 'books', 'home', 'beauty', 'sports', 'other']
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  imageUrl: {
    type: String,
    default: 'default-product.jpg'
  },
  featured: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5']
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search functionality
productSchema.index({ name: 'text', description: 'text' });

// Add index on category for faster queries
productSchema.index({ category: 1 });

// Method to get sales by category
productSchema.statics.getSalesByCategory = async function() {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        averagePrice: { $avg: '$price' },
        totalStock: { $sum: '$stock' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
  
  return result;
};

// Method to search products
productSchema.statics.searchProducts = async function(query, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const result = await this.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
  .sort({ score: { $meta: 'textScore' } })
  .skip(skip)
  .limit(limit);
  
  const total = await this.countDocuments({ $text: { $search: query } });
  
  return {
    products: result,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
};

const Product = mongoose.model('Product', productSchema);
  
export default Product;