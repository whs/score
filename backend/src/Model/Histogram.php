<?php

namespace Whs\Score\Model;

use Symfony\Component\Serializer\Normalizer\DenormalizableInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizableInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class Histogram implements NormalizableInterface, DenormalizableInterface {
    protected array $histogram;

    public function __construct($maxScore = 0) {
        $this->histogram = [];
        for($i = 0; $i <= $maxScore; $i++){
            $this->histogram[] = 0;
        }
    }

    public function getHistogram(): array
    {
        return $this->histogram;
    }

    public function setHistogram(array $histogram): void
    {
        $this->histogram = $histogram;
    }

    public function denormalize(DenormalizerInterface $denormalizer, float|int|bool|array|string $data, ?string $format = null, array $context = []): void
    {
        $this->histogram = $denormalizer->denormalize($this->histogram, null, $format, $context);
    }

    public function normalize(NormalizerInterface $normalizer, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        return $normalizer->normalize($this->histogram, $format, $context);
    }

    public function add(float $value) {
        // The array index 0 is storing the bucket of values in the range [0.0 - 1.0)
        // However, all other calculation considered a bucket midpoint to be 0.0 not 0.5.
        // This make test with integer score appears correct, while decimal score will be rounded down
        if(count($this->histogram) < $value){
            throw new \ValueError("Value $value is over the histogram max value " . count($this->histogram));
        }
        $this->histogram[floor($value)]++;
    }

    public function fullScore(): int {
        return count($this->histogram);
    }

    /**
     * @return int Number of people who have taken the exam
     */
    public function numberOfPeople(): int {
        return array_sum($this->histogram);
    }

    /**
     * @return int The bucket that most people have
     */
    public function mode(): int {
        $currentMaxScore = 0;
        $currentMaxPeople = 0;
        foreach ($this->histogram as $score => $people) {
            if ($people > $currentMaxPeople) {
                $currentMaxPeople = $people;
                $currentMaxScore = $score;
            }
        }
        return $currentMaxScore;
    }

    /**
     * @return int The score of person in the middle has, when people are sorted by score
     */
    public function median(): int {
        $mid = $this->numberOfPeople() / 2;
        $count = 0;
        foreach ($this->histogram as $score => $people) {
            $count += $people;
            if ($count >= $mid) {
                return $score;
            }
        }
        return 0;
    }

    /**
     * @param $skip int Skip this many non-empty buckets
     * @return int The lowest non-zero bucket
     */
    public function lowest(int $skip = 0): int {
        foreach ($this->histogram as $score => $people) {
            if ($people == 0) {
                continue;
            }
            if ($skip == 0) {
                return $score;
            }
            $skip--;
        }
        return 0;
    }

    /**
     * @return int The highest non-zero bucket
     */
    public function highest(): int {
        for ($i = $this->fullScore(); $i >= 0; $i--) {
            if ($this->histogram[$i] > 0){
                return $i;
            }
        }
        return 0;
    }

    public function sd(): float {
        // S.D. = √[ Σ(f_i * (x_i - x̄)²) / (N - 1) ]
        $mean = $this->mean();

        $out = 0;
        // compute Σ(f_i * (x_i - x̄)²)
        // f_i = frequency (number of people)
        // x_i = the bucket
        foreach ($this->histogram as $score => $people) {
            $out += $people * pow($score - $mean, 2);
        }
        $out /= $this->numberOfPeople() - 1;

        return sqrt($out);
    }

    public function mean(): float {
        $totalScore = 0.0;
        foreach ($this->histogram as $score => $people) {
            $totalScore += $score * $people;
        }

        return $totalScore / $this->numberOfPeople();
    }
}