<?php

namespace Whs\Score\ScoreProcessor;

use League\Csv\Reader;
use PHPUnit\Framework\TestCase;
use Whs\Score\Model\StudentInfo;

final class CSVParserTest extends TestCase {
    static function getCSVParser(): CSVParser {
        $reader = Reader::createFromPath(dirname(__FILE__) . '/test.csv');
        return new CSVParser($reader);
    }

    function testLoad() {
        $parser = $this::getCSVParser();
        /** @var $students array<StudentInfo> */
        $students = iterator_to_array($parser->generate());

        $this->assertCount(2, $students);
        $this->assertEquals('1', $students[0]->getUsername());
        $this->assertEquals('1234', $students[0]->getPassword());
        $this->assertEquals([
            'subject 1 (10)' => '10',
            'subject 2 (5)' => '5',
            'grade' => 'A',
        ], $students[0]->getScores());

        $this->assertEquals('a', $students[1]->getUsername());
        $this->assertEquals('zzzz', $students[1]->getPassword());
        $this->assertEquals([
            'subject 3 (15)' => '0.5',
            'grade' => 'F',
        ], $students[1]->getScores());
    }
}