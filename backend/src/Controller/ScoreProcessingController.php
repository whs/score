<?php

namespace Whs\Score\Controller;

use League\Flysystem\FilesystemOperator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Whs\Score\FileFormat\FileFormatFactory;
use Whs\Score\Repository\FileListRepository;

#[IsGranted('ROLE_ADMIN')]
class ScoreProcessingController extends AbstractController
{
    public function __construct(
        protected FileListRepository $fileListRepo,
        protected FilesystemOperator $internalStorage,
        private FileFormatFactory    $fileFormatFactory,
    )
    {
    }
}