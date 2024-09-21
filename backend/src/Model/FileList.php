<?php
namespace Whs\Score\Model;

use Symfony\Component\Serializer\Normalizer\DenormalizableInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizableInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class FileList implements NormalizableInterface, DenormalizableInterface {
    private array $files = [];

    public function getFiles(): array
    {
        return $this->files;
    }

    public function setFiles(array $files): void
    {
        $this->files = $files;
    }

    public function addFile(File $file) {
        $this->files[] = $file;
    }

    public function getFile(string $id): ?File {
        foreach($this->files as $index => $file) {
            if ($file->getId() == $id) {
                return $file;
            }
        }
        return null;
    }

    public function removeFile(string $id): bool {
        foreach($this->files as $index => $file) {
            if ($file->getId() == $id) {
                unset($this->files[$index]);
                return true;
            }
        }
        return false;
    }

    public function toPublic(): array{
        $out = [];

        foreach($this->files as $file){
            $out[] = $file->toPublic();
        }

        return $out;
    }

    public function normalize(NormalizerInterface $normalizer, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null {
        return $normalizer->normalize($this->getFiles(), $format, $context);
    }

    public function denormalize(DenormalizerInterface $denormalizer, float|int|bool|array|string $data, ?string $format = null, array $context = []): void {
        foreach($data as $item) {
            $this->files[] = $denormalizer->denormalize($item, File::class, $format, $context);
        }
    }
}