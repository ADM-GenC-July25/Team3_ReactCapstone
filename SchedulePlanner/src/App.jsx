import { useState, useContext } from 'react'
import './App.css'
import Homepage from './components/Homepage'
import Schedule from './components/Schedule'
import CourseSelection from './components/CourseSelection'
import TimeBlocks from './components/TimeBlocks'
import Logo from './components/Logo'
import Login from './components/Login'
import Cart from './components/Cart'
import Toast from './components/Toast'
import { AuthContext } from './context/AuthContext'
import { useCart } from './context/CartContext'
import { ScheduleProvider } from './contexts/ScheduleContext'
import DailyScheduling from './components/DailyScheduling'

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { isLoggedIn, userInfo, logout } = useContext(AuthContext);
  const { cartCount } = useCart();

  // Handle navigation clicks
  const handleNavClick = (tabName) => {
    // If trying to access protected tabs without login, go to login page
    if (!isLoggedIn && (tabName === 'schedule' || tabName === 'courses' || tabName === 'timeblocks')) {
      setActiveTab('login')
    } else {
      setActiveTab(tabName)
    }
  }

  // Handle logout
  const handleLogout = () => {
    logout()
    setActiveTab('home')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Homepage onNavigateToTab={setActiveTab} />
      case 'login':
        return <Login onLoginSuccess={() => setActiveTab('home')} />
      case 'schedule':
        return <Schedule />
      case 'courses':
        return <CourseSelection />
      case 'timeblocks':
        return <TimeBlocks />
      default:
        return <Homepage onNavigateToTab={setActiveTab} />
    }
  }

  return (
    <ScheduleProvider>
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

              {/* If not logged in, show Login button */}
              {!isLoggedIn && (
                <button
                  className={`tab-button ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
              )}

              {/* If logged in, show all other buttons */}
              {isLoggedIn && (
                <>
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
                    className="cart-button"
                    onClick={() => setIsCartOpen(true)}
                  >
                    🛒 Cart
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                  </button>
                  <button
                    className={`tab-button`}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </nav>
          </div>
        </header>

        <main className="app-main">
          {renderContent()}
        </main>

        <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Toast />
      </div>
    </ScheduleProvider>
  )
}

export default App
