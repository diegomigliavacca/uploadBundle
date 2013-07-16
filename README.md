**INFO**

The UploadBundle contains two templates (named "sidebarright" and "sidebarleft") and two elements (named "UploaderForm" and "UploaderButton").

The element UploaderForm is strictly bounded at the bundle, so it's usable just with the templates made available with this bundle, or with similar templates you will build.

The element UploaderButton is usable with every template, it's just a button.

<br />
**INSTALLING UPLOADBUNDLE**

If you didn't find this bundle inside your Mapbender3 installation, you need:

1) Put the UploadBundle folder inside the mapbender->src->Mapbender folder together with the other bundles.

2) Copy the assets to the Mapbender web folder using the following command:

<i>app/console assets: install web</i>

3) Follow the instructions inside the Mapbender Docs to enable the bundle (you need to edit the AppKernel.php file), templates and elements (you need to edit the MapbenderCoreBundle.php file).

4) Upgrade the database using the following command:

<i>app/console doctrine:schema:update --force</i>

The table UpFile will be created.

5) If you don't have it installed yet, you will need to install the postgresql-contrib package too. You need it for using the citext file type (http://www.postgresql.org/docs/9.0/static/citext.html). You will have to set the field Name inside the table UpFile at the citext file type if you want to use this feature.

6) Put the following line inside the head section of the file skel.html.twig inside fom->src->FOM->CoreBundle->Resources->views.

	{% include 'MapbenderUploadBundle::content_head.html.twig' %}

7) Put the following lines inside the application->app->config->routing.yml file:
	
	mapbender_uploadbundle:
    	resource: "@MapbenderUploadBundle/Controller/"
    	type: annotation
    
	uploadbundle:
    	resource: "@MapbenderUploadBundle/Resources/config/routing.yml"

8) Cut & paste the "uploaderform.html.twig" and "uploaderbutton.html.twig" files (you can find them in the root folder of the bundle) inside mapbender->src->Mapbender->ManagerBundle->Resources->views->Element. It's the backend twig for the form for creating the elements inside the administration page.

<BR />
**UPLOADERFORM ELEMENT**

To use the UploaderForm element you have to do nothing more. Everything is right inside the bundle.

<BR />
**UPLOADERBUTTON ELEMENT**

To use the UploaderButton element, you have to copy the following string inside the frontend.html.twig file, which is inside the CoreBundle folder. Put it inside the {% block js %} part:

	<script type="text/javascript" src="{{ asset('bundles/mapbenderupload/js/jquery.form.js') }}"></script>

It's better you put the button inside a toolbar. If you want to put it in a different place (e.g. inside the content part of the template), you need to style the button (file mapbender.element.uploaderbutton.css).