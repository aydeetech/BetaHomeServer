const Property = require("../models/property");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

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

    fs.unlinkSync(req.files.avatar.tempFilePath);

    // IMAGES upload
    const ImagesUploadPromises = images.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        use_filename: true,
        folder: "betahome",
      });

      fs.unlinkSync(image.tempFilePath)

      return result.secure_url;
    });

    const uploadedImages = await Promise.all(ImagesUploadPromises);

    // Video Upload

    const videoResult = await cloudinary.uploader.upload(video, {
      resource_type: "video",
      folder: "betahomevideos",
    });

    fs.unlinkSync(req.files.video.tempFilePath);

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
const {location, type, bedroom, sort} = req.query;

const queryObject = {}
let result = Property.find(queryObject)
if (location) {
  queryObject.location = {$regex: location, $options: "i"}
}

if(type) {
  queryObject.propertyType = {$regex: type, $options: "i"}
}

if (bedroom) {
  queryObject.bedroom = {$eq: bedroom}
}
if(sort){
  result = result.sort(`${sort} -createdAt`)
}else{
  result.sort('-createdAt')
}
result = result.find(queryObject)
const properties = await result

  res.status(200).json({success: true, properties})
};

const handleGetRecentProperties = async (req, res) => {
  const recentProperties = await Property.find().sort("-createdAt").limit(3);
  res.status(200).json({success: true, properties: recentProperties});
};

const handleEditProperty = async (req, res) => {
  const { propertyId } = req.params;
  const {
    title,
    location,
    price,
    propertyType,
    description,
    tags,
    propertyStatus,
    bedroom,
    bathroom,
    garage,
    squareFeet,
    name,
    phoneNumber,
    whatsappNumber,
  } = req.body;

  try {
    // Check if the property exists
    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found" });
    }

    // Update fields
    existingProperty.title = title ?? existingProperty.title;
    existingProperty.location = location ?? existingProperty.location;
    existingProperty.price = price ?? existingProperty.price;
    existingProperty.propertyType =
      propertyType ?? existingProperty.propertyType;
    existingProperty.description = description ?? existingProperty.description;
    existingProperty.tags = tags ?? existingProperty.tags;
    existingProperty.propertyStatus =
      propertyStatus ?? existingProperty.propertyStatus;
    existingProperty.bedroom = bedroom ?? existingProperty.bedroom;
    existingProperty.bathroom = bathroom ?? existingProperty.bathroom;
    existingProperty.garage = garage ?? existingProperty.garage;
    existingProperty.squareFeet = squareFeet ?? existingProperty.squareFeet;

    // Update sales support information
    existingProperty.salesSupport = {
      name: name ?? existingProperty.salesSupport.name,
      phoneNumber: phoneNumber ?? existingProperty.salesSupport.phoneNumber,
      whatsappNumber:
        whatsappNumber ?? existingProperty.salesSupport.whatsappNumber,
    };

    // Check if there is a new avatar
    if (req.files?.avatar) {
      const newAvatarResult = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        {
          use_filename: true,
          folder: "betahome",
        }
      );
      fs.unlinkSync(req.files.avatar.tempFilePath);

      // Update existing avatar with new one
      existingProperty.salesSupport.avatar = newAvatarResult.secure_url;
    }

    // Check if there are new images
    if (req.files?.images && req.files.images.length > 0) {
      const newImagesUploadPromises = req.files.images.map(async (image) => {
        const result = await cloudinary.uploader.upload(image.tempFilePath, {
          use_filename: true,
          folder: "betahomevideos",
        });
        fs.unlinkSync(image.tempFilePath);
        return result.secure_url;
      });
      const newImages = await Promise.all(newImagesUploadPromises);

      // Update existing images with new ones
      existingProperty.media.images = [...newImages];
    }

    // Check if there is a new video
    if (req.files?.video) {
      const newVideoResult = await cloudinary.uploader.upload(
        req.files.video.tempFilePath,
        {
          resource_type: "video",
          folder: "betavideos",
        }
      );
      fs.unlinkSync(req.files.video.tempFilePath);

      // Update existing video with new one
      existingProperty.media.video = newVideoResult.secure_url;
    }

    // Save changes to the database
    await existingProperty.save();

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: existingProperty,
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ success: false, message: "Failed to update property", error });
  }
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

const handleFeaturedProperties = async (req, res) => {
  try {
    const housedProperties = await Property.find({propertyType: "house"}).sort('-createdAt').limit(3)
  const landedProperties = await Property.find({propertyType: "land"}).sort('-createdAt').limit(3)

  const featuredproperties = [...housedProperties, ...landedProperties]
  res.status(200).json({success: true, featuredproperties})
  }
  catch (error) {
    console.log(error);
    res.json(error)
  }
}

module.exports = {
  handleAddProperty,
  handleGetAllProperties,
  handleGetRecentProperties,
  handleGetASingleProperty,
  handleEditProperty,
  handleDeleteProperty,
  handleFeaturedProperties
};
