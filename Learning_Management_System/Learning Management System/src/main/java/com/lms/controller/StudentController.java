package com.lms.controller;

import com.lms.entity.Student;
import com.lms.service.CourseService;
import com.lms.service.StudentService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService =
            new StudentService();

    private final CourseService courseService =
            new CourseService();

    @GetMapping("/form")
    public String studentForm(Model model) {

        model.addAttribute(
                "student",
                new Student()
        );

        return "student-form";
    }

    @PostMapping("/save")
    public String saveStudent(
            @ModelAttribute Student student
    ) {

        studentService.saveStudent(student);

        return "redirect:/students/view";
    }

    @GetMapping("/view")
    public String viewStudents(Model model) {

        model.addAttribute(
                "students",
                studentService.getAllStudents()
        );

        return "view";
    }

    /*
        ENROLLMENT FORM
     */

    @GetMapping("/enroll")
    public String enrollForm(Model model) {

        model.addAttribute(
                "students",
                studentService.getAllStudents()
        );

        model.addAttribute(
                "courses",
                courseService.getAllCourses()
        );

        return "enroll-form";
    }

    /*
        SAVE ENROLLMENT
     */

    @PostMapping("/enroll")
    public String saveEnrollment(

            @RequestParam("studentId")
            Long studentId,

            @RequestParam("courseIds")
            List<Long> courseIds
    ) {

        studentService.enrollStudent(
                studentId,
                courseIds
        );

        return "redirect:/students/view";
    }
}