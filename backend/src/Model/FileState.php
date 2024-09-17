<?php

namespace Whs\Score\Model;

enum FileState {
    /**
     * The file is created but no input file is uploaded
     */
    case Created;
    /**
     * The input file is uploaded but processing is not started
     */
    case Uploaded;
    /**
     * File is under processing
     */
    case Processing;
    case ProcessingComplete;
    case Public;
}
