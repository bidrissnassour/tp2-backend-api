const bcrypt = require("bcrypt");
const prisma = require("../utils/prisma");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

const buildTokenPayload = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
});

const register = async (req, res, next) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email deja utilise",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
      select: userSelect,
    });

    const payload = buildTokenPayload(user);

    return res.status(201).json({
      message: "Inscription reussie",
      user,
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Identifiants invalides",
      });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
    const payload = buildTokenPayload(user);

    return res.status(200).json({
      message: "Connexion reussie",
      user: safeUser,
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
