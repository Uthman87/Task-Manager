const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = express.Router()

// Fetching user and users
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Logout of one devices
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()

    } catch (e) {
        res.status(500).send()
    }
})

// Logout of all devices

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Fetching user profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


// Remove user profile
router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})


// Posting user and users
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


// Update user data
router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => { return allowedUpdates.includes(update) })

    if (!isValidOperation) {
        return res.status(404).send({ error: 'Invalid update!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(404).send(e)
    }
})




router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()

        if (!user) {
            return res.status(404).send({ error: 'No such user. Try again' })
        }

        res.send({ user, token })

    } catch (e) {
        res.status(404).send(e)
    }
})


const upload = multer({
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)/)) {
            return cb(new Error('Please upload image file'))
        }

        cb(undefined, true)
    }
})


router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()

    try {
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    } catch (e) {
        res.send(e)
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', auth, async (req, res) => {

    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
        
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router