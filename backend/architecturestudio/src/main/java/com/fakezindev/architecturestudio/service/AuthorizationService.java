package com.fakezindev.architecturestudio.service;

import com.fakezindev.architecturestudio.repository.ClientRepository;
import com.fakezindev.architecturestudio.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {

    public final UserRepository userRepository;
    public final ClientRepository clientRepository;

    public AuthorizationService(UserRepository userRepository,  ClientRepository clientRepository) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
    }

    // O Spring Security vai chamar este metodo automaticamente na hora do Login!
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // 1. Tenta achar na lista de Admins (tb_users)
        var user = userRepository.findByUsername(usernameOrEmail);
        if (user.isPresent()) {
            return user.get(); // Se achou o Admin, libera a entrada!
        }

        // 2. Se não achou no Admin, tenta achar na lista de Clientes (tb_clients) usando o e-mail
        var client = clientRepository.findByEmail(usernameOrEmail);
        if (client.isPresent()) {
            return client.get(); // Se achou o Cliente, libera a entrada!
        }

        // 3. Se não achou em lugar nenhum, barra na porta
        throw new UsernameNotFoundException("Usuário ou e-mail não encontrado!");
    }
}
