require('dotenv').config();
const mongoose = require('mongoose');
const OutdoorGym = require('../Models/OutdoorGym');
const Address = require('../Models/Address');

const seedGyms = async () => {
    console.log(process.env.DB_URI)
  await mongoose.connect(process.env.DB_URI);
  console.log('Conectado ao MongoDB');

  const gyms = [
    {
      photo: 'https://lh3.googleusercontent.com/p/AF1QipMOAm3tXlswUmkwD-POXEkGOmUyZjMkRj867ieE=s680-w680-h510',
      name: 'Araucária Calistenia',
      address: '67a6917240209a0019b419ea'
    },
    {
      photo: 'https://lh3.googleusercontent.com/p/AF1QipPeSL7slOjRxyxLjQvQlyk7NnvG4TPDfNwia-Cm=s1360-w1360-h1020',
      name: 'Paraná Calistenia',
      address: '67ace74920259bd471bebab8'
    }
  ];
  console.log('chegou aq')
  await OutdoorGym.insertMany(gyms);
  console.log('Outdoor Gyms inseridos com sucesso!');
  await mongoose.disconnect();
};

seedGyms().catch(err => console.error('Erro ao inserir gyms:', err));
