import { useState } from 'react';
import { useSchedule } from '../contexts/ScheduleContext';
import './Courses.css';

export default function CourseList() {
    const { getEnrolledCourses, updateCourse, removeCourse } = useSchedule();
    const [selectedCourse, setSelectedCourse] = useState({});

    // Get enrolled courses from ScheduleContext
    const enrolledCourses = getEnrolledCourses();

    function handleDelete(id) {
        // Update course to not selected rather than removing completely
        updateCourse(id, { isSelected: false, status: 'Not Enrolled' });
    }

    return (
        <>
            <div className='courseListContainer'>
                <div className='courseListHeader'>
                    <h1>Enrolled Courses</h1>
                </div>
                <div className="table-responsive">
                    {enrolledCourses.length === 0 ? (
                        <div className="no-courses">
                            <p>No courses enrolled yet. Browse available courses to add them to your schedule.</p>
                        </div>
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Course</th>
                                    <th>Code</th>
                                    <th>Time</th>
                                    <th>Days</th>
                                    <th>Instructor</th>
                                    <th>Details</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {enrolledCourses.map((course) => (
                                    <tr key={course.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={course.isSelected}
                                                onChange={(e) => updateCourse(course.id, { isSelected: e.target.checked })}
                                            />
                                        </td>
                                        <td className='text-left'>{course.name}</td>
                                        <td className='text-left'>{course.subject} {course.course}-{course.section}</td>
                                        <td className='text-left'>{course.startTime} - {course.endTime}</td>
                                        <td className='text-left'>{Array.isArray(course.days) ? course.days.join(', ') : course.days}</td>
                                        <td className='text-left'>{course.instructor}</td>
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
                                                <i className='fa fa-trash' aria-hidden="false"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal to view course details */}
            <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="false">
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
                                <span aria-hidden="false">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>
                                <strong>Course Code:</strong><br />
                                {selectedCourse.subject} {selectedCourse.course}-{selectedCourse.section}
                            </p>
                            <p>
                                <strong>Time:</strong>
                                <br />
                                {selectedCourse.startTime} - {selectedCourse.endTime}
                            </p>
                            <p>
                                <strong>Days:</strong>
                                <br />
                                {Array.isArray(selectedCourse.days) ? selectedCourse.days?.join(', ') : selectedCourse.days}
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
                                <strong>Duration:</strong>
                                <br />
                                {selectedCourse.weeks} weeks
                            </p>
                            <p>
                                <strong>Description:</strong> <br />
                                {selectedCourse.courseDescription}
                            </p>
                            <p>
                                <strong>Status:</strong> <br />
                                {selectedCourse.status}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal to confirm course deletion */}
            <div className="modal fade" id="deleteCourseModalCenter" tabIndex="-1" role="dialog" aria-labelledby="deleteCourseModalCenter" aria-hidden="false">
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
                                Remove {selectedCourse.name}
                            </h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="false">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to remove this course from your schedule?</p>
                            <p><strong>Note:</strong> This will unenroll you from the course.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger"
                                data-dismiss="modal"
                                onClick={() => handleDelete(selectedCourse.id)}
                            >
                                Yes, Remove Course
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}