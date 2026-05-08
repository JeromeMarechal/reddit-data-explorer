import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Home from './pages/Home.jsx';
import PostDetail from './pages/PostDetail.jsx';

function App() {
  return (
    <Router>
      <div className="App-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;