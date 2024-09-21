<?php

namespace Whs\Score\FileFormat;

use Whs\Score\Model\File;

/**
 * FileFormatWriter can be used to write a result into specific format
 * It also can be used to delete all files created by itself
 *
 * Once called with init($file), a FileFormatWriter may store the input
 * and all other methods are called in context of said input file.
 * A FileFormatWriter must not be re-used.
 */
interface FileFormatWriter {
    /**
     * Create the base directory structure for a file
     */
    public function init(File $file): void;

    /**
     * Write a single student score to storage
     */
    public function writeStudent(): void;

    /**
     * Write a stats file to storage
     */
    public function writeStats(): void;

    public function finalize(): void;
}
