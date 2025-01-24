import './App.css';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './components/Home'
import SignUp from './components/SignUp'
import Login from './components/Login'
import ProtectedRoutes from './ProtectedRoutes';
import Blogs from './components/Blogs';
import BlogDetails from './components/BlogDetails'
import EditBlog from './components/EditBlog';
import AddBlog from './components/AddBlog';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Home />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetails />} />
              <Route path="/blogs/:id/edit" element={<EditBlog />} />
              <Route path="/blogs/add-blog" element={<AddBlog />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
