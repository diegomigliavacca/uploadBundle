<?php

namespace Mapbender\UploadBundle\Element\Type;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

/**
 * 
 */
class UploaderType extends AbstractType
{

    /**
     * @inheritdoc
     */
    public function getName()
    {
        return 'uploader';
    }

    /**
     * @inheritdoc
     */
    public function setDefaultOptions(OptionsResolverInterface $resolver)
    {
        $resolver->setDefaults(array(
            'application' => null
        ));
    }

    /**
     * @inheritdoc
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {           
        $builder->add('file', 'file');
    }
}
