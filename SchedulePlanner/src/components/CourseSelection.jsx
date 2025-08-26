import { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import { useCart } from '../context/CartContext';
import CourseList from './CourseList';
import ConflictDisplay from './ConflictDisplay';

export default function CourseSelection() {
    const { courses, conflicts, potentialConflicts } = useSchedule();
    const { addToCart } = useCart();
    const [selectedCourse, setSelectedCourse] = useState(null);

    // Filter courses to show available (non-selected) courses
    const availableCourses = courses.filter(course => !course.isSelected);

    const handleAddToCart = (course) => {
        // Add to cart directly - conflict checking will happen at checkout
        addToCart(course, 'course');
        setSelectedCourse(null);
    };

    return (
        <div className="course-selection-container">
            {/* Show conflict display if there are any conflicts */}
            {(conflicts.length > 0 || potentialConflicts.length > 0) && (
                <ConflictDisplay />
            )}
            
            {/* Show currently enrolled courses */}
            <CourseList />
            
            {/* Show available courses to add */}
            <div className="available-courses-section">
                <h2>Available Courses</h2>
                <div className="courses-grid">
                    {availableCourses.map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-header">
                                <h3>{course.name}</h3>
                                <span className="course-code">{course.subject} {course.course}</span>
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
                                    className="btn btn-primary"
                                    onClick={() => handleAddToCart(course)}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Course Details Modal */}
            {selectedCourse && (
                <div className="modal-overlay" onClick={() => setSelectedCourse(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedCourse.name}</h3>
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
                                className="btn btn-primary"
                                onClick={() => handleAddToCart(selectedCourse)}
                            >
                                Add to Cart
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