import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = Router();

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post('/auth/register', async (req: any, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password || !name) return res.status(400).json({ error: 'Champs requis manquants' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Format email invalide' });
    if (password.length < 6) return res.status(400).json({ error: 'Mot de passe de 6 caractères minimum' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'Cet email est déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, role: 'user' });
    res.status(201).json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/login', async (req: any, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'mgmt_secret_key_456789',
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByPk(req.user!.id, { attributes: ['id', 'email', 'name', 'role'] });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/users/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findByPk(req.user!.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (email) {
      if (!validateEmail(email)) return res.status(400).json({ error: 'Format email invalide' });
      const emailCheck = await User.findOne({ where: { email } });
      if (emailCheck && emailCheck.id !== user.id) return res.status(409).json({ error: 'Email déjà utilisé' });
      user.email = email;
    }
    if (name) user.name = name;
    if (password) {
      if (password.length < 6) return res.status(400).json({ error: 'Mot de passe de 6 caractères minimum' });
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/admin/users', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'email', 'name', 'role', 'createdAt'] });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/admin/users', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    if (!email || !password || !name || !role) return res.status(400).json({ error: 'Tous les champs sont requis' });
    if (!validateEmail(email)) return res.status(400).json({ error: 'Format email invalide' });
    if (password.length < 6) return res.status(400).json({ error: 'Mot de passe de 6 caractères minimum' });

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ error: 'Email déjà utilisé' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword, name, role });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/admin/users/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    if (email) {
      if (!validateEmail(email)) return res.status(400).json({ error: 'Format email invalide' });
      const emailCheck = await User.findOne({ where: { email } });
      if (emailCheck && emailCheck.id !== user.id) return res.status(409).json({ error: 'Email déjà utilisé' });
      user.email = email;
    }
    if (name) user.name = name;
    if (role) user.role = role;
    if (password && password.trim() !== '') {
      if (password.length < 6) return res.status(400).json({ error: 'Mot de passe de 6 caractères minimum' });
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/admin/users/:id', authenticateToken, requireAdmin, async (req: any, res: Response) => {
  try {
    if (req.user.id === req.params.id) return res.status(400).json({ error: 'Impossible de supprimer votre propre compte admin' });
    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.status(24).send();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
