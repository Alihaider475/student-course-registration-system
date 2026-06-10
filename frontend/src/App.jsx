import { useState, useEffect } from 'react';
import Students from './components/Students';
import Courses from './components/Courses';
import Registrations from './components/Registrations';
import { getStudents, getCourses, getRegistrations, checkHealth } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('students');
  const [counts, setCounts] = useState({ students: 0, courses: 0, registrations: 0 });
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'

  // Load the totals shown in the dashboard cards
  const loadCounts = async () => {
    try {
      const [studentsRes, coursesRes, registrationsRes] = await Promise.all([
        getStudents(),
        getCourses(),
        getRegistrations(),
      ]);
      setCounts({
        students: studentsRes.data.length,
        courses: coursesRes.data.length,
        registrations: registrationsRes.data.length,
      });
    } catch (err) {
      // If the backend is down, the tab components show their own error message
    }
  };

  // Check whether the API is reachable, used by the header status indicator
  const checkApiStatus = async () => {
    try {
      await checkHealth();
      setApiStatus('online');
    } catch (err) {
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    loadCounts();
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="header-text">
            <h1>Student Course Registration System</h1>
            <p className="subtitle">University Admin Dashboard</p>
            <span className="tech-badge">React Frontend • Node.js API • PostgreSQL Database</span>
          </div>
          <div className={`api-status ${apiStatus}`}>
            <span className="status-dot"></span>
            <span>
              {apiStatus === 'online' && 'API Connected'}
              {apiStatus === 'offline' && 'API Offline'}
              {apiStatus === 'checking' && 'Checking API...'}
            </span>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Dashboard summary cards */}
        <section className="summary">
          <div className="summary-card">
            <span className="summary-icon students-icon">🎓</span>
            <div className="summary-text">
              <p className="summary-value">{counts.students}</p>
              <p className="summary-label">Total Students</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon courses-icon">📚</span>
            <div className="summary-text">
              <p className="summary-value">{counts.courses}</p>
              <p className="summary-label">Total Courses</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-icon registrations-icon">📝</span>
            <div className="summary-text">
              <p className="summary-value">{counts.registrations}</p>
              <p className="summary-label">Total Registrations</p>
            </div>
          </div>
        </section>

        {/* Tab navigation */}
        <nav className="tabs">
          <button
            className={activeTab === 'students' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={activeTab === 'courses' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('courses')}
          >
            Courses
          </button>
          <button
            className={activeTab === 'registrations' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('registrations')}
          >
            Registrations
          </button>
        </nav>

        <main className="panel">
          {activeTab === 'students' && <Students onDataChange={loadCounts} />}
          {activeTab === 'courses' && <Courses onDataChange={loadCounts} />}
          {activeTab === 'registrations' && <Registrations onDataChange={loadCounts} />}
        </main>
      </div>
    </div>
  );
}

export default App;
