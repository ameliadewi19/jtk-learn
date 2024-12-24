const { Pengajar, Pelajar } = require('../models'); // Import model

const getUserDataByRole = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: Missing user data' });
  }

  const { role, userId } = req.user;

  try {
    let data;

    if (role === 'pelajar') {
      data = await Pelajar.findOne({ where: { id_user: userId } });
    } else if (role === 'pengajar') {
      data = await Pengajar.findOne({ where: { id_user: userId } });
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    if (!data) {
      return res.status(404).json({ message: `${role} data not found` });
    }

    res.json({
      message: 'User data retrieved successfully',
      role,
      data,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getUserDataByRole };
