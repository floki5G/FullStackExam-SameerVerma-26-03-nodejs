// module.exports = {
//     jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key',
//     jwtExpire: process.env.JWT_EXPIRE || '30d',
//     env: process.env.NODE_ENV || 'development',
//     pagination: {
//       defaultLimit: 10,
//       maxLimit: 50
//     }
//   };
export default {
    jwtSecret: process.env.JWT_SECRET || 'your_jwt',
    jwtExpire: process.env.JWT_EXPIRE || '30d',
    env: process.env.NODE_ENV || 'development',
    pagination: {
      defaultLimit: 10,
      maxLimit: 50
    }
  };
// Compare this snippet from e-commerce-backend/routes/authRoutes.js: