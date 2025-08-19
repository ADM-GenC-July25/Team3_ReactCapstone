import { useState } from 'react';
import CourseList from './CourseList';
import AddCourses from './AddCourses';
import SampleCourses from './SampleCourses';

export default function CourseSelection({ courseList, setCourseList }) {
    // const [courseList, setCourseList] = useState(SampleCourses);
    const [isAddCourses, setIsAddCourses] = useState(false);

    return (
        <>
            <CourseList
                courseList={courseList}
                setCourseList={setCourseList}
                setIsAddCourses={setIsAddCourses}
                isAddCourses={isAddCourses}
            />
            {isAddCourses && (
                <AddCourses
                    courseList={courseList}
                    setCourseList={setCourseList}
                    setIsAddCourses={setIsAddCourses}
                />
            )}
        </>
    );
}