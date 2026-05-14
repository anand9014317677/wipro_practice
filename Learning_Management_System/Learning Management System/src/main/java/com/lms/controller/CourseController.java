package com.lms.controller;

import com.lms.entity.Course;
import com.lms.entity.Student;
import com.lms.service.CourseService;
import com.lms.service.StudentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService =
            new CourseService();

    private final StudentService studentService =
            new StudentService();

    /*
        COURSE FORM
     */

    @GetMapping("/form")
    public String courseForm(Model model) {

        model.addAttribute(
                "course",
                new Course()
        );

        model.addAttribute(
                "students",
                studentService.getAllStudents()
        );

        return "course-form";
    }

    /*
        SAVE COURSE + ASSIGN TO STUDENT
     */

    @PostMapping("/save")
    public String saveCourse(

            @ModelAttribute Course course,

            @RequestParam("studentId")
            Long studentId
    ) {

        Student student =
                studentService.getStudentById(studentId);

        course.getStudents().add(student);

        courseService.saveCourse(course);

        return "redirect:/students/view";
    }
}