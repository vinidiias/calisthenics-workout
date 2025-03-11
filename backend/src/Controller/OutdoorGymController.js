const OutdoorGym = require('../Models/OutdoorGym')
const Address = require('../Models/Address')

module.exports = {
    async create(req, res) {
        const { photo, name, address } = req.body

        try {
            const outdoorGymAlredyExist = await OutdoorGym.findOne({ name: name, address: address })
            if(outdoorGymAlredyExist) {
                return res.status(400).send('Outdoor already exists')
            }

            const addressAlredyExists = await Address.findById(address)
            if(!addressAlredyExists) {
                return res.status(401).send('Address does not exist')
            }

            if(!photo) {
                return res.status(401).send('Url photo invalid')
            }

            const OutdoorGymCreated = await OutdoorGym.create({ photo, name, address })

            return res.status(201).send(OutdoorGymCreated)
        } catch(err) {
            return res.status(500).send({ message: err.message})
        }
    },
    async getAll(req, res) {
        try {
            const allOutdoorGym = await OutdoorGym.find().populate('address')
            if(allOutdoorGym.lenght === 0) {
                return res.status(200).send('No outdoor gym found')
            }

            return res.status(200).send(allOutdoorGym)
        } catch(err) {
            return res.status(500).send({ message: err.message })
        }
    }
}