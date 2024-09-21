<?php

namespace Whs\Score\FileFormat;

use Whs\Score\Model\File;

interface FileFormatDeleter {
    /**
     * Return which file format enum this deleter supports
     */
    public static function format(): FileFormat;

    /**
     * Delete all result files
     */
    public function delete(File $file): void;
}