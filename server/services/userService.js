const { tablas } = require('../models');

async function getUsers() {
  try {
    const [users] = await tablas.Users.executeQuery('SELECT * FROM users');
    return users;
  }catch{
    throw new Error('Error al obtener usuarios');
  }
}

// buscar por id
async function getUser(id) {
  try {
    const [user] = await tablas.Users.executeQuery('SELECT * FROM users WHERE id = ?', [id]);
    return user[0];
  } catch{
    throw new Error('Error al obtener el usuario por ID');
  }
}

// Obtener perfil público de un usuario (sin datos sensibles)
async function getUserProfile(id) {
  try {
    const [user] = await tablas.Users.executeQuery(
      `SELECT 
        id, 
        usuario, 
        correo, 
        foto, 
        biografia, 
        institucion, 
        escuela_profesional, 
        facultad, 
        siguiendo, 
        seguidos, 
        tipo_usuario, 
        created_at 
      FROM users 
      WHERE id = ? AND estado_cuenta = 'activo'`, 
      [id]
    );
    return user[0];
  } catch {
    throw new Error('Error al obtener el perfil del usuario');
  }
}

// Obtener publicaciones de un usuario específico
async function getUserPublications(userId) {
  try {
    const [publications] = await tablas.Publications.executeQuery(
      `SELECT 
        id, 
        descripcion, 
        nombre_archivo, 
        tipo_archivo, 
        fecha, 
        estado_publicacion 
      FROM publications 
      WHERE id_usuario = ? AND estado_publicacion = 'publicado' 
      ORDER BY fecha DESC`, 
      [userId]
    );
    return publications;
  } catch {
    throw new Error('Error al obtener las publicaciones del usuario');
  }
}

// Seguir a un usuario
async function followUser(followerId, followedId) {
  try {
    // Obtener el usuario que va a seguir
    const follower = await getUser(followerId);
    if (!follower) throw new Error('Usuario seguidor no encontrado');

    // Obtener el usuario que será seguido
    const followed = await getUser(followedId);
    if (!followed) throw new Error('Usuario a seguir no encontrado');

    // Parsear los arrays JSON
    const followerSiguiendo = JSON.parse(follower.siguiendo || '[]');
    const followedSeguidores = JSON.parse(followed.seguidos || '[]');

    // Verificar si ya se sigue
    if (followerSiguiendo.includes(followedId)) {
      throw new Error('Ya sigues a este usuario');
    }

    // Agregar a las listas
    followerSiguiendo.push(followedId);
    followedSeguidores.push(followerId);

    // Actualizar ambos usuarios
    await tablas.Users.executeQuery(
      'UPDATE users SET siguiendo = ? WHERE id = ?',
      [JSON.stringify(followerSiguiendo), followerId]
    );

    await tablas.Users.executeQuery(
      'UPDATE users SET seguidos = ? WHERE id = ?',
      [JSON.stringify(followedSeguidores), followedId]
    );

    return { success: true, message: 'Usuario seguido exitosamente' };
  } catch (error) {
    throw new Error(error.message || 'Error al seguir usuario');
  }
}

// Dejar de seguir a un usuario
async function unfollowUser(followerId, followedId) {
  try {
    // Obtener el usuario que va a dejar de seguir
    const follower = await getUser(followerId);
    if (!follower) throw new Error('Usuario seguidor no encontrado');

    // Obtener el usuario que será no seguido
    const followed = await getUser(followedId);
    if (!followed) throw new Error('Usuario a dejar de seguir no encontrado');

    // Parsear los arrays JSON
    const followerSiguiendo = JSON.parse(follower.siguiendo || '[]');
    const followedSeguidores = JSON.parse(followed.seguidos || '[]');

    // Verificar si realmente se sigue
    if (!followerSiguiendo.includes(followedId)) {
      throw new Error('No sigues a este usuario');
    }

    // Remover de las listas
    const newFollowerSiguiendo = followerSiguiendo.filter(id => id !== followedId);
    const newFollowedSeguidores = followedSeguidores.filter(id => id !== followerId);

    // Actualizar ambos usuarios
    await tablas.Users.executeQuery(
      'UPDATE users SET siguiendo = ? WHERE id = ?',
      [JSON.stringify(newFollowerSiguiendo), followerId]
    );

    await tablas.Users.executeQuery(
      'UPDATE users SET seguidos = ? WHERE id = ?',
      [JSON.stringify(newFollowedSeguidores), followedId]
    );

    return { success: true, message: 'Dejaste de seguir al usuario' };
  } catch (error) {
    throw new Error(error.message || 'Error al dejar de seguir usuario');
  }
}

// buscar por correo
async function getUserByCorreo(correo) {
  try {
    const [user] = await tablas.Users.executeQuery('SELECT * FROM users WHERE correo = ?', [correo]);
    return user[0];
  } catch{
    throw new Error('Error al obtener el usuario por correo');
  }
}

// Crear usuario
async function createUser({
  usuario,
  correo,
  password,
  foto = null,
  biografia = null,
  institucion = null,
  escuela_profesional = null,
  facultad = null,
  tipo_usuario = 'I',
  estado_cuenta = 'activo',
  siguiendo = [],
  seguidos = []
}) {
  try {
    const siguiendoStr = JSON.stringify(siguiendo ?? []);
    const seguidosStr = JSON.stringify(seguidos ?? []);

    const [result] = await tablas.Users.executeQuery(
      `INSERT INTO users (
        usuario, correo, password, foto, biografia,
        institucion, escuela_profesional, facultad,
        tipo_usuario, estado_cuenta, siguiendo, seguidos
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        usuario,
        correo,
        password,
        foto,
        biografia,
        institucion,
        escuela_profesional,
        facultad,
        tipo_usuario,
        estado_cuenta,
        siguiendoStr,
        seguidosStr
      ]
    );
    return await getUser(result.insertId);
  } catch (err) {
    console.error('Error al crear el usuario:', err);
    throw new Error('Error al crear el usuario');
  }
}

// Eliminar un usuario
async function deleteUser(id) {
  try{
    const result = await tablas.Users.executeQuery('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
  catch{
    throw new Error('Error al eliminar el usuario');
  }
}

// Actualizar un usuario
async function updateUser(id, updateData) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(updateData)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(id);

  const [result] = await tablas.Users.executeQuery(
    `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  return result.affectedRows > 0 ? await getUser(id) : null;
}

module.exports = {
  getUsers,
  getUser,
  getUserProfile,
  getUserPublications,
  followUser,
  unfollowUser,
  getUserByCorreo,
  createUser,
  updateUser,
  deleteUser
};