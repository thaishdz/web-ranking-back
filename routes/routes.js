let express = require('express');
let router = express.Router();

let userController = require("../controllers/userController");
let adminController = require("../controllers/adminController");

/**
 * Regatistas
 */
router.get('/regatistas', userController.getUsers);
router.get('/regatistas/:_id', userController.getUsersByAffiliate);
router.get('/regatista', userController.getUsersByName);    // Search by name /regatista?name=
router.get('/regatista-club', userController.getUsersByClub);

/**
 * Administradores
 */
router.post('/auth/login', adminController.loginAdmin);
router.post('/auth/signup', adminController.signUpAdmin);


module.exports = router;