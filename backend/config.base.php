<?php

// DO NOT modify this file, modify config.php

use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Config\FrameworkConfig;
use Symfony\Config\NelmioSecurityConfig;
use Symfony\Config\SecurityConfig;

return static function (
    ContainerConfigurator $container,
    FrameworkConfig $framework,
    SecurityConfig $security,
    NelmioSecurityConfig $nelmio,
): void {
    $framework->session()->enabled(true)
        ->handlerId(null) // Use PHP session
        ->cookieSecure('auto')->cookieSamesite(Cookie::SAMESITE_LAX)
        ->storageFactoryId('session.storage.factory.native');
    $framework->csrfProtection()->enabled(true);

    $security->passwordHasher(PasswordAuthenticatedUserInterface::class)->algorithm('auto');

    $security->firewall('dev')
        ->pattern('^/(_(profiler|wdt)|css|images|js)/')
        ->security(false);

    $security->firewall('main')
        ->provider('user_provider')
        ->loginThrottling()
            ->maxAttempts(5)
            ->interval('15 minutes');

    $security->firewall('main')
        ->logout()
        ->path('/logout')
        ->target('login');

    $security->firewall('main')
        ->formLogin()
        ->enableCsrf(true)
        ->loginPath('login')
        ->checkPath('login')
        ->defaultTargetPath('/admin');

    $nelmio->clickjacking()->path('^/.*', 'DENY');
    $nelmio->externalRedirects()->override('home');
    $nelmio->contentType()->nosniff(true);
    $nelmio->referrerPolicy()->enabled(true)->policies(['no-referrer', 'strict-origin-when-cross-origin']);
    $nelmio->csp()
        ->enabled(true)
        ->enforce()
            ->defaultsrc(['self'])
            ->stylesrc(['self', 'https://fonts.googleapis.com'])
            ->fontsrc(['fonts.gstatic.com'])
            ->blockallmixedcontent(true);

    $container->extension('pentatrion_vite', [
        'public_directory' => '',
        'build_directory' => 'frontend',
    ]);
    $framework->assets()->versionStrategy(\Pentatrion\ViteBundle\Asset\ViteAssetVersionStrategy::class);

    $container->extension('flysystem', [
        'storages' => [
            // Internal state storage
            'internal.storage' => [
                'adapter' => 'local',
                'options' => [
                    'directory' => '%kernel.project_dir%/var/storage/internal'
                ]
            ],
            // Publicly available score storage
            'score.storage' => [
                'adapter' => 'local',
                'options' => [
                    'directory' => '%kernel.project_dir%/data/'
                ]
            ],
        ],
    ]);
};
