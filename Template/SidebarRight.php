<?php

namespace SpookyIsland\UploadBundle\Template;

use Mapbender\CoreBundle\Component\Template;

class SidebarRight extends Template {
    public static function getTitle() {
        return 'Sidebar Right';
    }

    public function getAssets($type) {
        parent::getAssets($type);
        $assets = array(
            'css' => array('mapbender.template.sidebarright.css'),
            'js' => array()
        );
        return $assets[$type];
    }

    public static function getRegions() {
        return array('top', 'sidebarright', 'content');
    }

    public function render($format = 'html', $html = true, $css = true,
        $js = true) {
        $templating = $this->container->get('templating');
        return $templating
            ->render('SpookyIslandUploadBundle:Template:sidebarright.html.twig',
                array(
                    'html' => $html,
                    'css' => $css,
                    'js' => $js,
                    'application' => $this->application));
    }

}
