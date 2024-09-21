<?php

namespace Whs\Score\FileFormat;

use League\Flysystem\FilesystemOperator;
use Whs\Score\Model\File;

class FileFormatV2PBKDF2 extends FileFormatV2Compat {
    public $pbkdf2Iter = 10000;

    public function getPbkdf2Iter(): int {
        return $this->pbkdf2Iter;
    }

    public function setPbkdf2Iter(int $pbkdf2Iter): void {
        $this->pbkdf2Iter = $pbkdf2Iter;
    }

    protected function getStudentFileName(string $id, string $username, #[\SensitiveParameter] string $password): string {
        $hashed_password = hash_pbkdf2('sha256', $password, $id . '_' . $username, $this->pbkdf2Iter);
        return $hashed_password . '.json';
    }
}
