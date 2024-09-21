<?php

namespace Whs\Score\FileFormat;

class FileFormatBasicAuth extends FileFormatV2Compat {
    public static function format(): FileFormat {
        return FileFormat::BasicAuth;
    }

    protected function getStudentFileName(string $id, string $username, #[\SensitiveParameter] string $password): string {
        // The hash here is only intended to slugify the username and not provide security value
        return hash('sha256', $username) . '.json';
    }
}
