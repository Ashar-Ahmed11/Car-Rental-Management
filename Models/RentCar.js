const mongoose = require('mongoose');

const rentCarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // Main Rent Car Fields
  cnic: { type: String, required: true },
  reference: { type: String },
  carNumber: { type: String, required: true },
  fuelAmount: { type: String },
  carMileage: { type: String },
  location: { type: String, enum: ['Within City', 'Out Of City'], required: true },

  // Payment Section
  payment: {
    mode: { type: String, enum: ['Cheque', 'Online', 'Cash'], required: true },

    cheque: {
      chequeNumber: { type: String },
      chequePicture: { type: String },
      paymentAmount: { type: String },
      bankName: { type: String }
    },

    online: {
      transactionId: { type: String },
      screenshot: { type: String },
      paymentAmount: { type: String },
      bankName: { type: String }
    },

    cash: {
      receiverName: { type: String },
      receiptImage: { type: String },
      paymentAmount: { type: String }
    }
  },

  // Attachments
  attachments: {
    selfiePicture: { type: String },
    carPicture: { type: String },
    cnicCopy: { type: String },
    receiptImage: { type: String }
  },

  // Car Details
  carDetails: {
    wheelCaps: { present: Boolean, remarks: String },
    footmats: { present: Boolean, remarks: String },
    airpress: { present: Boolean, remarks: String },
    cleaningCloth: { present: Boolean, remarks: String },
    airConditioner: { present: Boolean, remarks: String },
    lights: { present: Boolean, remarks: String },
    jackRod: { present: Boolean, remarks: String },
    spanner: { present: Boolean, remarks: String },
    stepny: { present: Boolean, remarks: String },
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RentCar', rentCarSchema);