<?php

namespace Whs\Score\Repository;

use League\Flysystem\FilesystemOperator;
use Symfony\Component\Serializer\SerializerInterface;
use Whs\Score\Model\FileList;

class FileListRepository {
    const FILE_LIST_NAME = 'files.json';
    const PUBLIC_FILE_LIST_NAME = 'files.json';

    protected FileList $fileList;

    public function __construct(
        protected FilesystemOperator $internalStorage,
        protected FilesystemOperator $scoreStorage,
        protected SerializerInterface $serializer,
    ){}

    public function getFileList(): FileList {
        return $this->fileList;
    }

    /**
     * Load file list from storage. Return the file list or null
     * The returned object should not be mutated directly.
     */
    public function load(): FileList {
        if(!$this->internalStorage->has($this::FILE_LIST_NAME)){
            $this->fileList = new FileList();
            return $this->fileList;
        }
        $data = $this->internalStorage->read($this::FILE_LIST_NAME);
        $this->fileList = $this->serializer->deserialize($data, FileList::class, 'json');
        return $this->fileList;
    }

    /**
     * Save the file list into storage. This do not update the public file
     */
    public function save() {
        $data = $this->serializer->serialize($this->fileList, 'json');
        $this->internalStorage->write($this::FILE_LIST_NAME, $data);
    }

    /**
     * Update the public files.json from internal state
     */
    public function savePublic() {
        $this->scoreStorage->write($this::PUBLIC_FILE_LIST_NAME, $this->serializer->serialize($this->fileList->toPublic(), 'json'));
    }
}