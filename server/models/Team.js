import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'équipe est requis'],
    trim: true,
    unique: true,
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Les points ne peuvent pas être négatifs']
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'disqualified'],
    default: 'active'
  },
  color: {
    type: String,
    default: '#3B82F6' // Blue default
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Team', teamSchema);



