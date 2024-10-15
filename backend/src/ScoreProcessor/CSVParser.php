<?php

namespace Whs\Score\ScoreProcessor;

use League\Csv\Reader;
use Whs\Score\Model\StudentInfo;

/**
 * An adapter that configure a Csv\Reader to read records.
 * This is an iterator - use foreach to retrieve each records
 */
class CSVParser {
    public function __construct(protected Reader $reader){}

    /**
     * @return Generator<StudentInfo>
     */
    public function generate(): \Generator {
        foreach($this->reader as $line) {
            $student = new StudentInfo();
            $student->setUsername($line[0]);
            $student->setPassword($line[1]);

            $scores = [];
            $subject = null;
            foreach (array_slice($line, 2) as $data) {
                if ($subject == null) {
                    $subject = $data;
                } else {
                    $scores[$subject] = $data;
                    $subject = null;
                }
            }

            $student->setScores($scores);
            yield $student;
        }
    }
}