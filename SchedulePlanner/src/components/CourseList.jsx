import React, { useState } from 'react';
import './Courses.css';

export default function CourseList() {

    // Sample class data - this will be replaced with actual class data
    const [courseList, setCourseList] = useState([
        {
            id: 1,
            name: "Computer Science 101",
            startTime: "09:00",
            endTime: "10:30",
            room: "Room 201",
            instructor: "Dr. Smith",
            courseDescription: "Introduction to Computer Science",
            color: "#4CAF50"
        },
        {
            id: 2,
            name: "Mathematics 205",
            startTime: "11:00",
            endTime: "12:15",
            room: "Room 305",
            instructor: "Prof. Johnson",
            courseDescription: "Advanced Calculus",
            color: "#2196F3"
        },
        {
            id: 3,
            name: "Physics Lab",
            startTime: "14:00",
            endTime: "16:00",
            room: "Lab 102",
            instructor: "Dr. Williams",
            courseDescription: "Experimental Physics",
            color: "#FF9800"
        }
    ]);
    const [selectedCourse, setSelectedCourse] = useState({});

    return (
        <>
            <div className='courseListHeader'>
                <h1>Courses</h1>
                <button className='btn btn-light'>
                    <i className="fa fa-plus" aria-hidden="true"></i>
                </button>

            </div>
            <div className="table-responsive">
                <table className="table table-hover">
                    <tbody>
                        {courseList.map((course) => (
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
                                    >
                                        <i className='fa fa-trash' aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
        </>
    );
}