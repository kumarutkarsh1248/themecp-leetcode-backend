const express = require("express");
const router = express.Router();
const { addUser, getProfileName, saveProfileName } = require("../controllers/userController");

router.post("/add_user", addUser);
router.post("/save_profile_name", saveProfileName);
router.get("/get_profile_name", getProfileName);
// router.post("/remove_user", addUser);

module.exports = router;