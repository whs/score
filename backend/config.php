<?php
/**
 * รหัสผ่าน
 */
$password = "/* @echo password */";

/**
 * Key เข้ารหัส (กำหนดเป็นข้อความสุ่มอะไรก็ได้)
 * https://www.random.org/strings/?num=1&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new
 */
$encryptionKey = "/* @echo encryptionKey */";

/**
 * จำนวนครั้งที่ตอบผิดได้
 */
$tries = 3;

$props = array(
    "branding" => "/* @echo branding */",
    "system" => "/* @echo system */",
);
