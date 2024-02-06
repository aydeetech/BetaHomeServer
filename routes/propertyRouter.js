const router = require("express").Router();
const {
  handleAddProperty,
  handleDeleteProperty,
  handleEditProperty,
  handleGetASingleProperty,
  handleGetAllProperties,
  handleGetRecentProperties,
  handleFeaturedProperties,
} = require("../controllers/propertyController");

router
  .route("/")
  .get(handleGetAllProperties)
  .post(handleAddProperty);
router.route("/recent").get(handleGetRecentProperties);

router.get("/featured", handleFeaturedProperties)
router
  .route("/:propertyId")
  .get(handleGetASingleProperty)
  .patch(handleEditProperty)
  .delete(handleDeleteProperty);

module.exports = router;
