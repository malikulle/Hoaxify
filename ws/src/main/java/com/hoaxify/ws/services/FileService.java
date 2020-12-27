package com.hoaxify.ws.services;

import com.hoaxify.ws.configuration.AppConfiguration;
import com.hoaxify.ws.models.FileAttachment;
import com.hoaxify.ws.models.User;
import com.hoaxify.ws.repositories.FileAttachmentRepository;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@EnableScheduling
public class FileService {

    AppConfiguration appConfiguration;
    Tika tika;
    FileAttachmentRepository fileAttachmentRepository;

    public FileService(AppConfiguration appConfiguration, FileAttachmentRepository fileAttachmentRepository) {
        this.appConfiguration = appConfiguration;
        this.tika = new Tika();
        this.fileAttachmentRepository = fileAttachmentRepository;
    }

    public String writeBase64EncodedStringToFile(String image) throws IOException {
        String fileName = this.generateRandomName() + ".png";
        File target = new File(appConfiguration.getProfileStoragePath() + "/" + fileName);
        OutputStream outputStream = new FileOutputStream(target);

        byte[] base64Encoded = Base64.getDecoder().decode(image);
        outputStream.write(base64Encoded);
        outputStream.close();
        return fileName;
    }

    public String generateRandomName() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    public void deleteProfileImage(String oldImageName) {
        if (oldImageName == null) {
            return;
        }
        this.deleteFile(Paths.get(appConfiguration.getProfileStoragePath(), oldImageName));

    }

    public void deleteAttachmentFile(String oldImageName) {
        if (oldImageName == null) {
            return;
        }
        this.deleteFile(Paths.get(appConfiguration.getAttachmentStoragePath(), oldImageName));
    }

    private void deleteFile(Path path){
        try {
            Files.deleteIfExists(path);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public String detectType(String value) {
        byte[] base64Encoded = Base64.getDecoder().decode(value);
        return tika.detect(base64Encoded);
    }

    public FileAttachment saveHoaxAttachment(MultipartFile multipartFile) {
        String fileName = this.generateRandomName() + ".png";
        File target = new File(appConfiguration.getAttachmentStoragePath() + "/" + fileName);
        OutputStream outputStream = null;
        String fileType = null;
        try {
            outputStream = new FileOutputStream(target);
            outputStream.write(multipartFile.getBytes());
            outputStream.close();

            fileType = tika.detect(multipartFile.getBytes());

        } catch (IOException e) {
            e.printStackTrace();
        }
        FileAttachment fileAttachment = new FileAttachment();
        fileAttachment.setName(fileName);
        fileAttachment.setFileType(fileType);
        fileAttachment.setDate(new Date());
        return fileAttachmentRepository.save(fileAttachment);
    }

    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void cleanUpStorage() {
        Date twentyFourHourAgo = new Date(System.currentTimeMillis() - 10 * 60 * 1000);
        List<FileAttachment> filesToDeleted = fileAttachmentRepository.findByDateBeforeAndHoaxIsNull(twentyFourHourAgo);
        for (FileAttachment file : filesToDeleted) {
            this.deleteAttachmentFile(file.getName());
            fileAttachmentRepository.deleteById(file.getId());
            System.out.println("Deleted");
        }
    }

    public void deleteOldStoredFilesForUser(User user) {
        this.deleteProfileImage(user.getImage());
        List<FileAttachment> filesToBeRemoved = fileAttachmentRepository.findByHoaxUser(user);
        for (FileAttachment fileAttachment : filesToBeRemoved){
            this.deleteAttachmentFile(fileAttachment.getName());
        }
    }
}
