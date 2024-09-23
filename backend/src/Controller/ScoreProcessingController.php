<?php

namespace Whs\Score\Controller;

use League\Flysystem\FilesystemOperator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Whs\Score\FileFormat\FileFormatFactory;
use Whs\Score\Model\File;
use Whs\Score\Model\FileState;
use Whs\Score\Repository\FileListRepository;

#[IsGranted('ROLE_ADMIN')]
class ScoreProcessingController extends AbstractController
{
    public function __construct(
        protected FileListRepository $fileListRepo,
        protected FilesystemOperator $internalStorage,
        private FileFormatFactory    $fileFormatFactory,
    ) {}

    public function process(Request $request): Response {
        $id = $request->query->get('id');
        if (!$id) {
            return new Response('Missing ID', 400);
        }

        $this->fileListRepo->load();
        $file = $this->fileListRepo->getFileList()->getFile($id);
        if (!$file) {
            return new Response('Missing file', 404);
        }

        $stageMethod = [
            FileState::Uploaded->value => 'computeStats',
            FileState::Processing->value => 'generateUserFiles',
        ];

        $method = $stageMethod[$file->getState()->value];
        if (!$method) {
            $this->addFlash('error', 'ไฟล์อยู่ในสถานะ ' . $file->getState() . ' ไม่สามารถประมวลผลได้');
            return $this->redirectToRoute('home');
        }

        return $this->$method($request, $file);
    }

    private function computeStats(Request $request, File $file): Response {

    }

    private function generateUserFiles(Request $request, File $file): Response {

    }
}