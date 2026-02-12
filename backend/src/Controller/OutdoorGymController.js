const OutdoorGym = require('../Models/OutdoorGym')
const Address = require('../Models/Address')

module.exports = {
    async create(req, res) {
        const { photo, name, address } = req.body

        try {
            const outdoorGymAlredyExist = await OutdoorGym.findOne({ name: name, address: address })
            if(outdoorGymAlredyExist) {
                return res.status(409).json({ data: null, errorMessage: 'Outdoor already exists' })
            }

            const addressAlredyExists = await Address.findById(address)
            if(!addressAlredyExists) {
                return res.status(404).json({ data: null, errorMessage: 'Address does not exist' })
            }

            if(!photo) {
                return res.status(400).json({ data: null, errorMessage: 'Url photo invalid' })
            }

            const OutdoorGymCreated = await OutdoorGym.create({ photo, name, address })

            return res.status(201).json({ data: OutdoorGymCreated, errorMessage: null })
        } catch(err) {
            return res.status(500).json({ data: null, errorMessage: err.message })
        }
    },
    async getAll(req, res) {
        try {
            const allOutdoorGym = await OutdoorGym.find().populate('address')
            if(allOutdoorGym.length === 0) {
                return res.status(200).json({ data: [], errorMessage: null })
            }

            return res.status(200).json({ data: allOutdoorGym, errorMessage: null })
        } catch(err) {
            return res.status(500).json({ data: null, errorMessage: err.message })
        }
    },
    async deleteOutdoorGym(req, res) {
        
    }
}
