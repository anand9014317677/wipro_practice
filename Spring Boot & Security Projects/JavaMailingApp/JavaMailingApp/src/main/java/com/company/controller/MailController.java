package com.company.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.company.bean.MailDetail;
import com.company.service.MailService;

@RestController
@RequestMapping("/api")
public class MailController {

    @Autowired
    private MailService mailService;

    // Sending normal email
    @PostMapping("/send-mail")
    public String sendMail(@RequestBody MailDetail mailDetail) {
        return mailService.sendMail(mailDetail);
    }

    // Sending email with attachment
    @PostMapping("/send-mail-attachment")
    public String sendMailWithAttachment(@RequestBody MailDetail mailDetail) {
        return mailService.sendMailWithAttachment(mailDetail);
    }
}
