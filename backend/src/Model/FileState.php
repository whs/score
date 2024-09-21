<?php

namespace Whs\Score\Model;

enum FileState: int {
    /**
     * The file is created but no input file is uploaded
     */
    case Created = 1;
    /**
     * The input file is uploaded but processing is not started
     */
    case Uploaded = 2;
    /**
     * File is under processing
     */
    case Processing = 3;
    case ProcessingComplete = 5;
    case ProcessingFailed = 6;

    // Public must be 4 to honor the existing public API
    case Public = 4;
}
