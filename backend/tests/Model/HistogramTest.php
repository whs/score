<?php

namespace Whs\Score\Model;

use PHPUnit\Framework\TestCase;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\CustomNormalizer;
use Symfony\Component\Serializer\Serializer;

final class HistogramTest extends TestCase {
    function getTestHistogram(): Histogram {
        $histogram = new Histogram(10);
        $histogram->add(0);
        $histogram->add(5);
        $histogram->add(5);
        $histogram->add(10);
        return $histogram;
    }

    function testStatsInteger() {
        $histogram = $this->getTestHistogram();

        $this->assertEquals([1,0,0,0,0,2,0,0,0,0,1], $histogram->getHistogram());
        $this->assertEquals(10, $histogram->fullScore());
        $this->assertEquals(4, $histogram->numberOfPeople());
        $this->assertEquals(5, $histogram->mode());
        $this->assertEquals(5, $histogram->median());
        $this->assertEquals(0, $histogram->lowest());
        $this->assertEquals(0, $histogram->lowest(0));
        $this->assertEquals(5, $histogram->lowest(1));
        // Skip is in number of buckets, not people
        $this->assertEquals(10, $histogram->lowest(2));
        $this->assertEquals(10, $histogram->highest());
        $this->assertEqualsWithDelta(4.0825, $histogram->sd(), 0.1);
        $this->assertEqualsWithDelta(5.0, $histogram->mean(), 0.1);
    }

    function testOverRange() {
        $histogram = new Histogram(10);
        $this->expectException(\ValueError::class);
        $histogram->add(11);
    }

    function testUnderRange() {
        $histogram = new Histogram(10);
        $this->expectException(\ValueError::class);
        $histogram->add(-1);
    }

    function testSerialize() {
        $histogram = $this->getTestHistogram();
        $serializer = new Serializer([new CustomNormalizer()], [new JsonEncoder()]);
        $serialized = $serializer->serialize($histogram, 'json');

        $this->assertEquals("[1,0,0,0,0,2,0,0,0,0,1]", $serialized);

        $deserialized = $serializer->deserialize($serialized, Histogram::class, 'json');
        $this->assertEquals($deserialized->getHistogram(), $histogram->getHistogram());
    }
}