import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import OwnerView from './OwnerView';
import WalkerView from './WalkerView';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1><span style={{ color: 'var(--accent-color)' }}>Dog</span>Go</h1>
          <nav>
            <Link to="/owner" className="btn" style={{ marginRight: '1rem', background: 'transparent', border: '1px solid var(--accent-color)' }}>I am an Owner</Link>
            <Link to="/walker" className="btn">I am a Walker</Link>
          </nav>
        </header>
        
        <Routes>
          <Route path="/" element={
            <div className="glass-panel animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <h2>Welcome to DogGo</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--background-light)' }}>The premium on-demand dog walking platform.</p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/owner" className="btn">Request a Walk</Link>
                <Link to="/walker" className="btn" style={{ background: 'var(--secondary-color)' }}>Start Earning</Link>
              </div>
            </div>
          } />
          <Route path="/owner" element={<OwnerView />} />
          <Route path="/walker" element={<WalkerView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
