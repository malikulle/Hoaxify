package com.hoaxify.ws.repositories;

import com.hoaxify.ws.models.Hoax;
import com.hoaxify.ws.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaxRepository extends JpaRepository<Hoax,Long>, JpaSpecificationExecutor<Hoax> {

    Page<Hoax> findByUser(User user, Pageable page);

    Page<Hoax> findByIdLessThan(long id,Pageable page);

    Page<Hoax> findByIdLessThanAndUser(long id,User user,Pageable page);

    long countByIdGreaterThan(long id);

    long countByIdGreaterThanAndUser(long id,User user);

    List<Hoax> findByIdGreaterThan(long id, Sort sort);

    List<Hoax> findByIdGreaterThanAndUser(long id,User user,Sort sort);
}
