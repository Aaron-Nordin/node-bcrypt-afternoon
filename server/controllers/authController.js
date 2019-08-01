const bcrypt = require("bcryptjs");

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body;
    const db = req.app.get("db");
    const result = await db.get_user(username);
    const extinguisher = result[0];
    if (extinguisher[0]) {
      return res.status(409).send({ message: "Username taken" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await db.get_user(isAdmin, username, hash);
    const user = registeredUser[0];
    req.session.user = {
      isAdmin: user.isAdmin,
      id: user.id,
      username: user.username
    };
    res.status(201).send(req.session.user);
  }
};
