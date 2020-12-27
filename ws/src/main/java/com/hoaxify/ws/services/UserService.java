package com.hoaxify.ws.services;

import com.hoaxify.ws.models.User;
import com.hoaxify.ws.repositories.UserRepository;
import com.hoaxify.ws.shared.error.NotFoundException;
import com.hoaxify.ws.shared.viewModels.UserUpdateViewModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.*;
import java.util.Base64;
import java.util.List;

@Service
public class UserService {

    UserRepository userRepository;

    PasswordEncoder passwordEncoder;

    FileService fileService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,FileService fileService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    public User save(User model) {
        String encryptedPassword = passwordEncoder.encode(model.getPassword());
        model.setPassword(encryptedPassword);

        return userRepository.save(model);
    }

    public Page<User> getUsers(Pageable page, User user) {
        if (user != null) {
            return userRepository.findByUsernameNot(user.getUsername(), page);
        }
        return userRepository.findAll(page);
    }

    public User getByUsername(String username) {
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new NotFoundException();
        }
        return user;
    }

    public User updateUser(String username, UserUpdateViewModel model) {
        User userInDb = this.getByUsername(username);
        userInDb.setDisplayName(model.getDisplayName());
        if (model.getImage() != null) {
            String oldImageName = userInDb.getImage();
            try {
                String storedFileName = fileService.writeBase64EncodedStringToFile(model.getImage());
                fileService.deleteProfileImage(oldImageName);
                userInDb.setImage(storedFileName);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return userRepository.save(userInDb);
    }

    public void deleteUser(String username) {
        User user = this.getByUsername(username);
        fileService.deleteOldStoredFilesForUser(user);
        userRepository.delete(user);
    }
}
