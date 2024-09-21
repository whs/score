<?php
namespace Whs\Score\Model;

use Whs\Score\FileFormat\FileFormat;
use Whs\Score\FileFormat\FileFormatWriter;

class File {
    private string $id;
    private string $publicId;
    private string $name;
    private FileState $state;
    private FileFormat $format;
    private mixed $fileFormatData;

    public function __construct() {
        // XXX: The ID must be cryptographically secure random as it is used as the input file name
        // If a web server misconfiguration happen, it could reveal the input file
        $this->id = bin2hex(random_bytes(16));
        $this->publicId = bin2hex(random_bytes(16));
    }

    public function toPublic(): array {
        return [
            'id' => $this->publicId,
            'name' => $this->name,
            'state' => $this->state === FileState::Public ? 4 : 0,
        ];
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function getPublicId(): string
    {
        return $this->publicId;
    }

    public function setPublicId(string $publicId): void
    {
        $this->publicId = $publicId;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getState(): FileState
    {
        return $this->state;
    }

    public function setState(FileState $state): void
    {
        $this->state = $state;
    }

    public function getFormat(): FileFormat
    {
        return $this->format;
    }

    public function setFormat(FileFormat $format): void
    {
        $this->format = $format;
    }

    public function getFileFormatData(): mixed
    {
        return $this->fileFormatData;
    }

    public function setFileFormatData(mixed $fileFormatData): void
    {
        $this->fileFormatData = $fileFormatData;
    }
}