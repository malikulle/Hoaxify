package com.hoaxify.ws.repositories;

import com.hoaxify.ws.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token,String> {

}
