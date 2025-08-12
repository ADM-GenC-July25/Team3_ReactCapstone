import { useState } from 'react';
import CourseList from './CourseList';
import AddCourses from './AddCourses';
import { useSchedule } from '../contexts/ScheduleContext';

export default function CourseSelection() {
    const { courses, addCourse, updateCourse, removeCourse, conflicts, clearConflicts } = useSchedule();
    const [isAddCourses, setIsAddCourses] = useState(false);

    return (
        <>
            <CourseList
                courseList={courses}
                setCourseList={updateCourse}
                setIsAddCourses={setIsAddCourses}
                isAddCourses={isAddCourses}
                onRemoveCourse={removeCourse}
            />
            {isAddCourses && (
                <AddCourses
                    courseList={courses}
                    setCourseList={addCourse}
                    setIsAddCourses={setIsAddCourses}
                    conflicts={conflicts}
                    clearConflicts={clearConflicts}
                />
            )}
        </>
    );
}