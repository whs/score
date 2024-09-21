<?php

namespace Whs\Score\FileFormat;

enum FileFormat: int {
    /**
     * Score folder format compatible with both legacy frontend & current frontend
     * This is the least secure option
     */
    case V2Compat = 1;
    /**
     * Similar to V2Compat but use PBKDF2 instead of SHA1
     */
    case V2_PBKDF2 = 2;
    /**
     * Use HTTP basic auth to secure access
     */
    case BasicAuth = 3;
}
