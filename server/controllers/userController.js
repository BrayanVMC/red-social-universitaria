const userService = require('../services/userService');

// Login user
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await userService.getUserByCorreo(email);
    if(user){
      if (user.password === password) {
        res.status(200).json(user);
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    }
    else{
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Register a new user
async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    const existingUser = await userService.getUserByCorreo(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = await userService.createUser({usuario: username, correo: email, password: password});
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Get all users
async function getUsers(req, res) {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Get user profile by ID (public profile)
async function getUserProfile(req, res) {
  const { id } = req.params;
  try {
    const user = await userService.getUserProfile(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener las publicaciones del usuario
    const publications = await userService.getUserPublications(id);

    // Parsear los seguidos y siguiendo para obtener conteos
    const siguiendo = JSON.parse(user.siguiendo || '[]');
    const seguidos = JSON.parse(user.seguidos || '[]');

    const profileData = {
      ...user,
      publications,
      seguidos_count: seguidos.length,
      siguiendo_count: siguiendo.length,
      publications_count: publications.length
    };

    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Follow a user
async function followUser(req, res) {
  const { followedId } = req.body;
  const { followerId } = req.params; // ID del usuario que quiere seguir

  try {
    if (parseInt(followerId) === parseInt(followedId)) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
    }

    const result = await userService.followUser(parseInt(followerId), parseInt(followedId));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Unfollow a user
async function unfollowUser(req, res) {
  const { followedId } = req.body;
  const { followerId } = req.params; // ID del usuario que quiere dejar de seguir

  try {
    if (parseInt(followerId) === parseInt(followedId)) {
      return res.status(400).json({ error: 'No puedes dejar de seguirte a ti mismo' });
    }

    const result = await userService.unfollowUser(parseInt(followerId), parseInt(followedId));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

async function createUser(req, res) {
  try {
    // Extrae todos los campos posibles del body
    const {
      usuario,
      correo,
      password,
      biografia,
      institucion,
      escuela_profesional,
      facultad,
      tipo_usuario,
      estado_cuenta,
      siguiendo,
      seguidos
    } = req.body;
    const verificar_correo = await userService.getUserByCorreo(correo);
    if (verificar_correo) {
      return res.status(400).json({ error: "El correo ya está en uso" });
    }

    // Elimina campos vacíos o undefined
    const createDataUser = {};
    const rawFields = {
      usuario,
      correo,
      password,
      biografia,
      institucion,
      escuela_profesional,
      facultad,
      tipo_usuario,
      estado_cuenta
    };

    for (const [key, value] of Object.entries(rawFields)) {
      if (value !== undefined && value !== '') {
        createDataUser[key] = value;
      }
    }

    // Procesa siguiendo y seguidos si llegan como string
    if (siguiendo) createDataUser.siguiendo = JSON.parse(siguiendo);
    if (seguidos) createDataUser.seguidos = JSON.parse(seguidos);

    // Procesa la foto si se subió
    if (req.file) {
      createDataUser.foto = req.file.buffer;
    }
    const newUser = await userService.createUser(createDataUser);
    console.log("Nuevo usuario creado:", newUser);

    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Controlador para actualizar un usuario
async function updateUser(req, res) {
  try {
    const {correo, usuario, biografia, institucion, escuela_profesional, facultad, password, tipo_usuario, estado_cuenta} = req.body;

    const user = await userService.getUserByCorreo(correo);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const updateData = {};
    const rawFields = {usuario, biografia, institucion, escuela_profesional, facultad,password, tipo_usuario, estado_cuenta};

    // Agregar solo los campos no vacíos
    for (const [key, value] of Object.entries(rawFields)) {
      if (value !== undefined && value !== '') {
        updateData[key] = value;
      }
    }
    // Agregar foto si se subió
    const fotoFile = req.file;
    if (fotoFile) {
      updateData.foto = fotoFile.buffer;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No se proporcionaron datos para actualizar" });
    }

    const updatedUser = await userService.updateUser(user.id, updateData);
    res.json(updatedUser);

  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: error.message });
  }
}

// Controlador para eliminar un usuario
async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    const result = await userService.deleteUser(id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  login,
  register,
  getUsers,
  getUserProfile,
  followUser,
  unfollowUser,
  createUser,
  updateUser,
  deleteUser
};