const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('foto'); 

const userController = require('../controllers/userController');

// Rutas existentes
router.post('/register', userController.register);  
router.post('/login', userController.login); 
router.get('/getusers', userController.getUsers);  
router.post('/create', upload, userController.createUser); 
router.put('/update', upload, userController.updateUser);   
router.delete('/delete/:id', userController.deleteUser);

// Nuevas rutas para ver perfil de otros usuarios
router.get('/profile/:id', userController.getUserProfile);
router.post('/follow/:followerId', userController.followUser);
router.post('/unfollow/:followerId', userController.unfollowUser);

module.exports = router;