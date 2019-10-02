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
router.post('/regatistas', userController.createUser);

/**
 * Administradores
 */
router.post('/auth/login', adminController.loginAdmin);
router.post('/auth/signup', adminController.signUpAdmin);

router.post('/auth/forgot_password', adminController.forgot_password);

router.post('/auth/reset_password', adminController.reset_password);
router.get('/auth/reset_password', adminController.render_reset_password_template);



module.exports = router;