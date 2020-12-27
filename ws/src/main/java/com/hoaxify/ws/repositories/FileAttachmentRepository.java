package com.hoaxify.ws.repositories;

import com.hoaxify.ws.models.FileAttachment;
import com.hoaxify.ws.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface FileAttachmentRepository extends JpaRepository<FileAttachment,Long> {

    List<FileAttachment> findByDateBeforeAndHoaxIsNull(Date date);

    List<FileAttachment> findByHoaxUser(User user);
}
