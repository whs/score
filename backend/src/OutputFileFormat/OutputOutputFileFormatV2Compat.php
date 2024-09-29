<?php

namespace Whs\Score\OutputFileFormat;

use League\Flysystem\FilesystemOperator;
use Whs\Score\Model\File;

class OutputOutputFileFormatV2Compat implements OutputFileFormatWriter, OutputFileFormatDeleter {
    protected File $file;

    protected const STATS_FILE_NAME = 'stats.json';

    public function __construct(protected FilesystemOperator $scoreStorage) {}

    public static function format(): OutputFileFormat {
        return OutputFileFormat::V2Compat;
    }

    public function delete(File $file): void {
        $this->scoreStorage->deleteDirectory($file->getPublicId());
    }

    public function init(File $file): void {
        $this->file = $file;
        $this->scoreStorage->createDirectory($file->getPublicId());
    }

    public function writeStudent(): void {
        // TODO: Implement writeStudent() method.
    }

    public function writeStats(): void {
        // TODO: Implement writeStats() method.
    }

    public function finalize(): void {
    }

    protected function getStudentFileName(string $id, string $username, #[\SensitiveParameter] string $password): string {
        $hashed_password = substr(sha1($username . $password . $id), 0, 5);
        return 'u' . $username . '_' . $hashed_password . '.json';
    }
}
