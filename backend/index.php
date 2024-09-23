<?php

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;
use Symfony\Component\Routing\Loader\Configurator\RoutingConfigurator;

require __DIR__.'/vendor/autoload.php';

class Kernel extends BaseKernel implements CompilerPassInterface {
    use MicroKernelTrait;

    public function registerBundles(): array {
        return [
            new Symfony\Bundle\FrameworkBundle\FrameworkBundle(),
            new Symfony\Bundle\SecurityBundle\SecurityBundle(),
            new Symfony\Bundle\TwigBundle\TwigBundle(),
            new \Nelmio\SecurityBundle\NelmioSecurityBundle(),
            new \Pentatrion\ViteBundle\PentatrionViteBundle(),
            new \League\FlysystemBundle\FlysystemBundle(),
        ];
    }

    protected function configureContainer(ContainerConfigurator $container): void {
        $container->import(__DIR__.'/config/**/*');
        $container->import('config.php');
    }

    public function process(ContainerBuilder $container): void {
        // This requires kernel.secret, but we don't use it
        // (see symfony discussion 49455)
        $container->set('fragment.uri_generator', null);
    }

    protected function configureRoutes(RoutingConfigurator $routes): void {
        $routes->import('security.route_loader.logout', 'service');
        // Our asset pipeline is relative - don't use any subpath here
        $routes->add('login', '/login')->controller(['\Whs\Score\Controller\LoginController', 'login']);
        $routes->add('home', '/admin')->controller(['\Whs\Score\Controller\ScoreController', 'main']);
        $routes->add('create', '/admin@create')->methods(['POST'])->controller(['\Whs\Score\Controller\ScoreController', 'create']);
        $routes->add('delete', '/admin@delete')->methods(['POST'])->controller(['\Whs\Score\Controller\ScoreController', 'delete']);
        $routes->add('upload', '/admin@upload')->methods(['POST'])->controller(['\Whs\Score\Controller\ScoreController', 'upload']);
        $routes->add('download', '/download')->controller(['\Whs\Score\Controller\ScoreController', 'download']);
        $routes->add('process', '/process')->controller(['\Whs\Score\Controller\ScoreProcessingController', 'process']);
    }
}

$kernel = new Kernel('prod', true);
$request = Request::createFromGlobals();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);