import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import default_perfil from '../assets/default_perfil.png';

interface UserProfile {
  id: number;
  usuario: string;
  correo: string;
  foto: string | null;
  biografia: string;
  institucion: string;
  escuela_profesional: string;
  facultad: string;
  siguiendo: string;
  seguidos: string;
  tipo_usuario: string;
  created_at: string;
  publications: Array<{
    id: number;
    descripcion: string;
    nombre_archivo: string;
    tipo_archivo: string;
    fecha: string;
  }>;
  seguidos_count: number;
  siguiendo_count: number;
  publications_count: number;
}

function PerfilOtroUsuario() {
  const { userId } = useParams<{ userId: string }>();
  const { user: currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        setUserProfile(response.data);
        
        // Verificar si el usuario actual ya sigue a este usuario
        if (currentUser && response.data.seguidos) {
          const seguidores = JSON.parse(response.data.seguidos);
          setIsFollowing(seguidores.includes(currentUser.id));
        }
      } catch (err: any) {
        setError(err.response?.data?.error || 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || !userProfile || followLoading) return;

    try {
      setFollowLoading(true);
      
      if (isFollowing) {
        await unfollowUser(currentUser.id.toString(), userProfile.id.toString());
        setIsFollowing(false);
        setUserProfile(prev => prev ? {
          ...prev,
          seguidos_count: prev.seguidos_count - 1
        } : null);
      } else {
        await followUser(currentUser.id.toString(), userProfile.id.toString());
        setIsFollowing(true);
        setUserProfile(prev => prev ? {
          ...prev,
          seguidos_count: prev.seguidos_count + 1
        } : null);
      }
    } catch (err: any) {
      console.error('Error al seguir/dejar de seguir:', err);
      alert(err.response?.data?.error || 'Error al realizar la acción');
    } finally {
      setFollowLoading(false);
    }
  };

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
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Cargando perfil...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Usuario no encontrado</div>
      </div>
    );
  }

  const profileImage = userProfile.foto 
    ? convertImageToBase64(userProfile.foto) 
    : default_perfil;

  const isOwnProfile = currentUser?.id === userProfile.id;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Imagen de portada */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
        <img
          src="https://noticias.upc.edu.pe/wp-content/uploads/2019/05/minecraft.jpg"
          alt="Imagen de portada"
          className="w-full h-full object-cover"
        />

        {/* Imagen de perfil */}
        <div className="absolute left-6 bottom-[-2.5rem]">
          <img
            src={profileImage}
            alt="Avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
          />
        </div>

        {/* Botón de seguir/dejar de seguir */}
        {!isOwnProfile && (
          <button
            onClick={handleFollowToggle}
            disabled={followLoading}
            className={`absolute right-6 bottom-4 px-6 py-2 text-sm font-medium rounded-lg transition ${
              isFollowing
                ? 'text-blue-600 bg-white border border-blue-600 hover:bg-blue-50'
                : 'text-white bg-blue-500 hover:bg-blue-600'
            } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {followLoading ? 'Cargando...' : isFollowing ? 'Siguiendo' : 'Seguir'}
          </button>
        )}
      </div>

      {/* Información del perfil */}
      <div className="pt-20 pb-6 px-6">
        {/* Nombre y estadísticas */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{userProfile.usuario}</h1>
            <p className="text-gray-600 mt-1">{userProfile.correo}</p>
            {userProfile.biografia && (
              <p className="text-gray-700 mt-3 max-w-2xl">{userProfile.biografia}</p>
            )}
          </div>

          {/* Estadísticas */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userProfile.publications_count}
              </div>
              <div className="text-sm text-gray-600">Publicaciones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userProfile.seguidos_count}
              </div>
              <div className="text-sm text-gray-600">Seguidores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {userProfile.siguiendo_count}
              </div>
              <div className="text-sm text-gray-600">Siguiendo</div>
            </div>
          </div>
        </div>

        {/* Información académica */}
        {(userProfile.institucion || userProfile.facultad || userProfile.escuela_profesional) && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Información Académica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {userProfile.institucion && (
                <div>
                  <span className="font-medium text-gray-700">Institución:</span>
                  <p className="text-gray-600">{userProfile.institucion}</p>
                </div>
              )}
              {userProfile.facultad && (
                <div>
                  <span className="font-medium text-gray-700">Facultad:</span>
                  <p className="text-gray-600">{userProfile.facultad}</p>
                </div>
              )}
              {userProfile.escuela_profesional && (
                <div>
                  <span className="font-medium text-gray-700">Escuela Profesional:</span>
                  <p className="text-gray-600">{userProfile.escuela_profesional}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Publicaciones */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Publicaciones ({userProfile.publications_count})
          </h3>
          
          {userProfile.publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userProfile.publications.map((publication) => (
                <div key={publication.id} className="bg-white border rounded-lg p-4 shadow-sm">
                  <p className="text-gray-800 mb-2">{publication.descripcion}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{new Date(publication.fecha).toLocaleDateString()}</span>
                    {publication.tipo_archivo && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {publication.tipo_archivo}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Este usuario aún no ha realizado ninguna publicación.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilOtroUsuario;