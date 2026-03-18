package org.hotelbooking.authservice.service;

import lombok.RequiredArgsConstructor;
import org.hotelbooking.authservice.dto.AuthResponse;
import org.hotelbooking.authservice.dto.LoginRequest;
import org.hotelbooking.authservice.dto.RegisterRequest;
import org.hotelbooking.authservice.entitiy.Auth;
import org.hotelbooking.authservice.repository.AuthRepository;
import org.hotelbooking.authservice.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    public String registeruser(RegisterRequest request) {
        if (authRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        Auth auth = new Auth();
        auth.setEmail(request.getEmail());
        auth.setPassword(passwordEncoder.encode(request.getPassword()));
        auth.setRole(request.getRole());

        authRepository.save(auth);
        return "auth registered successfully";

    }

    public AuthResponse loginuser(LoginRequest request){

        Auth auth = authRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("auth not found"));

        if(!passwordEncoder.matches(request.getPassword(),auth.getPassword())){
            throw  new RuntimeException("Invalid Password");
        }

        String token = jwtUtil.generateToken(request.getEmail());

        return new AuthResponse(token, auth.getRole().name(), "Login successful", "success");
    }

}

