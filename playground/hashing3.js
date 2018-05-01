const bcrypt = require('bcryptjs');

var password = '123abc';

// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

var hashedPassword = '$2a$10$0Ga7Swwo7cZz2hE7x65ZQ.4mH/7fBUmTSVLfppM9I9ANifbxGCGSO';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
