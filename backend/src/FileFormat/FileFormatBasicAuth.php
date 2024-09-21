<?php

namespace Whs\Score\FileFormat;

use League\Flysystem\FilesystemOperator;
use Whs\Score\Model\File;

class FileFormatBasicAuth extends FileFormatV2Compat {
    protected function getStudentFileName(string $id, string $username, #[\SensitiveParameter] string $password): string {
        // The hash here is only intended to slugify the username and not provide security value
        return hash('sha256', $username) . '.json';
    }
}
