const router = require('express').Router();
const adminc = require('../controllers/admincontroller');

// Show all active users
router.get('/users', adminc.getUsers);

// Update user information
router.post('/updateUserInfo/:id', adminc.updateUser);

// Update user status (suspended/active)
router.post('/updateUserStatus/:id', adminc.updateStatus);

// Archive a user
router.post('/archiveUser/:id', adminc.archiveUser);

// Show all archived users
router.get('/archivedUsers', adminc.getArchivedUsers);

// Restore user from archive to active
router.post('/restoreUser/:id', adminc.restoreUserFromArchive);

// Permanently delete an archived user
router.post('/deleteArchivedUser/:id', adminc.deleteArchivedUser);

module.exports = router;
