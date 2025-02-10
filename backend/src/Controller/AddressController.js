const Address = require('../Models/Address')

module.exports = {
    async create(req, res) {
        const { street, neighborhood, cep, city, state } = req.body

        try {
            const addressAlreadyExists = await Address.findOne({
                neighborhood: new RegExp(`^${neighborhood}$`, "i"),
                cep: cep, // Corrigido para usar o CEP corretamente
                street: new RegExp(`^${street}$`, "i"),
                city: new RegExp(`^${city}$`, "i"),
                state: new RegExp(`^${state}$`, "i"),
              });
            if(addressAlreadyExists) {
                return res.status(400).send('Address already exist!')
            }

            const addressCreated = await Address.create(req.body)
            return res.status(201).json(addressCreated)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    },
    async getAll(req, res) {
        try {
            const addresses = await Address.find()
            if(addresses.lenght === 0) {
                return res.status(204).send('Do not have addresses registered!')
            }

            return res.status(200).send(addresses)
        } catch(err) {
            return res.status(500).send({ error: err.message })
        }
    }
}
