import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import default_perfil from '../assets/default_perfil.png';

function NavegacionUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              RSU Network
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Inicio
            </Link>
            <Link
              to="/perfil"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/perfil') 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Mi Perfil
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* User Avatar and Name */}
            <Link to="/perfil" className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors">
              <img
                src={user?.foto ? convertImageToBase64(user.foto) : default_perfil}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.usuario}
              </span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Inicio
          </Link>
          <Link
            to="/perfil"
            className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
              isActive('/perfil') 
                ? 'text-blue-600 bg-blue-50' 
                : 'text-gray-700 hover:text-blue-600'
            }`}
          >
            Mi Perfil
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavegacionUsuario;