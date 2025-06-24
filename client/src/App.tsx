import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import Layout from './components/Layout';
// ====================================================================================
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Perfil from './pages/Perfil';
import PerfilOtroUsuario from './components/PerfilOtroUsuario';
// ====================================================================================

function App() {
  return (
  <Routes>
    {/*============================= rutas publicas ============================= */}
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>

    {/*============================= rutas privadas con layout =============================*/}
    <Route element={<PrivateRoute/>}>
      <Route path="/" element={<Layout><Home/></Layout>}/>  
      <Route path="/perfil" element={<Layout><Perfil/></Layout>}/>
      <Route path="/profile/:userId" element={<Layout><PerfilOtroUsuario/></Layout>}/>
    </Route>
  </Routes>  
)
}

export default App