const Inspection = require("../models/inspection");

const createInspection = async (req, res) => {
  try {
    const inspection = await Inspection.create({ ...req.body });
    res.status(201).json({ success: true, inspection });
  } catch (error) {
    console.log(error);
  }
};

const getAllInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find().sort("-createdAt");
    res.status(200).json({ success: true, inspections });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: "Internal Server Error" });
  }
};

module.exports = { createInspection, getAllInspections };
