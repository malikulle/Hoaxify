package com.hoaxify.ws.services;

import com.hoaxify.ws.models.Hoax;
import com.hoaxify.ws.models.User;
import com.hoaxify.ws.repositories.HoaxRepository;
import com.hoaxify.ws.shared.error.AuthorizationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class HoaxSecurityService {

    @Autowired
    HoaxRepository hoaxRepository;

    public boolean isAllowedToDelete(long id, User user){
        Optional<Hoax> optionalHoax = hoaxRepository.findById(id);
        if(!optionalHoax.isPresent()){
            return false;
        }
        Hoax hoax = optionalHoax.get();
        if(hoax.getUser().getId() != user.getId()){
            return false;
        }
        return true;
    }
}
