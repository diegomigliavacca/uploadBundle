**INFOS**

The UploadBundle contains two templates (named "sidebarright" and "sidebarleft") and two elements (named "UploaderForm" and "UploaderButton"). These elements permit to upload, view and zoom gpx tracks.

The element UploaderForm is strictly bound at the bundle, so it's just usable with the templates made available with this bundle, or with similar templates you will build.

The element UploaderButton is usable with every template, it's just a button.

<BR />
**DOCUMENTATION**

If you didn't find this bundle with your Mapbender3 installation, you need:

1) Put everything inside the folder SpookyIsland/UploadBundle. Put it inside the application->src folder.

2) Copy the assets to the Symfony web folder using the command:

<i>app/console assets:install web</i>

3) Follow the instructions inside the Mapbender Docs to enable bundle (you need to edit the AppKernel.php file), templates and elements (you need to edit the MapbenderCoreBundle.php file).

4) Upgrade the database using the following command:

<i>app/console doctrine:schema:update --force</i>

The table UpFile will be created.

5) If you don't have it installed yet, you will need to install the <i>postgresql-contrib</i> package. You need it for using the <a href="http://www.postgresql.org/docs/9.0/static/citext.html" target="_blank">citext</a> file type. You will have to set the field Name inside the table UpFile at the citext file type if you want to use this feature.

6) Put the following lines inside the application->app->config->routing.yml file:
	
	spookyisland_uploadbundle:
    	resource: "@SpookyIslandUploadBundle/Resources/config/routing.yml"

<BR />
**UPLOADERBUTTON ELEMENT**

It's better you put the button inside a toolbar. If you want to put it in a different place (e.g. inside the content part of the template), you need to style the button (file mapbender.element.uploaderbutton.css).
