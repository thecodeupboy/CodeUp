const userTable = require('../models/user');
const ArchivedUser = require('../models/user_archive');  

// Get User Info
exports.getUserInfo = async (req, res) => {
  const id = req.params.id; // Get user ID from request parameters

  try {
    // Find the user by ID
    const user = await userTable.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the user details
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving user information', error });
  }
};
 
// Show all active users
exports.getUsers = async (req, res) => {
  try {
    const data = await userTable.find();
    res.json({ users: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Update User Info
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const {
    googleId,
    name, 
    email, 
    profilePicture,
    status,
    roles,
    coursesCreated,
    testCreated,
    coursesEnrolled,
    createdDate
  } = req.body;

  try {
    // Using `findByIdAndUpdate` to update all fields dynamically.
    const updatedUser = await userTable.findByIdAndUpdate(
      id, 
      {
        googleId: googleId,
        name: name,
        email: email,
        profilePicture: profilePicture,
        status: status,
        roles: roles,
        coursesCreated: coursesCreated,
        testCreated: testCreated,
        coursesEnrolled: coursesEnrolled,
        createdDate: createdDate
      } 
    );

    updatedUser.save();
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user', error });
  }
};


// Update user status (suspended/active)
exports.updateStatus = async (req, res) => {
  const id = req.params.id;
  
  try {
    const data = await userTable.findById(id);
    let userStatus = data.status;

    if (userStatus === 'suspended') {
      userStatus = 'active';
    } else {
      userStatus = 'suspended';
    }

    await userTable.findByIdAndUpdate(id, { status: userStatus });
    res.json({ message: 'User status updated successfully', status: userStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating status', error });
  }
};

// Archive a user (move to archived_users table)
exports.archiveUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await userTable.findById(userId);

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
    await userTable.findByIdAndDelete(userId);

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

// Restore an archived user to normal (active users table)
exports.restoreUserFromArchive = async (req, res) => {
  const archivedUserId = req.params.id;

  try {
    const archivedUser = await ArchivedUser.findById(archivedUserId);

    if (!archivedUser) {
      return res.status(404).json({ message: 'Archived user not found' });
    }

    const restoredUser = new userTable({
      _id: req.params.id,
      googleId: archivedUser.googleId,
      name: archivedUser.name,
      email: archivedUser.email,
      profilePicture: archivedUser.profilePicture,
      status: archivedUser.status,
      roles: archivedUser.roles,
      coursesCreated: archivedUser.coursesCreated,
      testCreated: archivedUser.testCreated,
      coursesEnrolled: archivedUser.coursesEnrolled,
      createdDate: archivedUser.createdDate,
    });

    await restoredUser.save();
    await ArchivedUser.findByIdAndDelete(archivedUserId);

    res.json({ message: 'User restored successfully', restoredUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error restoring user from archive', error });
  }
};

// Permanently delete an archived user
exports.deleteArchivedUser = async (req, res) => {
  const archivedUserId = req.params.id;

  try {
    const archivedUser = await ArchivedUser.findByIdAndDelete(archivedUserId);

    if (!archivedUser) {
      return res.status(404).json({ message: 'Archived user not found' });
    }

    res.json({ message: 'Archived user deleted permanently' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting archived user', error });
  }
};
