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
        const { photo, name, phone, email, password, confirmPassword} = req.body
        
        try {
            if(password !== confirmPassword) {
                return res.status(400).send({ message: 'Passwords do not match' })
            }
            
            const userAlredyExist = await User.findOne({ email })
            if(userAlredyExist) {
                return res.status(400).send({ message: 'User already exist' })
            }
            
            const cryptedPassword = await hashedPassword(password)

            const userCreated = await User.create({
                photo,
                name,
                email,
                phone,
                followers: [],
                following: [],
                history: [],
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
    },
    async getUsers(req, res) {
        try {
            const users = await User.find().select('-password')
            if(users.lenght === 0) {
                return res.status(402).send('No user found')
            }
            
            return res.status(200).send(users)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async getUser(req, res) {
        const { id } = req.params

        try {
            const user = await User.findById(id).select('-password').populate({
                path: 'history',
                populate: [
                    { path: 'outdoorGym' },
                    { path: 'participants' },
                ]
            }).populate('followers')

            if(!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            return res.status(200).send(user)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { auth } = req.headers;
            const data = req.body; // Captura todos os dados do corpo da requisição
    
            if (!id) {
                return res.status(400).json({ error: "ID do usuário é obrigatório." });
            }

            if(id !== auth ) {
                return res.status(401).json({ message: 'Unauthorized' })
            }
    
            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    
            if (!updatedUser) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
    
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar usuário.", details: error.message });
        }
    },
    async followUser(req, res) {
        const { userTo } = req.params;
        const { userFrom } = req.body

        try {
            const userFriend = await User.findById(userTo);

            if(!userFriend) {
                return res.status(404).json({ message: 'User friend not found' })
            }

            const user = await User.findById(userFrom);

            if(!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            if(user.following.includes(userTo)) {
                return res.status(400).json({ message: 'User is already following' })
            }

            user.following.push(userTo)
            user.save()

            userFriend.followers.push(userFrom)
            userFriend.save()

            return res.status(200).json({ userFrom: user, userTo: userFriend })
        } catch(err) {
            return res.status(500).json({Error: 'Error to follow user', Details: err.message})
        }
    },
    async getFollowersByUser(req, res) {
        const { id } = req.params;

        try {
            const user = await User.findById(id)

            if(!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            return res.status(200).json(user.followers)
        } catch(err) {
            return res.status(500).json({Error: 'Error to get followers', Details: err.message})
        }
    }
}