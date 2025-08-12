import React, { useState } from 'react';
import './Courses.css';

export default function CourseList({ courseList, setCourseList, setIsAddCourses, onRemoveCourse }) {

    const [selectedCourse, setSelectedCourse] = useState({});
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState({});

    function handleDelete(id) {
        if (onRemoveCourse) {
            onRemoveCourse(id);
        } else {
            const updatedCourseList = courseList.map(course =>
                course.id === id ? { ...course, isSelected: false } : course
            );
            setCourseList(updatedCourseList);
        }
    }

    function handleEdit(course) {
        setEditingCourse(course);
        setShowEditForm(true);
    }

    function handleUpdateCourse(updatedCourse) {
        if (setCourseList && typeof setCourseList === 'function') {
            setCourseList(updatedCourse.id, updatedCourse);
        }
        setShowEditForm(false);
        setEditingCourse({});
    }

    return (
        <>
            <div className='courseListContainer'>
                <div className='courseListHeader'>
                    <h1>Courses</h1>
                    <button
                        className='btn btn-light'
                        onClick={() => setIsAddCourses(true)}
                    >
                        <i className="fa fa-plus" aria-hidden="true"></i>
                    </button>

                </div>
                <div className="table-responsive">
                    <table className="table table-hover">
                        <tbody>
                            {courseList
                                .filter(course => course.isSelected)
                                .map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                value={course.id}
                                            />
                                        </td>
                                        <td className='text-left'>{course.name}</td>
                                        <td>
                                            <button type="button"
                                                className="btn btn-outline-info"
                                                data-toggle="modal"
                                                data-target="#exampleModalCenter"
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                <i className="fa fa-info-circle"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button type="button"
                                                className="btn btn-outline-danger"
                                                data-toggle="modal"
                                                data-target="#deleteCourseModalCenter"
                                                onClick={() => setSelectedCourse(course)}
                                            >
                                                <i className='fa fa-trash' aria-hidden="true"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal to view course details */}
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">
                                <span
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
                            <p>
                                <strong>Time:</strong>
                                <br />
                                {selectedCourse.startTime} - {selectedCourse.endTime}
                            </p>
                            <p>
                                <strong>Room:</strong>
                                <br />
                                {selectedCourse.room}
                            </p>
                            <p>
                                <strong>Instructor:</strong>
                                <br />
                                {selectedCourse.instructor}
                            </p>
                            <p>
                                <strong>Description:</strong> <br />
                                {selectedCourse.courseDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal to confirm course deletion */}
            <div className="modal fade" id="deleteCourseModalCenter" tabIndex="-1" role="dialog" aria-labelledby="deleteCourseModalCenter" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteCourseModalLongTitle">
                                <span
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
                            <p>Are you sure you want to delete this course?</p>
                        </div>
                        <div class="modal-footer">
                            <button
                                type="button"
                                class="btn btn-light"
                                data-dismiss="modal"
                                onClick={() => handleDelete(selectedCourse.id)}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                class="btn btn-warning"
                                data-dismiss="modal"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            {/* Edit Course Form */}
            {showEditForm && (
                <div className="edit-form">
                    <h3>Edit Course</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Course Name:</label>
                            <input
                                type="text"
                                value={editingCourse.name || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                                placeholder="Course name"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Subject:</label>
                            <input
                                type="text"
                                value={editingCourse.subject || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, subject: e.target.value})}
                                placeholder="Subject code"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Course Number:</label>
                            <input
                                type="text"
                                value={editingCourse.course || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, course: e.target.value})}
                                placeholder="Course number"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Section:</label>
                            <input
                                type="text"
                                value={editingCourse.section || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, section: e.target.value})}
                                placeholder="Section number"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Days:</label>
                            <select
                                multiple
                                value={editingCourse.days || []}
                                onChange={(e) => {
                                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                                    setEditingCourse({...editingCourse, days: selectedOptions});
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
                                value={editingCourse.startTime || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, startTime: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>End Time:</label>
                            <input
                                type="time"
                                value={editingCourse.endTime || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, endTime: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Room:</label>
                            <input
                                type="text"
                                value={editingCourse.room || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, room: e.target.value})}
                                placeholder="Room number"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Instructor:</label>
                            <input
                                type="text"
                                value={editingCourse.instructor || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, instructor: e.target.value})}
                                placeholder="Instructor name"
                            />
                        </div>
                        
                        <div className="form-group full-width">
                            <label>Description:</label>
                            <textarea
                                value={editingCourse.courseDescription || ''}
                                onChange={(e) => setEditingCourse({...editingCourse, courseDescription: e.target.value})}
                                placeholder="Course description"
                                rows="3"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Color:</label>
                            <input
                                type="color"
                                value={editingCourse.color || '#4CAF50'}
                                onChange={(e) => setEditingCourse({...editingCourse, color: e.target.value})}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Weeks:</label>
                            <input
                                type="number"
                                value={editingCourse.weeks || 15}
                                onChange={(e) => setEditingCourse({...editingCourse, weeks: parseInt(e.target.value)})}
                                min="1"
                                max="20"
                            />
                        </div>
                    </div>
                    
                    <div className="form-actions">
                        <button 
                            className="save-button"
                            onClick={() => handleUpdateCourse(editingCourse)}
                        >
                            Update Course
                        </button>
                        <button 
                            className="cancel-button"
                            onClick={() => {
                                setShowEditForm(false);
                                setEditingCourse({});
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}



        </>
    );
}