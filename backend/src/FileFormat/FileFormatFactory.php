<?php

namespace Whs\Score\FileFormat;

use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;
use Whs\Score\Model\File;

class FileFormatFactory {
    public function __construct(
        #[AutowireIterator('score.file_format_writer')]
        private iterable $writers
    ) {}

    public function create(FileFormat $format): ?FileFormatWriter {
        foreach ($this->writers as $writer) {
            if ($writer::format() == $format) {
                return $writer;
            }
        }
        return null;
    }

    public function createFromFile(File $file): ?FileFormatWriter {
        return $this->create($file->getFormat());
    }
}