const Property = require("../models/property");
const cloudinary = require("cloudinary").v2;

const handleAddProperty = async (req, res) => {
  const {
    title,
    location,
    price,
    description,
    tags,
    propertyStatus,
    propertyType,
    bedroom,
    bathroom,
    squareFeet,
    garage,
    lot,
    name,
    phoneNumber,
    whatsappNumber,
  } = req.body;

  const video = req.files.video.tempFilePath;
  const images = req.files.images;
  const avatar = req.files.avatar.tempFilePath;

  try {
    // avatar upload
    const avatarResult = await cloudinary.uploader.upload(avatar, {
      use_filename: true,
      folder: "betahome",
    });

    // IMAGES upload
    const ImagesUploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: "betahome",
      });

      return result.secure_url;
    });

    const uploadedImages = await Promise.all(ImagesUploadPromises);

    // Video Upload

    const videoResult = await cloudinary.uploader.upload(video, {
      resource_type: "video",
      folder: "betahomevideos",
    });

    // Set up media

    const media = {
      images: [...uploadedImages],
      video: videoResult.secure_url,
    };

    // set up salesSupport
    const salesSupport = {
      name,
      phoneNumber,
      whatsappNumber,
      avatar: avatarResult.secure_url,
    };

    const property = await Property.create({
    title,
    location,
    price,
    description,
    tags,
    lot,
    propertyStatus,
    propertyType,
    bedroom,
    bathroom,
    squareFeet,
    garage,
    media,
    salesSupport
    })
    res.status(201).json({success: true, property});
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const handleGetAllProperties = async (req, res) => {
  const properties = await Property.find().sort("-createdAt");
  res.status(200).json({success: true, properties})
};

const handleGetRecentProperties = async (req, res) => {
  const recentProperties = await Property.find().sort("-createdAt").limit(3);
  res.status(200).json({success: true, properties: recentProperties});
};

const handleEditProperty = async (req, res) => {
  res.send("Update a property");
};

const handleDeleteProperty = async (req, res) => {
  const {propertyId} = req.params

  try {
    await Property.findByIdAndDelete({_id: propertyId})
    res.status(200).json({message: 'Property Deleted Successfully', success: true})
  } catch (error) {
    console.log(error);
    res.json(error)
  }
};

const handleGetASingleProperty = async (req, res) => {
  const {propertyId} = req.params

  try {
    const property = await Property.findById({_id: propertyId})
    const propertyType = property.propertyType
    const similarProperties = await Property.find({propertyType}).limit(3)
    
    res.status(200).json({success: true, property, similarProperties})
  } catch (error) {
    console.log(error);
    res.json(error)
  }
};

module.exports = {
  handleAddProperty,
  handleGetAllProperties,
  handleGetRecentProperties,
  handleGetASingleProperty,
  handleEditProperty,
  handleDeleteProperty,
};
