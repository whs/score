<?php

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Config\SecurityConfig;

return static function (ContainerConfigurator $container, SecurityConfig $security): void {
    // User accounts
    $userProvider = $security->provider('user_provider')->memory();
    // Default password is 'admin'
    // Generate new hashed password at https://gchq.github.io/CyberChef/#recipe=Bcrypt(12)&input=YWRtaW4
    // (Change the "admin" at top right to password, then use the output)
    $userProvider->user('admin')->password('$2a$12$NtRlmPZ7pH0s8PTzptKS.OEup0zKLydHC2S0.t8zkf4t68sDd10BC')->roles(['ROLE_ADMIN']);
};
