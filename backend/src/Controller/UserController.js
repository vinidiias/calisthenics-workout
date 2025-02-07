const User = require('../Models/User')
const bcrypt = require('bcrypt')

async function hashedPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10)
        const encryptePassword = await bcrypt.hash(password, salt)
        return encryptePassword
    } catch(err) {
        return err
    }
}

module.exports = {
    async create(req, res) {
        const { name, email, password, confirmPassword} = req.body
        
        try {
            if(password !== confirmPassword) {
                return res.status(400).send({ message: 'Passwords do not match' })
            }
            
            const userAlredyExist = await User.findOne( { email })
            if(userAlredyExist) {
                return res.status(400).send({ message: 'User already exist' })
            }
            
            const cryptedPassword = await hashedPassword(password)

            const userCreated = await User.create({
                name,
                email,
                password: cryptedPassword
            })

            return res.status(201).send(userCreated)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async auth(req, res) {
        const { email, password } = req.body

        try {
            const user = await User.findOne({ email })
            if(!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)
            if(!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' })
            }

            const userWithoutPassword = await User.findOne({ email }).select('-password')
            userWithoutPassword.isLogged = true

            return res.status(200).json(userWithoutPassword)
        } catch(err) {
            res.status(500).json({ error: err.message })
        }
    }
}