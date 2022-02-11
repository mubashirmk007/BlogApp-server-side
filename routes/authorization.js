const router = require("express").Router();
const registerModel = require("../model/registerModel");
const bcrypt = require("bcrypt");

//Register new user
router.post("/register", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password, salt);
		const newUser = new registerModel({
			username: req.body.username,
			email: req.body.email,
			password: hashedPass,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Login
router.post("/login", async (req, res) => {
	try {
		const user = await registerModel.findOne({ username: req.body.username });
		!user && res.status(404).json("Invalid user!");

		const validated = await bcrypt.compare(req.body.password, user.password);
		!validated && res.status(400).json("Invalid user!");

		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
