const User = require("../../models/user");
const { verifyToken, checkRole, checkAuth } = require('../../middleware/verifyUser');

const resolvers = {
  Query: {
    users: async (_, __, { headers }) => {
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['user'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      return await User.find({ archived: false });
    },
    user: async (_, { id }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      return await User.findById(id);
    },
    archivedUsers: async (_, __, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      return await User.find({ archived: true });
    },
  },

  Mutation: {
    createUser: async (_, { username, email, password, role }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      const newUser = new User({ username, email, password, role, status: 'active', archived: false });
      await newUser.save();
      return newUser;
    },
    updateUser: async (_, { _id, username, email, role, status }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      const updatedUser = await User.findByIdAndUpdate(_id, { username, email, role, status }, { new: true });
      if (!updatedUser) throw new Error("User not found");
      return updatedUser;
    },
    deleteUser: async (_, { _id }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      const deletedUser = await User.findByIdAndDelete(_id);
      if (!deletedUser) throw new Error("User not found");
      return deletedUser;
    },
    archiveUser: async (_, { _id }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      const archivedUser = await User.findByIdAndUpdate(_id, { archived: true }, { new: true });
      if (!archivedUser) throw new Error("User not found");
      return archivedUser;
    },
    restoreUser: async (_, { _id }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      const restoredUser = await User.findByIdAndUpdate(_id, { archived: false }, { new: true });
      if (!restoredUser) throw new Error("User not found");
      return restoredUser;
    },
    deleteArchivedUser: async (_, { _id }, { headers }) => {
  
      const decoded = verifyToken({ headers });
      const user = await User.findById(decoded.id);
      if (!checkRole(user, ['admin'])) throw new Error("Insufficient role.");
      if (!checkAuth(user)) throw new Error("User status is suspended");
      const deletedArchivedUser = await User.findByIdAndDelete(_id);
      if (!deletedArchivedUser) throw new Error("Archived user not found");
      return deletedArchivedUser;
    },
  },
};

module.exports = resolvers;
