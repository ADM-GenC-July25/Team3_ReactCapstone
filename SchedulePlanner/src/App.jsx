import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage'
import Schedule from './components/Schedule'
import CourseSelection from './components/CourseSelection'
import TimeBlocks from './components/TimeBlocks'
import Logo from './components/Logo'
import SampleCourses from './components/SampleCourses'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [courseList, setCourseList] = useState(SampleCourses);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage />
      case 'schedule':
        return <Schedule courseList={courseList} />
      case 'courses':
        return <CourseSelection courseList={courseList} setCourseList={setCourseList} />
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
          <Logo variant="glass animated" />
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
