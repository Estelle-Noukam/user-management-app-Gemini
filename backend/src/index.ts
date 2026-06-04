import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import userRoutes from './routes/user.routes';
import { User } from './models/User';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);

const seedDatabase = async () => {
  const adminExists = await User.findOne({ where: { email: 'admin@mgmt.com' } });
  if (!adminExists) {
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      email: 'admin@mgmt.com',
      password: hashedAdminPassword,
      name: 'Administrateur Principal',
      role: 'admin'
    });

    const hashedUserPassword = await bcrypt.hash('user123', 10);
    await User.create({
      email: 'user@mgmt.com',
      password: hashedUserPassword,
      name: 'Utilisateur Test',
      role: 'user'
    });
  }
};

sequelize.sync({ alter: true }).then(() => {
  seedDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Serveur actif sur le port ${PORT}`);
    });
  });
}).catch(err => {
  console.error('Erreur base de données:', err);
});
