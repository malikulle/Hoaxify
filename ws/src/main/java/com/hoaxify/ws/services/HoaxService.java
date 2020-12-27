package com.hoaxify.ws.services;

import com.hoaxify.ws.models.FileAttachment;
import com.hoaxify.ws.models.Hoax;
import com.hoaxify.ws.models.User;
import com.hoaxify.ws.repositories.FileAttachmentRepository;
import com.hoaxify.ws.repositories.HoaxRepository;
import com.hoaxify.ws.shared.viewModels.HoaxSubmitViewModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class HoaxService {

    HoaxRepository hoaxRepository;
    UserService userService;
    FileAttachmentRepository fileAttachmentRepository;
    FileService fileService;

    public HoaxService(HoaxRepository hoaxRepository,UserService userService,FileAttachmentRepository fileAttachmentRepository,FileService fileService) {
        this.hoaxRepository = hoaxRepository;
        this.userService = userService;
        this.fileAttachmentRepository = fileAttachmentRepository;
        this.fileService = fileService;
    }

    public void save(HoaxSubmitViewModel hoaxSubmitViewModel, User user) {
        Hoax hoax = new Hoax();
        hoax.setContent(hoaxSubmitViewModel.getContent());
        hoax.setUser(user);
        hoaxRepository.save(hoax);
        Optional<FileAttachment> optionalFileAttachment = fileAttachmentRepository.findById(hoaxSubmitViewModel.getAttachmentId());
        if(optionalFileAttachment.isPresent()) {
            FileAttachment fileAttachment = optionalFileAttachment.get();
            fileAttachment.setHoax(hoax);
            fileAttachmentRepository.save(fileAttachment);
        }
    }

    public Page<Hoax> getHoaxes(Pageable page) {
        return hoaxRepository.findAll(page);
    }

    public Page<Hoax> getHoaxesOfUser(String username, Pageable page) {
        User user = userService.getByUsername(username);
        return hoaxRepository.findByUser(user,page);
    }

    public Page<Hoax> getOldHoaxes(long id, String username, Pageable page) {
        Specification<Hoax> specification= idLessThan(id);
        if (username != null){
            User user = userService.getByUsername(username);
            specification = specification.and(userIs(user));
        }
        return hoaxRepository.findAll(specification,page);
    }

    public Page<Hoax> getOldHoaxesOfUser(String username, long id, Pageable page) {
        User user = userService.getByUsername(username);
        return hoaxRepository.findByIdLessThanAndUser(id,user,page);
    }

    public long getNewHoaxesCount(long id, String username) {
        Specification<Hoax> specification = idGreaterThan(id);
        if(username != null){
            User user = userService.getByUsername(username);
            specification = specification.and(userIs(user));
        }
        return hoaxRepository.count(specification);
    }

    public long getNewHoaxesCountOfUser(String username, long id) {
        User user = userService.getByUsername(username);
        return hoaxRepository.countByIdGreaterThanAndUser(id,user);
    }

    public List<Hoax> getNewHoaxes(long id, String username, Sort sort) {
        Specification<Hoax> specification = idGreaterThan(id);
        if(username != null){
            User user = userService.getByUsername(username);
            specification = specification.and(userIs(user));
        }
        return hoaxRepository.findAll(specification,sort);
    }

    public List<Hoax> getNewHoaxesOfUser(long id, String username, Sort sort) {
        User user = userService.getByUsername(username);
        return hoaxRepository.findByIdGreaterThanAndUser(id,user,sort);
    }

    Specification<Hoax> idLessThan(long id){
        return ( root,  criteriaQuery, criteriaBuilder) -> {
            return criteriaBuilder.lessThan(root.get("id"),id);
        };
    }
    Specification<Hoax> idGreaterThan(long id){
        return ( root,  criteriaQuery, criteriaBuilder) -> {
            return criteriaBuilder.greaterThan(root.get("id"),id);
        };
    }
    Specification<Hoax> userIs(User user){
        return ( root,  criteriaQuery, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("user"),user);
        };
    }

    public void delete(long id) {
        Hoax inDb = hoaxRepository.getOne(id);
        if(inDb.getFileAttachment() != null){
            String fileName = inDb.getFileAttachment().getName();
            fileService.deleteAttachmentFile(fileName);
        }
        hoaxRepository.deleteById(id);
    }
}


