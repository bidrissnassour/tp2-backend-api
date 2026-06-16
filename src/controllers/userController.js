const prisma = require("../utils/prisma");

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
};

const parseUserId = (id) => {
  const userId = Number(id);

  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return userId;
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la recuperation des utilisateurs",
    });
  }
};

const getProfile = async (req, res) => {
  const userId = parseUserId(req.user?.id);

  if (!userId) {
    return res.status(200).json({
      message: "Profil utilisateur",
      user: req.user,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    return res.status(200).json({
      message: "Profil utilisateur",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la recuperation du profil",
    });
  }
};

const getUserById = async (req, res) => {
  const userId = parseUserId(req.params.id);

  if (!userId) {
    return res.status(400).json({
      message: "Identifiant utilisateur invalide",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: userSelect,
    });

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la recuperation de l'utilisateur",
    });
  }
};

const updateUser = async (req, res) => {
  const userId = parseUserId(req.params.id);

  if (!userId) {
    return res.status(400).json({
      message: "Identifiant utilisateur invalide",
    });
  }

  const { name, email, role } = req.body || {};
  const data = {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(role !== undefined && { role }),
  };

  if (Object.keys(data).length === 0) {
    return res.status(400).json({
      message: "Aucune donnee a mettre a jour",
    });
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
      select: userSelect,
    });

    return res.status(200).json({
      message: "Utilisateur mis a jour",
      user,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Email deja utilise",
      });
    }

    return res.status(500).json({
      message: "Erreur lors de la mise a jour de l'utilisateur",
    });
  }
};

const deleteUser = async (req, res) => {
  const userId = parseUserId(req.params.id);

  if (!userId) {
    return res.status(400).json({
      message: "Identifiant utilisateur invalide",
    });
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return res.status(200).json({
      message: "Utilisateur supprime",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Utilisateur introuvable",
      });
    }

    return res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
    });
  }
};

module.exports = {
  getUsers,
  getProfile,
  getUserById,
  updateUser,
  deleteUser,
};
