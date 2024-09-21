<?php

namespace Whs\Score\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Whs\Score\Form\FileType;
use Whs\Score\Model\File;
use Whs\Score\Model\FileState;
use Whs\Score\Repository\FileListRepository;

#[IsGranted('ROLE_ADMIN')]
class ScoreController extends AbstractController {
    public function __construct(protected FileListRepository $fileListRepo){}

    public function main(): Response {
        $this->fileListRepo->load();

        $createForm = $this->createForm(FileType::class, null, [
            'action' => $this->generateUrl('create'),
        ]);

        return $this->render("home.html.twig", [
            "files" => $this->fileListRepo->getFileList()->getFiles(),
            "create_form" => $createForm,
        ]);
    }

    public function create(Request $request): Response {
        $file = new File();
        $file->setState(FileState::Created);

        $form = $this->createForm(FileType::class, $file);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->fileListRepo->load();
            $this->fileListRepo->getFileList()->addFile($file);
            $this->fileListRepo->save();
            $this->fileListRepo->savePublic();
            $this->addFlash('success', 'เพิ่มไฟล์สำเร็จ');
        }else{
            $this->addFlash('error', 'กรอกฟอร์มไม่ถูกต้อง');
        }
        return $this->redirectToRoute('home');
    }
}
