const { route } = require("./users");

const router = require("express").Router();
router.get("/", async (req, res) => {
    console.log("post");
    res.send("post");
});
module.exports = router;