import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import default_perfil from '../assets/default_perfil.png';

interface User {
  id: number;
  usuario: string;
  correo: string;
  foto: any;
  biografia: string;
  institucion: string;
  tipo_usuario: string;
  estado_cuenta: string;
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await getUsers();
        // Filtrar para no mostrar al usuario actual
        const otrosUsuarios = response.data.filter((user: User) => 
          user.id !== currentUser?.id && user.estado_cuenta === 'activo'
        );
        setUsuarios(otrosUsuarios);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar usuarios');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [currentUser]);

  const convertImageToBase64 = (buffer: any): string => {
    if (!buffer || !buffer.data) return default_perfil;
    
    const bytes = new Uint8Array(buffer.data);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return `data:image/jpeg;base64,${btoa(binary)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-gray-600">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Descubrir Usuarios</h2>
      
      {usuarios.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay otros usuarios disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {usuarios.map((usuario) => (
            <Link
              key={usuario.id}
              to={`/profile/${usuario.id}`}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Imagen de perfil */}
                <div className="flex justify-center mb-4">
                  <img
                    src={convertImageToBase64(usuario.foto)}
                    alt={`${usuario.usuario} avatar`}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  />
                </div>

                {/* Información del usuario */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {usuario.usuario}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{usuario.correo}</p>
                  
                  {usuario.biografia && (
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                      {usuario.biografia.length > 80 
                        ? `${usuario.biografia.substring(0, 80)}...` 
                        : usuario.biografia}
                    </p>
                  )}

                  {usuario.institucion && (
                    <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {usuario.institucion}
                    </div>
                  )}

                  {/* Tipo de usuario */}
                  <div className="mt-3">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      usuario.tipo_usuario === 'I' 
                        ? 'bg-green-100 text-green-800' 
                        : usuario.tipo_usuario === 'E'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {usuario.tipo_usuario === 'I' ? 'Investigador' : 
                       usuario.tipo_usuario === 'E' ? 'Estudiante' : 'Administrador'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover effect */}
              <div className="px-6 pb-4">
                <div className="text-center">
                  <span className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Ver perfil →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaUsuarios;