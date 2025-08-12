import { useState } from 'react';
import './Courses.css';

export default function CourseList({ courseList, setCourseList, setIsAddCourses }) {

    const [selectedCourse, setSelectedCourse] = useState({});

    function handleDelete(id) {
        const updatedCourseList = courseList.map(course =>
            course.id === id ? { ...course, isSelected: false } : course
        );
        setCourseList(updatedCourseList);
    }

    return (
        <>
            <div className="course-header">
                <h1>Courses</h1>
                <p>Add, delete and view courses</p>
            </div>

            <div className='courseListContainer'>
                <div className='courseListHeader'>
                    <h2>Selected Courses</h2>
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

        </>
    );
}