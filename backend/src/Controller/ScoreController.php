<?php

namespace Whs\Score\Controller;

use League\Flysystem\FilesystemOperator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\FormErrorIterator;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Whs\Score\FileFormat\FileFormatDeleter;
use Whs\Score\FileFormat\FileFormatFactory;
use Whs\Score\Form\FileDeleteType;
use Whs\Score\Form\FileType;
use Whs\Score\Form\FileUploadType;
use Whs\Score\Model\File;
use Whs\Score\Model\FileState;
use Whs\Score\Repository\FileListRepository;

#[IsGranted('ROLE_ADMIN')]
class ScoreController extends AbstractController {
    public function __construct(
        protected FileListRepository $fileListRepo,
        protected FilesystemOperator $internalStorage,
        private FileFormatFactory $fileFormatFactory,
    ){}

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
            $this->addFlash('error', 'กรอกข้อมูลไม่ถูกต้อง: ' . $this->formatFormError($form->getErrors(true)));
        }
        return $this->redirectToRoute('home');
    }

    public function delete(Request $request): Response {
        $form = $this->createForm(FileDeleteType::class, null, ['csrf_token_id' => 'delete']);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $fileId = $form->get('id')->getData();

            $this->fileListRepo->load();
            $file = $this->fileListRepo->getFileList()->getFile($fileId);
            if (!$file) {
                $this->addFlash('error', 'ไม่พบไฟล์');
            }

            $writer = $this->fileFormatFactory->createFromFile($file);
            if ($writer instanceof FileFormatDeleter) {
                $writer->delete($file);
            }
            try {
                $this->internalStorage->delete($file->getId() . '.csv');
            } catch (\Throwable $e) {
                $this->addFlash('warning', 'ลบไฟล์นำเข้าไม่สำเร็จ เนื่องจาก ' . $e->getMessage());
            }
            $this->fileListRepo->getFileList()->removeFile($fileId);
            $this->fileListRepo->save();
            $this->fileListRepo->savePublic();
            $this->addFlash('success', 'ลบไฟล์สำเร็จ');
        } else {
            $this->addFlash('error', 'กรอกข้อมูลไม่ถูกต้อง: ' . $this->formatFormError($form->getErrors(true)));
        }

        return $this->redirectToRoute('home');
    }

    public function upload(Request $request): Response {
        $form = $this->createForm(FileUploadType::class, null, ['csrf_token_id' => 'upload']);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $fileId = $form->get('id')->getData();
            /* @var $uploadedFile UploadedFile */
            $uploadedFile = $form->get('file')->getData();

            $this->fileListRepo->load();
            $file = $this->fileListRepo->getFileList()->getFile($fileId);
            if(!$file){
                $this->addFlash('error', 'ไม่พบไฟล์');
                return $this->redirectToRoute('home');
            }

            if ($file->getState() !== FileState::Created) {
                $this->addFlash('error', 'ไม่สามารถอัพโหลดไฟล์ได้ เนื่องจากมีไฟล์อยู่แล้ว');
                return $this->redirectToRoute('home');
            }

            $this->internalStorage->writeStream($file->getId() . '.csv', fopen($uploadedFile, 'rb'));
            $file->setState(FileState::Uploaded);
            $this->fileListRepo->save();

            return $this->redirectToRoute('process', ['id' => $file->getId()]);
        } else {
            var_dump($request->files);
            $this->addFlash('error', 'กรอกข้อมูลไม่ถูกต้อง: ' . $this->formatFormError($form->getErrors(true)));
        }

        return $this->redirectToRoute('home');
    }

    public function download(Request $request): Response {
        $id = $request->query->get('id');
        if(!$id) {
            return new Response('Missing ID', 400);
        }

        $this->fileListRepo->load();
        $file = $this->fileListRepo->getFileList()->getFile($id);
        if (!$file) {
            return new Response('Missing file', 404);
        }

        // Safety: The file ID is listed in the repository, so it is trusted
        $filePath = $id . '.csv';
        $fileSize = $this->internalStorage->fileSize($filePath);
        $outputStream = $this->internalStorage->readStream($filePath);

        $response = new StreamedResponse(function () use ($outputStream) {
            fpassthru($outputStream);
        });
        $response->headers->set('Content-Disposition', HeaderUtils::makeDisposition(HeaderUtils::DISPOSITION_ATTACHMENT, $filePath));
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Length', $fileSize);
        return $response;
    }

    protected function formatFormError(FormErrorIterator $errors): string {
        $out = [];

        foreach($errors as $error) {
            $origin = $error->getOrigin();
            if ($origin) {
                $out[] = $origin->getName() . ': ' . $error->getMessage();
            } else {
                $out[] = $error->getMessage();
            }
        }

        return implode('\n', $out);
    }
}
