<?php

namespace Whs\Score\OutputFileFormat;

use Whs\Score\Model\File;

interface OutputFileFormatDeleter {
    /**
     * Return which file format enum this deleter supports
     */
    public static function format(): OutputFileFormat;

    /**
     * Delete all result files
     */
    public function delete(File $file): void;
}