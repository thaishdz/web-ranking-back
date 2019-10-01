let express = require('express');
let router = express.Router();

let userController = require("../controllers/userController.js");

router.get('/regatistas', userController.getUsers);
router.get('/regatistas/:_id', userController.getUsersByAffiliate);
router.get('/regatista', userController.getUsersByNameSurname);  




router.patch('/regatista/:_id', userController.updateUser);       

module.exports = router;