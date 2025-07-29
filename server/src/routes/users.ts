import userController from '../controllers/userController';
import express from 'express';
const router = express.Router();

router.get('/', userController.getAllUsers);         // GET /users
router.get('/:id', userController.getUserById);      // GET /users/:id
router.post('/', userController.createUser);         // POST /users
router.put('/:id', userController.updateUser);       // PUT /users/:id
router.delete('/:id', userController.deleteUser);    // DELETE /users/:id

module.exports = router;