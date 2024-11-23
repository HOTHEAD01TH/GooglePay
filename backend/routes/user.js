// backend/routes/user.js
const express = require('express');

const router = express.Router();
const zod = require("zod");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const  { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

router.post("/signup", async (req, res) => {
    try {
        const { success } = signupBody.safeParse(req.body)
        if (!success) {
            return res.status(411).json({
                message: "Invalid input format"
            })
        }

        const existingUser = await User.findOne({
            username: req.body.username
        })

        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken"
            })
        }

        const user = await User.create({
            username: req.body.username,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })

        const userId = user._id;

        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        const token = jwt.sign({
            userId
        }, JWT_SECRET);

        res.json({
            message: "User created successfully",
            token: token
        })
    } catch (err) {
        // Handle MongoDB duplicate key error specifically
        if (err.code === 11000) {
            return res.status(411).json({
                message: "Email already taken"
            })
        }
        res.status(500).json({
            message: "Internal server error"
        })
    }
})


const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

    
    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
        return;
    }

    await User.updateOne({ _id: req.userId }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    });

    // Get updated user data
    const updatedUser = await User.findById(req.userId);
    
    // Create new token with updated info
    const token = jwt.sign({
        userId: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        username: updatedUser.username
    }, JWT_SECRET);

    res.json({
        message: "Updated successfully",
        token: token
    })
});

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching user details"
        });
    }
});

router.get("/:userId", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user details" });
    }
});

module.exports = router;