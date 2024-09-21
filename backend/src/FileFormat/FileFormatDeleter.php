<?php

namespace Whs\Score\FileFormat;

use Whs\Score\Model\File;

interface FileFormatDeleter {
    /**
     * Delete all result files
     */
    public function delete(File $file): void;
}