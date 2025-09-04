import { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import { useCart } from '../context/CartContext';
import CourseList from './CourseList';
import ConflictDisplay from './ConflictDisplay';

export default function CourseSelection() {
    const { courses, conflicts, potentialConflicts } = useSchedule();
    const { addToCart, cartItems } = useCart();
    const [selectedCourse, setSelectedCourse] = useState(null);
    
    // Search and filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [timeFilter, setTimeFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter courses to show available (non-selected) courses
    const availableCourses = courses.filter(course => !course.isSelected);

    // Get unique departments for filter dropdown
    const departments = [...new Set(availableCourses.map(course => course.subject))].sort();
    
    // Get unique days for filter
    const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Helper function to check if course is in cart
    const isInCart = (courseId) => {
        return cartItems.some(item => item.type === 'course' && item.id === courseId);
    };

    // Filter courses based on search criteria
    const filteredCourses = availableCourses.filter(course => {
        // Text search (course name, subject, instructor, description)
        const matchesSearch = searchTerm === '' || 
            course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.courseDescription.toLowerCase().includes(searchTerm.toLowerCase());

        // Department filter
        const matchesDepartment = selectedDepartment === '' || course.subject === selectedDepartment;

        // Days filter
        const courseDays = Array.isArray(course.days) ? course.days : [course.days];
        const matchesDays = selectedDays.length === 0 || 
            selectedDays.some(day => courseDays.includes(day));

        // Time filter
        const matchesTime = timeFilter === '' || (() => {
            // Extract hour from 12-hour format (e.g., "2:00 PM" -> 14)
            const timePattern = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
            const match = course.startTime.match(timePattern);
            
            if (!match) return true; // If can't parse, show all
            
            let hour = parseInt(match[1]);
            const period = match[3].toUpperCase();
            
            // Convert to 24-hour for comparison
            if (period === 'PM' && hour !== 12) {
                hour += 12;
            } else if (period === 'AM' && hour === 12) {
                hour = 0;
            }
            
            switch (timeFilter) {
                case 'morning': return hour >= 8 && hour < 12;
                case 'afternoon': return hour >= 12 && hour < 17;
                case 'evening': return hour >= 17;
                default: return true;
            }
        })();

        return matchesSearch && matchesDepartment && matchesDays && matchesTime;
    });

    const handleAddToCart = (course) => {
        // Add to cart directly - conflict checking will happen at checkout
        addToCart(course, 'course');
        setSelectedCourse(null);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedDepartment('');
        setSelectedDays([]);
        setTimeFilter('');
    };

    const toggleDayFilter = (day) => {
        setSelectedDays(prev => 
            prev.includes(day) 
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    return (
        <div className="course-selection-container">
            {/* Show conflict display if there are any conflicts */}
            {(conflicts.length > 0 || potentialConflicts.length > 0) && (
                <ConflictDisplay />
            )}
            
            {/* Show currently enrolled courses */}
            <CourseList />
            
            {/* Search and Filter Section */}
            <div className="search-section">
                <div className="search-header">
                    <h2>Available Courses ({filteredCourses.length})</h2>
                    <button 
                        className="toggle-filters-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                {/* Main Search Bar */}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search courses, instructors, or departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="search-info">
                        {searchTerm && (
                            <span className="search-results-count">
                                Found {filteredCourses.length} courses
                            </span>
                        )}
                    </div>
                </div>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="filters-panel">
                        {/* Department Filter */}
                        <div className="filter-group">
                            <label>Department:</label>
                            <select 
                                value={selectedDepartment} 
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Time Filter */}
                        <div className="filter-group">
                            <label>Time of Day:</label>
                            <select 
                                value={timeFilter} 
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="filter-select"
                            >
                                <option value="">Any Time</option>
                                <option value="morning">Morning (8 AM - 12 PM)</option>
                                <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                                <option value="evening">Evening (5 PM - 8 PM)</option>
                            </select>
                        </div>

                        {/* Days Filter */}
                        <div className="filter-group">
                            <label>Days:</label>
                            <div className="days-filter">
                                {allDays.map(day => (
                                    <button
                                        key={day}
                                        className={`day-filter-btn ${selectedDays.includes(day) ? 'active' : ''}`}
                                        onClick={() => toggleDayFilter(day)}
                                    >
                                        {day.substring(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Clear Filters */}
                        <div className="filter-group">
                            <button 
                                className="clear-filters-btn"
                                onClick={clearFilters}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Show available courses to add */}
            <div className="available-courses-section">
                {filteredCourses.length === 0 ? (
                    <div className="no-results">
                        <h3>No courses found</h3>
                        <p>Try adjusting your search terms or filters.</p>
                        <button 
                            className="btn btn-secondary"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="courses-grid">
                        {filteredCourses.map(course => {
                            const inCart = isInCart(course.id);
                            
                            return (
                                <div key={course.id} className={`course-card ${inCart ? 'in-cart' : ''}`}>
                                    <div className="course-header">
                                        <h3>{course.name}</h3>
                                        <span className="course-code">{course.subject} {course.course}</span>
                                        {inCart && <span className="cart-indicator">📋 In Cart</span>}
                                    </div>
                                    <div className="course-details">
                                        <p><strong>Time:</strong> {course.startTime} - {course.endTime}</p>
                                        <p><strong>Days:</strong> {Array.isArray(course.days) ? course.days.join(', ') : course.days}</p>
                                        <p><strong>Instructor:</strong> {course.instructor}</p>
                                        <p><strong>Location:</strong> {course.room}</p>
                                        <p><strong>Seats Open:</strong> {course.seatsOpen}</p>
                                    </div>
                                    <div className="course-actions">
                                        <button 
                                            className="btn btn-info"
                                            onClick={() => setSelectedCourse(course)}
                                        >
                                            View Details
                                        </button>
                                        <button 
                                            className={`btn ${inCart ? 'btn-disabled' : 'btn-primary'}`}
                                            onClick={() => handleAddToCart(course)}
                                            disabled={inCart}
                                            title={inCart ? 'Already in cart' : 'Add to cart'}
                                        >
                                            {inCart ? 'In Cart' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedCourse.name}</h3>
                            {isInCart(selectedCourse.id) && 
                                <span className="cart-indicator">📋 In Cart</span>
                            }
                            <button 
                                className="close-button"
                                onClick={() => setSelectedCourse(null)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            <p><strong>Course Code:</strong> {selectedCourse.subject} {selectedCourse.course}-{selectedCourse.section}</p>
                            <p><strong>Time:</strong> {selectedCourse.startTime} - {selectedCourse.endTime}</p>
                            <p><strong>Days:</strong> {Array.isArray(selectedCourse.days) ? selectedCourse.days.join(', ') : selectedCourse.days}</p>
                            <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
                            <p><strong>Location:</strong> {selectedCourse.room}</p>
                            <p><strong>Duration:</strong> {selectedCourse.weeks} weeks</p>
                            <p><strong>Description:</strong> {selectedCourse.courseDescription}</p>
                            <p><strong>Seats Available:</strong> {selectedCourse.seatsOpen}</p>
                            {selectedCourse.waitlistOpen > 0 && (
                                <p><strong>Waitlist Available:</strong> {selectedCourse.waitlistOpen}</p>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button 
                                className={`btn ${isInCart(selectedCourse.id) ? 'btn-disabled' : 'btn-primary'}`}
                                onClick={() => handleAddToCart(selectedCourse)}
                                disabled={isInCart(selectedCourse.id)}
                                title={isInCart(selectedCourse.id) ? 'Already in cart' : 'Add to cart'}
                            >
                                {isInCart(selectedCourse.id) ? 'Already in Cart' : 'Add to Cart'}
                            </button>
                            <button 
                                className="btn btn-secondary"
                                onClick={() => setSelectedCourse(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}