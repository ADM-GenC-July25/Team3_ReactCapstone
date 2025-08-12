import { useState } from 'react';
import './Courses.css';

export default function AddCourses({ courseList, setCourseList, setIsAddCourses, conflicts, clearConflicts }) {

    const [selectedCourse, setSelectedCourse] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCourse, setNewCourse] = useState({
        name: '',
        subject: '',
        course: '',
        section: '',
        days: [],
        startTime: '09:00',
        endTime: '10:30',
        room: '',
        instructor: '',
        courseDescription: '',
        color: '#4CAF50',
        weeks: 15,
        isSelected: false
    });

    return (
        <>
            <div className='courseListContainer'>
                <div className='courseListHeader'>
                    <h2>Course Selection</h2>
                    <div>
                        <button
                            className='btn btn-primary'
                            onClick={() => setShowAddForm(!showAddForm)}
                            style={{ marginRight: '10px' }}
                        >
                            {showAddForm ? 'Cancel' : '+ Add Custom Course'}
                        </button>
                        <button
                            className='btn btn-light'
                            onClick={() => setIsAddCourses(false)}
                        >
                            <i className="fa fa-minus" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* Course Selection Table */}
            <div className="course-selection-section">
                <h3>Available Courses</h3>
                <p className="selection-description">
                    Select courses from the catalog below to add to your schedule. 
                    Click the info button to view course details, then use the add button to enroll.
                </p>
                
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Select</th>
                                <th>Course Name</th>
                                <th>Subject</th>
                                <th>Course #</th>
                                <th>Section</th>
                                <th>Days</th>
                                <th>Time</th>
                                <th>Room</th>
                                <th>Instructor</th>
                                <th>Seats</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseList
                                .filter(course => !course.isSelected) // Only show unselected courses
                                .map((course) => (
                                    <tr key={course.id} className="course-row">
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={false}
                                                onChange={() => {}} // Read-only for display
                                                disabled
                                            />
                                        </td>
                                        <td className='text-left course-name'>
                                            <span 
                                                className="course-color-indicator"
                                                style={{ backgroundColor: course.color }}
                                            ></span>
                                            {course.name}
                                        </td>
                                        <td>{course.subject}</td>
                                        <td>{course.course}</td>
                                        <td>{course.section}</td>
                                        <td>
                                            {Array.isArray(course.days) 
                                                ? course.days.join(', ') 
                                                : course.days}
                                        </td>
                                        <td>{course.startTime} - {course.endTime}</td>
                                        <td>{course.room}</td>
                                        <td>{course.instructor}</td>
                                        <td>
                                            <span className={`seats-status ${course.seatsOpen > 0 ? 'available' : 'full'}`}>
                                                {course.seatsOpen > 0 ? `${course.seatsOpen} open` : 'Full'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button type="button"
                                                    className="btn btn-outline-info btn-sm"
                                                    onClick={() => setSelectedCourse(course)}
                                                    data-toggle="modal"
                                                    data-target="#courseDetailsModal"
                                                    title="View course details"
                                                >
                                                    <i className="fa fa-info-circle"></i>
                                                </button>
                                                <button type="button"
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => {
                                                        if (setCourseList && typeof setCourseList === 'function') {
                                                            const result = setCourseList({
                                                                ...course,
                                                                isSelected: true,
                                                                status: 'Enrolled'
                                                            });
                                                            if (result && result.success) {
                                                                // Course added successfully
                                                                console.log('Course added to schedule');
                                                            }
                                                        }
                                                    }}
                                                    disabled={course.seatsOpen <= 0}
                                                    title={course.seatsOpen > 0 ? "Add to schedule" : "No seats available"}
                                                >
                                                    <i className='fa fa-plus'></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {courseList.filter(course => !course.isSelected).length === 0 && (
                    <div className="no-courses-message">
                        <p>All available courses have been added to your schedule!</p>
                    </div>
                )}
            </div>

            {/* Add New Course Form */}
            {showAddForm && (
                <div className="add-form">
                    <h3>Add New Course</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Course Name:</label>
                            <input
                                type="text"
                                value={newCourse.name}
                                onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                                placeholder="Course name"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Subject:</label>
                            <input
                                type="text"
                                value={newCourse.subject}
                                onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})}
                                placeholder="Subject code (e.g., CS, MATH)"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Course Number:</label>
                            <input
                                type="text"
                                value={newCourse.course}
                                onChange={(e) => setNewCourse({...newCourse, course: e.target.value})}
                                placeholder="Course number (e.g., 101, 205)"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Section:</label>
                            <input
                                type="text"
                                value={newCourse.section}
                                onChange={(e) => setNewCourse({...newCourse, section: e.target.value})}
                                placeholder="Section number (e.g., 001, 002)"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Days:</label>
                            <select
                                multiple
                                value={newCourse.days}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setNewCourse({...newCourse, days: selectedOptions});
                                }}
                            >
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Start Time:</label>
                            <input
                                type="time"
                                value={newCourse.startTime}
                                onChange={(e) => setNewCourse({...newCourse, startTime: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={newCourse.endTime}
                                onChange={(e) => setNewCourse({...newCourse, endTime: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Room:</label>
                            <input
                                type="text"
                                value={newCourse.room}
                                onChange={(e) => setNewCourse({...newCourse, room: e.target.value})}
                                placeholder="Room number or location"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Instructor:</label>
                            <input
                                type="text"
                                value={newCourse.instructor}
                                onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                                placeholder="Instructor name"
                            />
                        </div>
                        
                        <div className="form-group full-width">
                            <label>Description:</label>
                            <textarea
                                value={newCourse.courseDescription}
                                onChange={(e) => setNewCourse({...newCourse, courseDescription: e.target.value})}
                                placeholder="Course description"
                                rows="3"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Color:</label>
                            <input
                                type="color"
                                value={newCourse.color}
                                onChange={(e) => setNewCourse({...newCourse, color: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Weeks:</label>
                            <input
                                type="number"
                                value={newCourse.weeks}
                                onChange={(e) => setNewCourse({...newCourse, weeks: parseInt(e.target.value)})}
                                min="1"
                                max="20"
                            />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            className="save-button"
                            onClick={() => {
                                if (setCourseList && typeof setCourseList === 'function') {
                                    const result = setCourseList(newCourse);
                                    if (result && result.success) {
                                        setNewCourse({
                                            name: '',
                                            subject: '',
                                            course: '',
                                            section: '',
                                            days: [],
                                            startTime: '09:00',
                                            endTime: '10:30',
                                            room: '',
                                            instructor: '',
                                            courseDescription: '',
                                            color: '#4CAF50',
                                            weeks: 15,
                                            isSelected: false
                                        });
                                        setShowAddForm(false);
                                    }
                                }
                            }}
                            disabled={!newCourse.name.trim() || newCourse.days.length === 0}
                        >
                            Add Course
                        </button>
                    </div>
                </div>
            )}

            {/* Conflict Display */}
            {conflicts && conflicts.length > 0 && (
                <div className="conflict-alert">
                    <h3>⚠️ Scheduling Conflict Detected!</h3>
                    <p>The following existing items conflict with your new course:</p>
                    <div className="conflict-list">
                        {conflicts.map((conflict, index) => (
                            <div key={index} className="conflict-item">
                                <div className="conflict-item-header">
                                    <strong>{conflict.name || conflict.title}</strong>
                                    <span className="conflict-type">
                                        {conflict.conflictType}
                                    </span>
                                </div>
                                <div className="conflict-item-details">
                                    <span className="conflict-days">
                                        {conflict.conflictDetails.days}
                                    </span>
                                    <span className="conflict-time">
                                        {conflict.conflictDetails.time}
                                    </span>
                                    <span className="conflict-location">
                                        {conflict.conflictDetails.location}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button 
                        className="clear-conflicts-button"
                        onClick={clearConflicts}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            {/* Course Details Modal */}
            <div className="modal fade" id="courseDetailsModal" tabIndex="-1" role="dialog" aria-labelledby="courseDetailsModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="courseDetailsModalTitle">
                                <span
                                    className="course-color-indicator-large"
                                    style={{
                                        backgroundColor: selectedCourse.color,
                                        padding: '0 10px',
                                        borderRadius: '5px',
                                        display: 'inline-block',
                                    }}
                                >
                                    &nbsp;
                                </span>&nbsp;
                                {selectedCourse.name}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="course-details-grid">
                                <div className="detail-section">
                                    <h6>Course Information</h6>
                                    <p><strong>Subject:</strong> {selectedCourse.subject}</p>
                                    <p><strong>Course Number:</strong> {selectedCourse.course}</p>
                                    <p><strong>Section:</strong> {selectedCourse.section}</p>
                                    <p><strong>Description:</strong> {selectedCourse.courseDescription}</p>
                                </div>
                                
                                <div className="detail-section">
                                    <h6>Schedule</h6>
                                    <p><strong>Days:</strong> {Array.isArray(selectedCourse.days) ? selectedCourse.days.join(', ') : selectedCourse.days}</p>
                                    <p><strong>Time:</strong> {selectedCourse.startTime} - {selectedCourse.endTime}</p>
                                    <p><strong>Weeks:</strong> {selectedCourse.weeks}</p>
                                </div>
                                
                                <div className="detail-section">
                                    <h6>Location & Instructor</h6>
                                    <p><strong>Room:</strong> {selectedCourse.room}</p>
                                    <p><strong>Instructor:</strong> {selectedCourse.instructor}</p>
                                </div>
                                
                                <div className="detail-section">
                                    <h6>Enrollment</h6>
                                    <p><strong>Seats Open:</strong> {selectedCourse.seatsOpen}</p>
                                    <p><strong>Waitlist Seats:</strong> {selectedCourse.waitlistSeats}</p>
                                    <p><strong>Waitlist Open:</strong> {selectedCourse.waitlistOpen}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-success"
                                onClick={() => {
                                    if (setCourseList && typeof setCourseList === 'function') {
                                        const result = setCourseList({
                                            ...selectedCourse,
                                            isSelected: true,
                                            status: 'Enrolled'
                                        });
                                        if (result && result.success) {
                                            // Close modal after successful enrollment
                                            const modal = document.getElementById('courseDetailsModal');
                                            if (modal) {
                                                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                                                if (bootstrapModal) {
                                                    bootstrapModal.hide();
                                                }
                                            }
                                        }
                                    }
                                }}
                                disabled={selectedCourse.seatsOpen <= 0}
                            >
                                {selectedCourse.seatsOpen > 0 ? 'Enroll in Course' : 'No Seats Available'}
                            </button>
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>


    )
}