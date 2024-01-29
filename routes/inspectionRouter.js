const router = require('express').Router()
const {createInspection, getAllInspections} = require('../controllers/inspectionController')
const { authentication, requirePermission } = require('../middleware/auth')

router.route("/inspection").get(authentication, requirePermission("admin"), getAllInspections).post(authentication, createInspection)

module.exports = router