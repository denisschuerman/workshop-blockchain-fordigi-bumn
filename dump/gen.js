import crypto from "crypto";

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16);
  console.log(salt);
  const hash = crypto.pbkdf2Sync(password, salt, 100, 32, "sha512");
  console.log(hash);
  const combinedBuffer = Buffer.concat([salt, hash]);
  return combinedBuffer.toString("base64");
};

const hashed = hashPassword("hello");
const combinedBuffer = Buffer.from(hashed, "base64");
const salt = combinedBuffer.slice(0, 16);
const hash = combinedBuffer.slice(combinedBuffer.length - 32);
console.log(salt);
console.log(hash);
// const inputHash = crypto
//   .pbkdf2Sync("hello", salt, 100, 32, "sha512")
//   .toString("base64");
// console.log(hash);
// console.log(inputHash);
