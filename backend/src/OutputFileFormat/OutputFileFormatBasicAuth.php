<?php

namespace Whs\Score\OutputFileFormat;

class OutputFileFormatBasicAuth extends OutputOutputFileFormatV2Compat {
    public static function format(): OutputFileFormat {
        return OutputFileFormat::BasicAuth;
    }

    protected function getStudentFileName(string $id, string $username, #[\SensitiveParameter] string $password): string {
        // The hash here is only intended to slugify the username and not provide security value
        return hash('sha256', $username) . '.json';
    }
}
