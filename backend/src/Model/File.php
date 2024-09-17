<?php
namespace Whs\Score\Model;

class File {
    private string $id;
    private string $publicId;
    private string $name;
    private FileState $state;

    public function __construct(string $name) {
        // XXX: The ID must be cryptographically secure random as it is used as the input file name
        // If a web server misconfiguration happen, it could reveal the input file
        $this->id = bin2hex(random_bytes(16));
        $this->publicId = bin2hex(random_bytes(16));
        $this->name = $name;
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

    public function getPublicId(): string
    {
        return $this->publicId;
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
}