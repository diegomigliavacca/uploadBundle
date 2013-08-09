<?php
namespace SpookyIsland\UploadBundle\Element;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Mapbender\CoreBundle\Component\Element;
use SpookyIsland\UploadBundle\Element\Type\UploaderType;
use SpookyIsland\UploadBundle\Entity\UpFile;

class UploaderButton extends Element
{    
    /**
     * @inheritdoc
     */
    public static function getClassTitle()
    {
        return "Uploader Button";
    }

    /**
     * @inheritdoc
     */
    public static function getClassDescription()
    {
        return "The uploader button allows you to put a button in an application for loading and showing gpx files on a map. You can use it with every template";
    }

    /**
     * @inheritdoc
     */
    public static function getClassTags()
    {
        return array('UploaderButton', "upload");
    }

    /**
     * @inheritdoc
     */
    public function getAssets()
    {
        return array(
            'js' => array('mapbender.element.uploaderbutton.js',
            '@SpookyIslandUploadBundle/Resources/public/js/jquery.form.js'),
            'css' => array('mapbender.element.uploaderbutton.css')
        );
    }

    /**
     * @inheritdoc
     */
    public static function getDefaultConfiguration()
    {
        return array(
            "tooltip" => "uploader button"
            );
    }

    /**
     * @inheritdoc
     */
    public static function getType()
    {
        return 'SpookyIsland\UploadBundle\Element\Type\UploaderButtonType';
    }

    /**
     * @inheritdoc
     */
    public function getWidgetName()
    {
        return 'mapbender.mbUploaderButton';
    }

    /**
     * @inheritdoc
     */
    public function render()
    {
        $ff = $this->container->get('form.factory');
        $form = $ff->create(new UploaderType());
        return $this->container->get('templating')->render(
                        'SpookyIslandUploadBundle:Element:uploaderbutton.html.twig',
                        array('id' => $this->getId(),
                            'title' => $this->getTitle(),
                            'configuration' => $this->getConfiguration(),
                            'appname' => $this->application->getSlug(),
                            'form' => $form->createView()));
    }
    
    public function httpAction($action)
    { 
        $tk = new UpFile();
        $ff = $this->container->get('form.factory');
        $form = $ff->create(new UploaderType());
        $request = $this->container->get('request');
        $usernm = $this->container->get('security.context')->getToken()->getUser()->getUsername(); //obtaining username from the session token
        
        if ($request->isMethod('POST')) {
            $form->bind($request);

            if ($form->isValid()) { 
                $em = $this->container->get('doctrine')->getManager();
                $tk->file = $_FILES['uploader']['tmp_name']['file'];
                $tk->name = $_FILES['uploader']['name']['file']; // set file name for db storing and getter inside UpFile entity
				$tk->ext = substr($tk->getName(), -4);
                $tk->path = '/uploads/'; // set file path for db storing and getter inside UpFile entity
                $tk->rootdir = $this->container->getParameter('kernel.root_dir').'/../web/'.$tk->getPath();
                if (isset($_POST['color'])) {
                    $tk->color = '#' . $_POST['color']; // set color for db storing
                }
                else {
                    $tk->color = '#ffffff';
                };                
                $finfo = finfo_open(FILEINFO_MIME_TYPE); $tk->type = finfo_file($finfo, $tk->getFile()); finfo_close($finfo); // set mime type for validation
                $tk->usern = $usernm;
                $tk->validation(); // validation function is inside UpFile entity
                $em->persist($tk); // persisting to db
                $em->flush();

                if (move_uploaded_file($tk->getFile(), $tk->getRootDir() . "/" . $tk->getName())) {
                    return new Response("<p style='font-size:17px'>ok, file&nbsp;" . $tk->getName() . "<br />uploaded on&nbsp;" . $tk->time . "<br /><i class='icon-male pull-left' title='user'></i>" . $usernm . "</p>", 200, array('content-type' => 'text/html'));            
                }
            }
            return new Response("file was not uploaded", 400, array('content-type' => 'text/html'));
        }
    }

    /**
     * @inheritdoc
     */
    public static function getFormTemplate()
    {
        return 'SpookyIslandUploadBundle:Element:backend_uploaderbutton.html.twig';
    }
}
