<?php

namespace Whs\Score\Model;

class StudentInfo
{
    protected string $username;
    protected string $password;
    protected array $scores;

    public function getUsername(): string
    {
        return $this->username;
    }

    public function setUsername(string $username): void
    {
        $this->username = $username;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }

    public function getScores(): array
    {
        return $this->scores;
    }

    public function setScores(array $scores): void
    {
        $this->scores = $scores;
    }
}