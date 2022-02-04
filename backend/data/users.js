import bcrypt from 'bcryptjs';
const users = [
  {
    name: 'Admin User',
    email: 'admin@orema.com',
    password: bcrypt.hashSync('Ore!ma12', 10),
    isAdmin: true,
    userImage: 'images/akim.jpeg',
    address: 'antalya',
  },
  {
    name: 'Orema User',
    email: 'orema@orema.com',
    password: bcrypt.hashSync('Ore!ma12', 10),
    userImage: 'images/akim.jpeg',
    address: 'antalya',
  },
  {
    name: 'Orema Yazlim',
    email: 'yazlim@orema.com',
    password: bcrypt.hashSync('Ore!ma12', 10),
    userImage: 'images/akim.jpeg',
    address: 'antalya',
  },
];

export default users;
