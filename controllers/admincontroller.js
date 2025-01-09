const User = require('../models/user');
const ArchivedUser = require('../models/user_archive');

// Get all users (active users)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user information by ID
exports.getUserInfo = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user information', error });
  }
};

// Update user information
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const { googleId, name, email, profilePicture, status, roles, coursesCreated, testCreated, coursesEnrolled, createdDate } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, {
      googleId, name, email, profilePicture, status, roles, coursesCreated, testCreated, coursesEnrolled, createdDate
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Update user status (active/suspended)
exports.updateStatus = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'suspended' ? 'active' : 'suspended';
    await user.save();
    res.json({ message: `User status updated to ${user.status}`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating status', error });
  }
};

// Archive a user
exports.archiveUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const archivedUser = new ArchivedUser({
      _id: user._id,
      googleId: user.googleId,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      status: user.status,
      roles: user.roles,
      coursesCreated: user.coursesCreated,
      testCreated: user.testCreated,
      coursesEnrolled: user.coursesEnrolled,
      createdDate: user.createdDate,
      archived_at: new Date(),
    });

    await archivedUser.save();
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User archived successfully', archivedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error archiving user', error });
  }
};

// Get all archived users
exports.getArchivedUsers = async (req, res) => {
  try {
    const archivedUsers = await ArchivedUser.find();
    res.json({ archivedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching archived users', error });
  }
};

// Restore user from archive
exports.restoreUserFromArchive = async (req, res) => {
  const archivedUserId = req.params.id;

  try {
    const archivedUser = await ArchivedUser.findById(archivedUserId);
    if (!archivedUser) {
      return res.status(404).json({ message: 'Archived user not found' });
    }

    const restoredUser = new User({
      ...archivedUser.toObject(),
      archived_at: undefined,
    });

    await restoredUser.save();
    await ArchivedUser.findByIdAndDelete(archivedUserId);

    res.json({ message: 'User restored from archive', restoredUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error restoring user from archive', error });
  }
};

// Delete an archived user permanently
exports.deleteArchivedUser = async (req, res) => {
  const archivedUserId = req.params.id;

  try {
    const deletedUser = await ArchivedUser.findByIdAndDelete(archivedUserId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Archived user not found' });
    }
    res.json({ message: 'Archived user deleted permanently' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting archived user', error });
  }
};
