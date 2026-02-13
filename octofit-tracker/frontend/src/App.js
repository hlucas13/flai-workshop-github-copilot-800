import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import ThemeToggle from './components/ThemeToggle';
import Users from './components/Users';
import Workouts from './components/Workouts';
import logo from './octofitapp-small.png';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="OctoFit Logo" className="navbar-logo" />
              OctoFit Tracker
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/users">
                    Users
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/activities">
                    Activities
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/teams">
                    Teams
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/leaderboard">
                    Leaderboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/workouts">
                    Workouts
                  </Link>
                </li>
              </ul>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <Routes>
          <Route
            path="/"
            element={
              <div className="page-content">
                <div className="container py-5">
                  <div className="page-header text-center mb-5">
                    <h1 className="display-4 mb-3">
                      Welcome to OctoFit Tracker
                    </h1>
                    <p className="lead">
                      Track your fitness activities, compete with your team, and
                      achieve your fitness goals!
                    </p>
                  </div>

                  <div className="row g-4">
                    <div className="col-md-4">
                      <Link to="/users" className="card-link">
                        <div className="card feature-card">
                          <div className="card-body">
                            <span className="feature-icon">👤</span>
                            <h3>User Profiles</h3>
                            <p>
                              Manage user accounts and track individual fitness
                              journeys with detailed profiles.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-4">
                      <Link to="/activities" className="card-link">
                        <div className="card feature-card">
                          <div className="card-body">
                            <span className="feature-icon">🏃</span>
                            <h3>Activities</h3>
                            <p>
                              Log and monitor all fitness activities including
                              runs, cycles, and workouts.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-4">
                      <Link to="/leaderboard" className="card-link">
                        <div className="card feature-card">
                          <div className="card-body">
                            <span className="feature-icon">🏆</span>
                            <h3>Leaderboard</h3>
                            <p>
                              Compete with others and see who's leading in the
                              fitness challenge!
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-6">
                      <Link to="/teams" className="card-link">
                        <div className="card feature-card">
                          <div className="card-body">
                            <span className="feature-icon">👥</span>
                            <h3>Teams</h3>
                            <p>
                              Create or join teams to collaborate and motivate
                              each other toward fitness goals.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-6">
                      <Link to="/workouts" className="card-link">
                        <div className="card feature-card">
                          <div className="card-body">
                            <span className="feature-icon">💪</span>
                            <h3>Workouts</h3>
                            <p>
                              Discover personalized workout suggestions tailored
                              to your fitness level and goals.
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
