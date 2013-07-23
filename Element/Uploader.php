<?php
namespace SpookyIsland\UploadBundle\Element;

use Mapbender\CoreBundle\Component\Element;

class Uploader extends Element
{
    
    /**
     * @inheritdoc
     */
    public static function getClassTitle()
    {
        return "Uploader";
    }

    /**
     * @inheritdoc
     */
    public static function getClassDescription()
    {
        return "The uploader object allows you to add a uploader for gpx and shp files.";
    }

    /**
     * @inheritdoc
     */
    public static function getClassTags()
    {
        return array('uploader', "upload");
    }

    /**
     * @inheritdoc
     */
    public function getAssets()
    {
        return array(
            'js' => array('mapbender.element.uploader.js'),
            'css' => array()
        );
    }

    /**
     * @inheritdoc
     */
    public static function getDefaultConfiguration()
    {
        return array(
            "tooltip" => "uploader"
            );
    }

    /**
     * @inheritdoc
     */
    public static function getType()
    {
        return 'SpookyIsland\UploadBundle\Element\Type\UploaderType';
    }

    /**
     * @inheritdoc
     */
    public function getWidgetName()
    {
        return 'mapbender.mbUploader';
    }

    /**
     * @inheritdoc
     */
    public function render()
    {
        return $this->container->get('templating')->render(
                        'SpookyIslandUploadBundle:Element:uploader.html.twig',
                        array('id' => $this->getId(),
                            "title" => $this->getTitle(),
                            'configuration' => $this->getConfiguration()));
    }
    
    /**
     * @inheritdoc
     */
    public static function getFormTemplate()
    {
        return 'SpookyIslandUploadBundle:Element:backend_uploader.html.twig';
    }
}
