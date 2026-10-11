import mongoose from 'mongoose';

const staticDataSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, { timestamps: true });

export default mongoose.models.StaticData || mongoose.model('StaticData', staticDataSchema);
