<?php

namespace Whs\Score\Model;

use Whs\Score\Model\Histogram;

class Stats
{
    protected array $subjects = [];

    public function getSubjects(): array
    {
        return $this->subjects;
    }

    public function setSubjects(array $subjects): void
    {
        $this->subjects = $subjects;
    }

    public function getSubject(string $subject): ?Histogram
    {
        return $this->subjects[$subject];
    }

    public function setSubject(string $subject, Histogram $value): void
    {
        $this->subjects[$subject] = $value;
    }
}