<?php

namespace Whs\Score\FileFormat;

class FileFormatV2PBKDF2 extends FileFormatV2Compat {
    public int $pbkdf2Iter = 10000;

    public static function format(): FileFormat {
        return FileFormat::V2_PBKDF2;
    }

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
