<?php

namespace Whs\Score\ScoreProcessor;

use PHPUnit\Framework\TestCase;
use Whs\Score\Model\StudentInfo;

class StatsBuilderTest extends TestCase {
    public function testCompute() {
        $info = new StudentInfo();
        $info->setUsername('1');
        $info->setPassword('aaaa');
        $info->setScores([
            'int (100)' => '10',
            'float (5)' => '2.5',
        ]);

        $out = StatsBuilder::compute([$info]);
        $this->assertEquals(['int (100)', 'float (5)'], array_keys($out->getSubjects()));
        $this->assertEquals(10, $out->getSubject('int (100)')->mean());
        // XXX: Currently the histogram doesn't do float
        $this->assertEquals(2, $out->getSubject('float (5)')->mean());
    }

    public function testComputeCSV() {
        $parser = CSVParserTest::getCSVParser();
        $out = StatsBuilder::compute($parser->generate());
        $this->assertEquals(['subject 1 (10)', 'subject 2 (5)', 'subject 3 (15)'], array_keys($out->getSubjects()));
    }

    public function testGetFullScore() {
        $this->assertEquals(10, StatsBuilder::getFullScore('a (10)'));
        $this->assertEquals(10, StatsBuilder::getFullScore('a(10)'));
        $this->assertEquals(null, StatsBuilder::getFullScore('a (2.5)'));
        $this->assertEquals(null, StatsBuilder::getFullScore('a'));
    }
}
