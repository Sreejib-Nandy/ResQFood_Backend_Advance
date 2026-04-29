export const checkAccess = (req, res, next) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = new Date();

  if (
    user.status === "active" &&
    user.subscriptionEndDate &&
    user.subscriptionEndDate > now
  ) {
    return next();
  }

  if (
    user.status === "trial" &&
    user.trialEndDate &&
    user.trialEndDate > now
  ) {
    return next();
  }

  return res.status(403).json({
    message: "Subscripe to use this platform",
  });
};