package com.lms.service;

import com.lms.dao.CourseDao;
import com.lms.entity.Course;

import java.util.List;

public class CourseService {

    private final CourseDao courseDao =
            new CourseDao();

    public void saveCourse(Course course) {

        courseDao.saveCourse(course);
    }

    public List<Course> getAllCourses() {

        return courseDao.getAllCourses();
    }
}