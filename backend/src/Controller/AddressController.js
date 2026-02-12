const Address = require('../Models/Address')

module.exports = {
    async create(req, res) {
        const { street, neighborhood, cep, city, state } = req.body

        try {
            const addressAlreadyExists = await Address.findOne({
                neighborhood: new RegExp(`^${neighborhood}$`, "i"),
                cep: cep,
                street: new RegExp(`^${street}$`, "i"),
                city: new RegExp(`^${city}$`, "i"),
                state: new RegExp(`^${state}$`, "i"),
              });
            if(addressAlreadyExists) {
                return res.status(409).json({ data: null, errorMessage: 'Address already exist!' })
            }

            const addressCreated = await Address.create(req.body)
            return res.status(201).json({ data: addressCreated, errorMessage: null })
        } catch(err) {
            return res.status(500).json({ data: null, errorMessage: err.message })
        }
    },
    async getAll(req, res) {
        try {
            const addresses = await Address.find()
            if(addresses.length === 0) {
                return res.status(200).json({ data: [], errorMessage: null })
            }

            return res.status(200).json({ data: addresses, errorMessage: null })
        } catch(err) {
            return res.status(500).json({ data: null, errorMessage: err.message })
        }
    },
    async deleteAddress(req, res) {
        
    }
}
