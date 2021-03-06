<?php
namespace SpookyIsland\UploadBundle\Element;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Mapbender\CoreBundle\Component\Element;
use SpookyIsland\UploadBundle\Element\Type\UploaderType;
use SpookyIsland\UploadBundle\Entity\UpFile;

class UploaderForm extends Element {
	/**
	 * @inheritdoc
	 */
	public static function getClassTitle() {
		return "Uploader Form";
	}

	/**
	 * @inheritdoc
	 */
	public static function getClassDescription() {
		return "The uploader form allows you to put a form in an application for loading and showing gpx files on a map. You have to put it in a sidebar using templates available with this bundle";
	}

	/**
	 * @inheritdoc
	 */
	public static function getClassTags() {
		return array('UploaderForm', "upload");
	}

	/**
	 * @inheritdoc
	 */
	public function getAssets() {
		return array('js' => array('mapbender.element.uploaderform.js'), 'css' => array('mapbender.element.uploaderform.css'));
	}

	/**
	 * @inheritdoc
	 */
	public static function getDefaultConfiguration() {
		return array("tooltip" => "uploader form", "track_uploader" => true);
	}

	/**
	 * @inheritdoc
	 */
	public static function getType() {
		return 'SpookyIsland\UploadBundle\Element\Type\UploaderFormType';
	}

	/**
	 * @inheritdoc
	 */
	public function getWidgetName() {
		return 'mapbender.mbUploaderForm';
	}

	/**
	 * @inheritdoc
	 */
	public function render() {
		$ff = $this -> container -> get('form.factory');
		$form = $ff -> create(new UploaderType());
		return $this -> container -> get('templating') -> render('SpookyIslandUploadBundle:Element:uploaderform.html.twig', array('id' => $this -> getId(), 'title' => $this -> getTitle(), 'configuration' => $this -> getConfiguration(), 'appname' => $this -> application -> getSlug(), 'form' => $form -> createView()));
	}

	public function httpAction($action) {
		$tk = new UpFile();
		$ff = $this -> container -> get('form.factory');
		$form = $ff -> create(new UploaderType());
		$request = $this -> container -> get('request');
		//obtaining the username from the session token
		$usernm = $this -> container -> get('security.context') -> getToken() -> getUser() -> getUsername();

		if ($request -> isMethod('POST')) {
			$form -> bind($request);

			if ($form -> isValid()) {
				$em = $this -> container -> get('doctrine') -> getManager();
				$tk -> file = $_FILES['uploader']['tmp_name']['file'];
				// set file name for db storing and getter inside UpFile entity
				$tk -> name = $_FILES['uploader']['name']['file'];
				$tk -> ext = substr($tk -> getName(), -4);
				// set file path for db storing and getter inside UpFile entity
				$tk -> path = '/uploads/';
				$tk -> rootdir = $this -> container -> getParameter('kernel.root_dir') . '/../web/' . $tk -> getPath();
				if (isset($_POST['color'])) {
					// set color for db storing
					$tk -> color = '#' . $_POST['color'];
				} else {
					$tk -> color = '#ffffff';
				};
				$finfo = finfo_open(FILEINFO_MIME_TYPE);
				// set mime type for validation
				$tk -> type = finfo_file($finfo, $tk -> getFile());
				finfo_close($finfo);
				$tk -> usern = $usernm;
				// validation function is inside UpFile entity
				$tk -> validation();
				// persisting to db
				$em -> persist($tk);
				$em -> flush();

				if (move_uploaded_file($tk -> getFile(), $tk -> getRootDir() . "/" . $tk -> getName())) {
					return new Response("<p style='font-size:17px'>ok, file " . $tk -> getName() . "<br />uploaded on " . $tk -> time . "<br /><i class='icon-male pull-left' title='user'></i>" . $usernm . "</p>", 200, array('content-type' => 'text/html'));
				}
			}
			return new Response("file was not uploaded", 400, array('content-type' => 'text/html'));
		}
	}

	/**
	 * @inheritdoc
	 */
	public static function getFormTemplate() {
		return 'SpookyIslandUploadBundle:Element:backend_uploaderform.html.twig';
	}

}
