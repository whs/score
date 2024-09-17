<?php

namespace Whs\Score\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Whs\Score\Repository\FileListRepository;

class ScoreController extends AbstractController {
    public function __construct(protected FileListRepository $fileList){}

    public function main(): Response {
        $this->denyAccessUnlessGranted('ROLE_ADMIN');
        $this->fileList->load();
        return $this->render("home.html.twig", [
            "files" => $this->fileList->getFileList(),
        ]);
    }
}
