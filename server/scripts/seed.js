import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Team from '../models/Team.js';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';

dotenv.config();

const colors = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316'  // Orange
];

const seedTeams = async () => {
  const teams = [
    { name: 'Équipe Alpha', points: 150, color: colors[0] },
    { name: 'Équipe Beta', points: 120, color: colors[1] },
    { name: 'Équipe Gamma', points: 95, color: colors[2] },
    { name: 'Équipe Delta', points: 80, color: colors[3] },
    { name: 'Équipe Epsilon', points: 65, color: colors[4] },
    { name: 'Équipe Zeta', points: 50, color: colors[5] }
  ];

  await Team.deleteMany({});
  const createdTeams = await Team.insertMany(teams);
  console.log(`✅ ${createdTeams.length} équipes créées`);
  return createdTeams;
};

const seedChallenges = async () => {
  const challenges = [
    { title: 'Défi Sprint', description: 'Compléter un sprint de développement', points: 50, status: 'active' },
    { title: 'Défi Design', description: 'Créer un design innovant', points: 30, status: 'active' },
    { title: 'Défi Test', description: 'Atteindre 90% de couverture de tests', points: 40, status: 'active' },
    { title: 'Défi Documentation', description: 'Documenter le projet', points: 25, status: 'completed' }
  ];

  await Challenge.deleteMany({});
  const createdChallenges = await Challenge.insertMany(challenges);
  console.log(`✅ ${createdChallenges.length} défis créés`);
  return createdChallenges;
};

const seedUsers = async () => {
  const usersData = [
    { username: 'admin', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { username: 'user1', email: 'user1@example.com', password: 'user123', role: 'user' }
  ];

  await User.deleteMany({});
  
  // Hash passwords before creating users (insertMany doesn't trigger pre('save') hooks)
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
  console.log('📝 Comptes de test:');
  console.log('   Admin: admin@example.com / admin123');
  console.log('   User: user1@example.com / user123');
  return createdUsers;
};

const seed = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/team-leaderboard';
    await mongoose.connect(mongoUri);
    console.log('✅ Connecté à MongoDB');

    await seedTeams();
    await seedChallenges();
    await seedUsers();

    console.log('\n🎉 Base de données peuplée avec succès!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

seed();

