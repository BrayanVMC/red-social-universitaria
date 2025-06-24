import { useEffect, useState } from 'react';
import Publicacion from './Publicacion';
import { usePost } from '../context/PostContext';
import { useAuth } from '../context/AuthContext';

interface Usuario {
  id: number;
  usuario: string;
  foto: string | null;
}

interface Post {
  id: number;
  id_usuario: number;
  descripcion: string;
  fecha: string;
  nombre_archivo: string | null;
}

// ✅ Nueva prop opcional para selección
interface PostListProps {
  onSeleccionar?: (id: number) => void;
}

function PostList({ onSeleccionar }: PostListProps) {
  const { posts } = usePost();
  const { users } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      try {
        const result = await users();
        if (result.success && result.users) {
          setUsuarios(result.users);
        } else {
          setError(result.error || 'No se pudo cargar usuarios');
        }
      } catch (e) {
        setError('Error inesperado al cargar usuarios');
        console.error(e);
      }
    }

    fetchUsuarios();
  }, [users]);

  const postsOrdenados = [...posts].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  if (error) {
    return <div>Error al cargar usuarios: {error}</div>;
  }

  return (
    <div>
      {postsOrdenados.map((post: Post) => {
        const usuario = usuarios.find((u) => u.id === post.id_usuario);

        return (
          <div key={post.id} onClick={() => onSeleccionar?.(post.id)}>
            <Publicacion
              id_publicacion={post.id}
              id_usuario={post.id_usuario}
              descripcion={post.descripcion}
              fecha={post.fecha}
              nombre_archivo={post.nombre_archivo}
              usuario={usuario}
            />
          </div>
        );
      })}
    </div>
  );
}

export default PostList;
