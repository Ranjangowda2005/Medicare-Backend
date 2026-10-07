import diseaseModel from "../model/diseaseModel.js";

export const createDisease = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a disease image",
      });
    }

    const {
      title,
      shortDescription,
      overview,
      symptoms,
      causes,
      prevention,
      treatment,
    } = req.body;

    const disease = await diseaseModel.create({
      title,
      shortDescription,
      overview,
      symptoms: symptoms ? [symptoms] : [],
      causes: causes ? [causes] : [],
      prevention: prevention ? [prevention] : [],
      treatment: treatment ? [treatment] : [],
      image: req.file.filename,
    });

    res.status(201).json({
      success: true,
      message: "Disease added successfully",
      disease,
    });
  } catch (error) {
    console.log("Create disease Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDiseases = async (req, res) => {
  try {
    const diseases = await diseaseModel.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, diseases });
  } catch (error) {
    console.log("Get Diseases Error:", error);

    res.status(500).json({ success: true, message: "Unable to get diseases" });
  }
};
  
export const getDiseaseById = async (req, res) => {
  try {
    const disease = await diseaseModel.findById(req.params.id);

    if (!disease) {
      return res
        .status(404)
        .json({ success: false, message: "Disease not found" });
    }
    res.json({ success: true, disease });
  } catch (error) {
    console.log("Get diseases Error");
    res.status(500).json({ success: false, message: "Unable to get disease" });
  }
};

export const updateDisease = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      overview,
      symptoms,
      causes,
      prevention,
      treatment,
    } = req.body;

    const updateData = {
      title,
      shortDescription,
      overview,
      symptoms: symptoms ? [symptoms] : [],
      causes: causes ? [causes] : [],
      prevention: prevention ? [prevention] : [],
      treatment: treatment ? [treatment] : [],
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const disease = await diseaseModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: "Disease not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Disease updated successfully",
      disease,
    });
  } catch (error) {
    console.log("Update disease Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDisease = async (req, res) => {
  try {
    const disease = await diseaseModel.findByIdAndDelete(req.params.id);

    if (!disease) {
      return res.status(404).json({
        success: false,
        message: "Disease not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Disease deleted successfully",
    });
  } catch (error) {
    console.log("Delete disease Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
