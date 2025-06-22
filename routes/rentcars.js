const express = require('express');
const router = express.Router();
const RentCar = require('../Models/RentCar'); 
const authenticateUser = require('../middleware/authenticateUser');
const { body, validationResult } = require('express-validator');

// authenticateUser


router.post(
  '/create-rentacars',
  authenticateUser,
  [
    body('cnic').notEmpty().withMessage('CNIC is required'),
    body('reference').notEmpty().withMessage('Reference is required'),
    body('carNumber').notEmpty().withMessage('Car number is required'),
    body('fuelAmount').notEmpty().withMessage('Fuel amount is required'),
    body('carMileage').notEmpty().withMessage('Car mileage is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('payment').notEmpty().withMessage('Payment object is required'),
    body('attachments').notEmpty().withMessage('Attachments object is required'),
    body('carDetails').notEmpty().withMessage('Car details are required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const {
        cnic,
        reference,
        carNumber,
        fuelAmount,
        carMileage,
        location,
        payment,
        attachments,
        carDetails,
      } = req.body;

      const rentCar = new RentCar({
        user: req.user.id,
        cnic,
        reference,
        carNumber,
        fuelAmount,
        carMileage,
        location,
        payment,
        attachments,
        carDetails,
      });

      await rentCar.save();
      res.status(201).json({
        success: true,
        message: 'Car rented successfully',
        data: rentCar,
      });
    } catch (error) {
      console.error('Error creating rent car entry:', error);
      res
        .status(500)
        .json({ success: false, message: 'Server Error', error: error.message });
    }
  }
);



router.get("/all-cars", async (req, res) => {
  try {
    const allCars = await RentCar.find();

    if (!allCars || allCars.length === 0) {
      return res.status(404).json({ message: "No cars found" }); 
    }
    res.status(200).json({ success: true, allCars }); 
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});



router.get("/user-cars", authenticateUser , async (req, res) => {
  try {
    const allCars = await RentCar.find({user: req.user.id});

    if (!allCars || allCars.length === 0) {
      return res.status(404).json({ message: "No cars found" }); 
    }

    res.status(200).json({ success: true, allCars }); 
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});




router.put("/update-cars/:id", authenticateUser, async (req, res) => {
  const carId = req.params.id;

  try {
    
    let car = await RentCar.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    
    // if (car.user.toString() !== req.user.id)
    //   return res.status(403).json({ success: false, message: "Unauthorized" });

    
    req.body.user = req.user.id;
    const updatedCar = await RentCar.findByIdAndUpdate(carId, req.body, { new: true });

    res.status(200).json({ success: true, car: updatedCar });

  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});




// routes/rent.js
router.delete("/delete-cars/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const car = await RentCar.findById(carId);
    if (!car) return res.status(404).json({ success: false, message: "Car not found" });

    

    await RentCar.findByIdAndDelete(carId); // ✅ actual deletion

    res.status(200).json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error); // Log the real issue
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});







module.exports = router;
