import { useState } from 'react';
import PostList from '../components/PostList';
import CommentList from '../components/CommentList';
import FrmPublicacion from '../components/frmPublicacion';
import ListaUsuarios from '../components/ListaUsuarios';

function Home() {
  const [activeTab, setActiveTab] = useState('publicaciones');
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null); // nuevo estado

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('publicaciones')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'publicaciones'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Publicaciones
            </button>
            <button
              onClick={() => setActiveTab('usuarios')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'usuarios'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Descubrir Usuarios
            </button>
            <button
              onClick={() => setActiveTab('crear')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'crear'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Crear Publicación
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'publicaciones' && (
          <div>
            <PostList onSeleccionar={(id: number) => setIdSeleccionado(id)} />

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Comentarios Recientes</h3>
              {idSeleccionado !== null ? (
                <CommentList id_publicacion={idSeleccionado} />
              ) : (
                <p className="text-gray-500">Selecciona una publicación para ver los comentarios.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'usuarios' && <ListaUsuarios />}

        {activeTab === 'crear' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Crear Nueva Publicación</h2>
            <FrmPublicacion />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
