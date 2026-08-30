/**
 * Generates a bcrypt hash for the admin password so you never store the
 * plain-text password in .env.
 *
 * Usage:
 *   npm run hash-password -- "00119900*$#@"
 *
 * Copy the printed hash into ADMIN_PASSWORD_HASH in your .env file.
 */
import bcrypt from "bcryptjs";

const plainPassword = process.argv[2];

if (!plainPassword) {
  console.error('Usage: npm run hash-password -- "your-password-here"');
  process.exit(1);
}

const hash = bcrypt.hashSync(plainPassword, 12);
console.log("\nAdd this line to your .env file:\n");
console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
