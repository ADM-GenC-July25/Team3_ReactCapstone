import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage'
import CourseSelection from './components/CourseSelection'
import TimeBlocks from './components/TimeBlocks'
import DailyScheduling from './components/DailyScheduling'
import ConflictDemo from './components/ConflictDemo'
import { ScheduleProvider } from './contexts/ScheduleContext'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage onNavigate={setActiveTab} />
      case 'schedule':
        return <DailyScheduling onBack={() => setActiveTab('home')} />
      case 'courses':
        return <CourseSelection />
      case 'timeblocks':
        return <TimeBlocks />
      case 'conflict-demo':
        return <ConflictDemo />
      default:
        return <Homepage onNavigate={setActiveTab} />
    }
  }

  return (
    <ScheduleProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="logo">
              <h1>Schedule Planner</h1>
            </div>
            <nav className="nav-tabs">
              <button 
                className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                Home
              </button>
              <button 
                className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                Schedule
              </button>
              <button 
                className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
              >
                Courses
              </button>
                          <button 
              className={`tab-button ${activeTab === 'timeblocks' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeblocks')}
            >
              Time Blocks
            </button>
            <button 
              className={`tab-button ${activeTab === 'conflict-demo' ? 'active' : ''}`}
              onClick={() => setActiveTab('conflict-demo')}
            >
              Conflict Demo
            </button>
            </nav>
          </div>
        </header>
        
        <main className="app-main">
          {renderContent()}
        </main>
      </div>
    </ScheduleProvider>
  )
}

export default App
