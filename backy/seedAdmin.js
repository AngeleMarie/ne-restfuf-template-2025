import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js'; 

dotenv.config(); 

const seedAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ where: { role: 'admin' } });

    if (!adminExists) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASS, 10); 

      // Create the admin user
      await User.create({
        firstName: 'Angele',
        lastName: 'Marie',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',  
        phoneNumber: '0798978831',
        password: hashedPassword,
        role: 'admin',
        status: 'active',  
        balance: 0,
        address: 'Admin Headquarters',
        profileImage: null,  
      });

      console.log('Admin user created successfully');
    } else {
      console.log('Admin already exists');
    }
  } catch (error) {
    console.error('Error creating admin:', error.message || error);
  }
};

seedAdmin();
