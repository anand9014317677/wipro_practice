package com.company.service;

import com.company.bean.MailDetail;

public interface MailService {

    String sendMail(MailDetail mailDetail);

    String sendMailWithAttachment(MailDetail mailDetail);
}
