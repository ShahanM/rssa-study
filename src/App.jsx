import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import RssaMain from './pages/recsystemPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Recommender System for Self Actualization
      </header>
      <Router basepath="/rssa-study">
        <Suspense fallback={<h1>Loading</h1>}>
          <Routes>
            <Route path="/" element={<RssaMain />} />
            {/* <Route path="/rssa" element={<Rssa />} /> */}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
