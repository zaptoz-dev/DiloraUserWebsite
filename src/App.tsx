import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import VoiceLab from './pages/VoiceLab';
import Industries from './pages/Industries';
import Pricing from './pages/Pricing';
import Demo from './pages/Demo';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="mesh-bg grid-lines"></div>
      
      {/* Animated Ambient Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ff3c00] rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#9b66ff] rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-[#5828dc] rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/voice-lab" element={<VoiceLab />} />
            <Route path="/industries" element={<Industries />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
