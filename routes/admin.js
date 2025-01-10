const router = require('express').Router();
const adminController = require('../controllers/admincontroller');
const { verifyToken, checkRole } = require('../middleware/verifyUser');  // Import JWT middleware

// Show all active users
router.get('/users', verifyToken, adminController.getUsers);

// Get info of a specific user by ID (Accessible by admin and user itself)
router.get('/userInfo/:id', verifyToken, checkRole(['admin', 'user']), adminController.getUserInfo);

// Update user information
router.post('/updateUserInfo/:id', verifyToken, checkRole(['admin']), adminController.updateUser);

// Update user status (active/suspended)
router.post('/updateUserStatus/:id', verifyToken, checkRole(['admin']), adminController.updateStatus);

// Archive a user
router.post('/archiveUser/:id', verifyToken, checkRole(['admin']), adminController.archiveUser);

// Get all archived users
router.get('/archivedUsers', verifyToken, checkRole(['admin']), adminController.getArchivedUsers);

// Restore user from archive
router.post('/restoreUser/:id', verifyToken, checkRole(['admin']), adminController.restoreUserFromArchive);

// Permanently delete an archived user
router.post('/deleteArchivedUser/:id', verifyToken, checkRole(['admin']), adminController.deleteArchivedUser);

module.exports = router;
