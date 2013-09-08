**INFOS**

The UploadBundle contains a template (named "sidebarright") and two elements (named "UploaderForm" and "UploaderButton"). These elements permit to upload, view and zoom:

- GPX tracks;

- KML files (ExtendedData parsing is not supported yet);

- GeoJSON files.

The element UploaderForm is strictly bound at the bundle, so it's just usable with the templates made available with this bundle, or with similar templates you will build.

The element UploaderButton is usable with every template, it's just a button.

<BR />
**DOCUMENTATION**

If you didn't find this bundle with your Mapbender3 installation, you need:

1) Put everything inside the folder SpookyIsland/UploadBundle. Put the SpookyIsland folder inside the application->src folder.

2) Follow the instructions on the Mapbender3 Docs to enable the bundle, templates and elements. Basically, you need to edit the application->app->AppKernel.php file adding the bundle:

	new SpookyIsland\UploadBundle\SpookyIslandUploadBundle(),

and the MapbenderCoreBundle.php file inside the CoreBundle folder adding:

inside the getTemplates function:

	'SpookyIsland\UploadBundle\Template\SidebarRight'

inside the getElements function:

	'SpookyIsland\UploadBundle\Element\UploaderButton',
	'SpookyIsland\UploadBundle\Element\UploaderForm'

3) Add the following lines to the application->app->config->routing.yml file:
	
	spookyisland_uploadbundle:
    	resource: "@SpookyIslandUploadBundle/Resources/config/routing.yml"

4) Copy the assets to the Web folder using the command:

<i>app/console assets:install web</i>

5) Upgrade the database using the following command:

<i>app/console doctrine:schema:update --force</i>

The table UpFile will be created.

6) If you are using PostgreSQL as database, you will need to install the <i>postgresql-contrib</i> package. You need it to use the <a href="http://www.postgresql.org/docs/9.0/static/citext.html" target="_blank">citext</a> file type. You will have to set the field Name inside the table UpFile at the citext file type if you want to use this feature.

7) Create a folder named "uploads" inside the application->web folder and give permissions to create and delete files inside the folder.

<BR />
**UPLOADERBUTTON ELEMENT**

It's better you put the button inside a toolbar. If you want to put it in a different place (e.g. inside the content part of a template), you need to style the button (file mapbender.element.uploaderbutton.css), basically color and position.
