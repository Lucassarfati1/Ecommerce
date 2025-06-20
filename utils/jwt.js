import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role // solo si lo agregás al modelo
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1d' // el token expira en 1 día
  });
};
