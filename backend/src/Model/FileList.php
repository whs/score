<?php
namespace Whs\Score\Model;

class FileList {
    private array $files = [];

    public function getFiles(): array
    {
        return $this->files;
    }

    public function setFiles(array $files): void
    {
        $this->files = $files;
    }

    public function toPublic(): array{
        $out = [];

        foreach($this->files as $file){
            $out[] = $file->toPublic();
        }

        return $out;
    }
}