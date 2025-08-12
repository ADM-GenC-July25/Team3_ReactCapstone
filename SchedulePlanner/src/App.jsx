import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage'
import Schedule from './components/Schedule'
import CourseSelection from './components/CourseSelection'
import TimeBlocks from './components/TimeBlocks'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage />
      case 'schedule':
        return <Schedule />
      case 'timeblocks':
        return <TimeBlocks />
      default:
        return <Homepage />
    }
  }

  return (
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
              className={`tab-button ${activeTab === 'timeblocks' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeblocks')}
            >
              Time Blocks
            </button>
          </nav>
        </div>
      </header>
      
      <main className="app-main">
        {renderContent()}
      </main>
    </div>
  )
}

export default App
