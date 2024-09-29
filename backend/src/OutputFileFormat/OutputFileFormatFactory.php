<?php

namespace Whs\Score\OutputFileFormat;

use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;
use Whs\Score\Model\File;

class OutputFileFormatFactory {
    public function __construct(
        #[AutowireIterator('score.file_format_writer')]
        private iterable $writers
    ) {}

    public function create(OutputFileFormat $format): ?OutputFileFormatWriter {
        foreach ($this->writers as $writer) {
            if ($writer::format() == $format) {
                return $writer;
            }
        }
        return null;
    }

    public function createFromFile(File $file): ?OutputFileFormatWriter {
        return $this->create($file->getFormat());
    }
}