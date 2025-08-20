import { useState } from 'react'
import './App.css'
import Homepage from './components/Homepage'
import Schedule from './components/Schedule'
import CourseSelection from './components/CourseSelection'
import TimeBlocks from './components/TimeBlocks'
import Cart from './components/Cart'
import Logo from './components/Logo'
import SampleCourses from './components/SampleCourses'
import { CartProvider, useCart } from './context/CartContext'

function AppContent() {
  const [activeTab, setActiveTab] = useState('home')
  const [courseList, setCourseList] = useState(SampleCourses);
  const { getCartItemCount } = useCart();

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
      case 'cart':
        return <Cart />
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
            <button 
              className={`tab-button ${activeTab === 'cart' ? 'active' : ''} cart-tab`}
              onClick={() => setActiveTab('cart')}
            >
              Cart
              {getCartItemCount() > 0 && (
                <span className="cart-badge">{getCartItemCount()}</span>
              )}
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

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  )
}

export default App
