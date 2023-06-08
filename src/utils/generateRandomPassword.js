const generateRandomPassword = () => {
  const symbols = '!@#$%^&*()_-+=<>?/{}~|';
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';

  const allChars = symbols + uppercaseLetters + lowercaseLetters + numbers;
  let password = '';

  // Generate one character from each character set
  password += getRandomChar(symbols);
  password += getRandomChar(uppercaseLetters);
  password += getRandomChar(lowercaseLetters);
  password += getRandomChar(numbers);

  // Generate remaining characters
  for (let i = 4; i < 8; i++) {
    password += getRandomChar(allChars);
  }

  return password;
}

const getRandomChar = (characters) => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters.charAt(randomIndex);
}

export { generateRandomPassword };
