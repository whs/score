<?php

namespace Whs\Score\ScoreProcessor;

use Whs\Score\Model\Histogram;
use Whs\Score\Model\Stats;
use Whs\Score\Model\StudentInfo;

class HistogramBuilder {
    public static function compute(iterable $input): Stats {
        $out = new Stats();

        /** @var $item StudentInfo */
        foreach ($input as $item) {
            foreach($item->getScores() as $subject => $score) {
                $fullScore = self::getFullScore($subject);
                if (!$fullScore) {
                    continue;
                }

                $histogram = $out->getSubject($subject);
                if (!$histogram) {
                    $histogram = new Histogram($fullScore);
                    $out->setSubject($subject, $histogram);
                }

                $histogram->add($score);
            }
        }

        return $out;
    }

    public static function getFullScore(string $subject): int|null {
        preg_match('/\([0-9.]+\)$/', $subject, $matches);
        if(!$matches || !$matches[1]) {
            return null;
        }
        $out = intval($matches[1], 10);
        if ($out == 0) {
            return null;
        }
        return $out;
    }
}