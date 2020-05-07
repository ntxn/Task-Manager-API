const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const errorHandler = require('../middleware/errorHandler');
const userController = require('../controllers/userController');

const router = new express.Router();

router.post('/', userController.createUser);
router.post('/login', userController.login);
router.get('/:id/avatar', userController.getUserAvatar);

router.use(auth);

router.post('/logout', userController.logout);
router.post('/logoutAll', userController.logoutAll);

router
  .route('/me')
  .get(userController.getProfile)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router
  .route('/me/avatar')
  .get(userController.getAvatar)
  .post(upload.single('avatar'), userController.uploadAvatar, errorHandler)
  .delete(userController.deleteAvatar);

module.exports = router;
