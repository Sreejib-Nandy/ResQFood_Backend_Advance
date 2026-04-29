import User from "../models/User.js";

export const updateLiveLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: "Coordinates required"
      });
    }

    await User.findByIdAndUpdate(req.user.userId, {
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    });

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};