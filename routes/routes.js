let express = require('express');
let router = express.Router();

let userController = require("../controllers/userController");
let adminController = require("../controllers/adminController");

/**
 * Regatistas
 */
router.get('/regatistas', userController.getUsers);
router.get('/regatista', userController.getUsersByNameSurname); 
router.get('/regatistas/:_id', userController.getUsersByAffiliate);
router.post('/regatistas', userController.createUser);
router.patch('/regatista/:_id', userController.updateUser);

/**
 * Administradores
 */
router.post('/auth/login', adminController.loginAdmin);
router.post('/auth/signup', adminController.signUpAdmin);
router.post('/auth/forgot_password', adminController.forgot_password);
router.post('/auth/reset_password', adminController.reset_password);
router.get('/auth/reset_password', adminController.render_reset_password_template);
       

module.exports = router;