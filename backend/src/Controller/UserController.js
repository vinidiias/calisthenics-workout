const path = require('path');
const User = require('../Models/User');
const bcrypt = require('bcrypt');

async function hashedPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptePassword = await bcrypt.hash(password, salt);
    return encryptePassword;
  } catch (err) {
    return err;
  }
}

module.exports = {
  async create(req, res) {
    const { photo, name, phone, email, password, confirmPassword } = req.body;

    try {
      if (password !== confirmPassword) {
        return res.status(400).json({ data: null, errorMessage: 'Passwords do not match' });
      }

      const userAlredyExist = await User.findOne({ email });
      if (userAlredyExist) {
        return res.status(409).json({ data: null, errorMessage: 'User already exist' });
      }

      const cryptedPassword = await hashedPassword(password);

      const userCreated = await User.create({
        photo,
        name,
        email,
        phone,
        followers: [],
        following: [],
        history: [],
        password: cryptedPassword,
      });

      return res.status(201).json({ data: userCreated, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async auth(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ data: null, errorMessage: 'Invalid Email' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ data: null, errorMessage: 'Invalid password' });
      }

      const userWithoutPassword = await User.findOne({ email }).select(
        '-password',
      );
      userWithoutPassword.isLogged = true;

      return res.status(200).json({ data: userWithoutPassword, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getUsers(req, res) {
    try {
      const users = await User.find().select('-password');
      if (users.length === 0) {
        return res.status(200).json({ data: [], errorMessage: null });
      }

      return res.status(200).json({ data: users, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id)
        .select('-password')
        .populate('followers');

      if (!user) {
        return res.status(404).json({ data: null, errorMessage: 'User not found' });
      }

      return res.status(200).json({ data: user, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { auth } = req.headers;
      const data = req.body;

      if (!id) {
        return res.status(400).json({ data: null, errorMessage: 'ID do usuário é obrigatório.' });
      }

      if (id !== auth) {
        return res.status(403).json({ data: null, errorMessage: 'Forbidden' });
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updatedUser) {
        return res.status(404).json({ data: null, errorMessage: 'Usuário não encontrado.' });
      }

      return res.status(200).json({ data: updatedUser, errorMessage: null });
    } catch (error) {
      return res.status(500).json({ data: null, errorMessage: error.message });
    }
  },
  async followUser(req, res) {
    const { id: userTo } = req.params;
    const { userFrom } = req.body;

    try {
      const userFriend = await User.findById(userTo);

      if (!userFriend) {
        return res.status(404).json({ data: null, errorMessage: 'User friend not found' });
      }

      const user = await User.findById(userFrom);

      if (!user) {
        return res.status(404).json({ data: null, errorMessage: 'User not found' });
      }

      if (user.following.includes(userTo)) {
        return res.status(409).json({ data: null, errorMessage: 'User is already following' });
      }

      user.following.push(userTo);
      user.save();

      userFriend.followers.push(userFrom);
      userFriend.save();

      return res.status(201).json({ data: { userFrom: user, userTo: userFriend }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async unfollowUser(req, res) {
    const { userId: userFrom, id: userTo } = req.params;

    try {
      const userFriend = await User.findById(userTo);

      if (!userFriend) {
        return res.status(404).json({ data: null, errorMessage: 'User friend not found' });
      }

      const user = await User.findById(userFrom);

      if (!user) {
        return res.status(404).json({ data: null, errorMessage: 'User not found' });
      }

      const isFollowing = user.following.some(f => String(f) === String(userTo));
      if (!isFollowing) {
        return res.status(409).json({ data: null, errorMessage: 'User is not following' });
      }

      user.following = user.following.filter(
        (u) => String(u._id) !== String(userTo),
      );
      user.save();

      userFriend.followers = userFriend.followers.filter(
        (u) => String(u._id) !== String(userFrom),
      );
      userFriend.save();

      return res.status(201).json({ data: { userFrom: user, userTo: userFriend }, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getFollowersByUser(req, res) {
    const { id } = req.params;
    let query = '--v';

    if (req.query.filter) {
      query = req.query.filter.split(',').join(' ');
    }

    try {
      const user = await User.findById(id).populate({
        path: 'followers',
        select: query,
      });

      if (!user) {
        return res.status(404).json({ data: null, errorMessage: 'User not found' });
      }

      return res.status(200).json({ data: user.followers, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
  async getFollowingByUser(req, res) {
    const { id } = req.params;
    let query = '--v';

    if (req.query.filter) {
      query = req.query.filter.split(',').join(' ');
    }

    try {
      const user = await User.findById(id).populate({
        path: 'following',
        select: query,
      });

      if (!user) {
        return res.status(404).json({ data: null, errorMessage: 'User not found' });
      }

      return res.status(200).json({ data: user.following, errorMessage: null });
    } catch (err) {
      return res.status(500).json({ data: null, errorMessage: err.message });
    }
  },
};
