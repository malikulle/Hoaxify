package com.hoaxify.ws.controllers;

import com.hoaxify.ws.models.Hoax;
import com.hoaxify.ws.models.User;
import com.hoaxify.ws.services.HoaxService;
import com.hoaxify.ws.shared.GenericResponse;
import com.hoaxify.ws.shared.annotations.CurrentUser;
import com.hoaxify.ws.shared.viewModels.HoaxSubmitViewModel;
import com.hoaxify.ws.shared.viewModels.HoaxViewModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api/1.0/hoaxes")
public class HoaxController {

    @Autowired
    HoaxService hoaxService;

    @GetMapping
    public Page<HoaxViewModel> getHoaxes(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page) {
        return hoaxService.getHoaxes(page).map(HoaxViewModel::new);
    }

    @PostMapping
    public GenericResponse postHoax(@Valid @RequestBody HoaxSubmitViewModel hoax, @CurrentUser User user) {
        hoaxService.save(hoax, user);
        return new GenericResponse("Hoax Created");
    }

    @GetMapping("{username}/users")
    public Page<HoaxViewModel> getUserHoaxes(@PathVariable String username, @PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page) {
        return hoaxService.getHoaxesOfUser(username, page).map(HoaxViewModel::new);
    }

    @GetMapping({"{id:[0-9]+}","{username}/users/{id:[0-9]+}"})
    public ResponseEntity<?> getHoaxesRelative(@PageableDefault(sort = "id", direction = Sort.Direction.DESC) Pageable page,
                                               @PathVariable long id,
                                               @RequestParam(name = "count", required = false, defaultValue = "false") boolean count,
                                               @RequestParam(name = "direction", defaultValue = "before") String direction,
                                               @PathVariable(required = false) String username) {
        if (count) {
            long newHoaxCount = hoaxService.getNewHoaxesCount(id,username);
            Map<String, Long> response = new HashMap<>();
            response.put("count", newHoaxCount);
            return ResponseEntity.ok(response);
        }
        if (direction.equals("after")) {
            List<Hoax> newHoaxes = hoaxService.getNewHoaxes(id, username,page.getSort());
            List<HoaxViewModel> newHoaxesVm = newHoaxes.stream().map(HoaxViewModel::new).collect(Collectors.toList());
            return ResponseEntity.ok(newHoaxesVm);
        }
        return ResponseEntity.ok(hoaxService.getOldHoaxes(id, username,page).map(HoaxViewModel::new));
    }

    @DeleteMapping("{id:[0-9]+}")
    @PreAuthorize("@hoaxSecurityService.isAllowedToDelete(#id,principal)")
    public GenericResponse deleteHoax(@PathVariable long id){
        hoaxService.delete(id);
        return new GenericResponse("Hoax Removed");
    }
}
