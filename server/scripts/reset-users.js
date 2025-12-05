import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const resetUsers = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/team-leaderboard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    // Supprimer tous les utilisateurs existants
    await User.deleteMany({});
    console.log('🗑️  Utilisateurs existants supprimés');

    // Créer les nouveaux utilisateurs avec mots de passe hashés
    const usersData = [
      { username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
      { username: 'user1', email: 'user1@example.com', password: 'user123', role: 'user' }
    ];

    const hashedUsers = await Promise.all(
      usersData.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return {
          ...userData,
          password: hashedPassword
        };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`✅ ${createdUsers.length} utilisateurs créés`);
    console.log('\n📝 Comptes de test:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User: user1@example.com / user123');
    console.log('\n🎉 Utilisateurs réinitialisés avec succès!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation:', error);
    process.exit(1);
  }
};

resetUsers();



