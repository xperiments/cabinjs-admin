///<reference path="reference.ts"/>


module xp.mdposteditor
{

	import AppBase = io.xperiments.angularjs.AppBase;
	import DI = xp.mdposteditor.DI;
	export class App extends AppBase
	{

		boot()
		{
			this.wireServices( xp.mdposteditor.services );
			this.wireControllers( xp.mdposteditor.controllers );
			this.wireDirectives( xp.mdposteditor.directives );
			this.wireFilters( xp.mdposteditor.filters );
			this.config( xp.mdposteditor.config );
		}

	}
	export module App
	{
		new App("mdposteditor", [
			 DI.ngRoute
			,DI.ngSanitize
			,DI.markdown
			,DI.uiAce
		]);
	}




}