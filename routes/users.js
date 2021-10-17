// create router
const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        //take new password and encrypt it, before updating password.
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch (err) {
                return res.status(500).json(err);
            }
        }
        // update account  
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body, // $set will update the user
            });
            res.status(200).json("Account Updated");
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can update only your account!");
    }
});
//delete user 
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {

        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account Deleted");
        }
        catch (err) {
            return res.status(500).json(err);
        }
    }
    else {
        res.status(403).json("You can delete only your account!");
    }
});
//get user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //excluding password and updateAt,sending other infos of user.
        //user._doc carry  all object of user.
        const { password, updatedAt, ...other } = user._doc
        res.status(200).json(other);

    }
    catch (err) {
        res.status(500).json(err)
    }
});
//exporting 
module.exports = router;