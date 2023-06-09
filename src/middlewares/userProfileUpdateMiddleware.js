const userProfileUdateMiddleware = async (req, res, next) => {
  const data = req.body;

  // check requested data keys
  for (let key in data) {
    if (!["email", "phone_number", "first_name", "last_name", "country"].includes(key)) {
      return res.json({ message: `You can not to change ${key} data` });
    }
  }

  next();
};

export { userProfileUdateMiddleware };
