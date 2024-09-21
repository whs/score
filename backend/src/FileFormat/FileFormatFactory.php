<?php

namespace Whs\Score\FileFormat;

use Symfony\Component\DependencyInjection\ContainerBuilder;

class FileFormatFactory {
    public function __construct(private ContainerBuilder $container) {}

    public function create(FileFormat $format): FileFormatWriter|null {
        $writers = $this->container->findTaggedServiceIds('score.file_format_writer');
        foreach ($writers as $writer) {
            if ($writer::format() == $format) {
                return $writer;
            }
        }
        return null;
    }
}