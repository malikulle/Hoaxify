package com.hoaxify.ws.controllers;

import com.hoaxify.ws.models.FileAttachment;
import com.hoaxify.ws.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
public class FileController {

    @Autowired
    FileService fileService;

    @PostMapping("/api/1.0/hoax-attachment")
    public FileAttachment saveHoaxAttachment(MultipartFile file){
        FileAttachment attachment = fileService.saveHoaxAttachment(file);
        return attachment;
    }
}
