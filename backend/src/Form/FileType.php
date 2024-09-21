<?php

namespace Whs\Score\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EnumType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Whs\Score\FileFormat\FileFormat;
use Whs\Score\Model\File;

class FileType extends AbstractType {
    public function buildForm(FormBuilderInterface $builder, array $options): void {
        $builder
            ->add('name', TextType::class)
            ->add('format', EnumType::class, [
                'class' => FileFormat::class,
                'help' => 'BasicAuth ปลอดภัยที่สุด แต่บางเซิร์ฟเวอร์ไม่รองรับ, V2_PBKDF2 รองลงมา',
                'data' => FileFormat::BasicAuth,
            ])
            ->add('save', SubmitType::class);
    }

    public function configureOptions(OptionsResolver $resolver): void {
        $resolver->setDefaults([
            'data_class' => File::class,
        ]);
    }
}