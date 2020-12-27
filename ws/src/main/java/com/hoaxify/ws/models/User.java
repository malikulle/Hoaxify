package com.hoaxify.ws.models;

import com.hoaxify.ws.shared.annotations.FileType;
import com.hoaxify.ws.shared.annotations.UniqueUsername;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Entity
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @NotNull(message = "{hoaxify.validation.constraints.NotNull.message}")
    @NotBlank(message = "{hoaxify.validation.constraints.NotNull.message}")
    @UniqueUsername
    private String username;

    @NotNull(message = "{hoaxify.validation.constraints.displayName.NotNull.message}")
    @Size(min = 4, max = 255)
    private String displayName;

    @NotNull
    @NotBlank
    @Size(min = 8, max = 255)
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",message = "{hoaxify.validation.constraints.password.Pattern.message}")
    private String password;

    @Lob
    @FileType(types = {"jpeg","png"})
    private String image;

    @OneToMany(mappedBy="user", cascade=CascadeType.REMOVE)
    private List<Hoax> hoaxes;

    @OneToMany(mappedBy="user", cascade=CascadeType.REMOVE)
    private List<Token> tokens;

    private Date createdAt;
    private Date updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = new Date();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = new Date();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return AuthorityUtils.createAuthorityList("Role_user");
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
