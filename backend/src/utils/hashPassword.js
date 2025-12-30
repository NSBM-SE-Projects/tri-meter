import bcrypt from 'bcrypt';

const password = process.argv[2];
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (!password) {
    console.log("Enter a password...")
    process.exit(1);
  }
  if (err) {
    console.error('Error hashing password:', err);
    process.exit(1);
  }
  console.log(`Password: ${password}`);
  console.log(`Hashed: ${hash}`);
});
