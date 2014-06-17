///<reference path="reference.ts"/>

interface Window
{
	LiveReload:any;
}

module xp.mdposteditor
{

	import AppBase = io.xperiments.angularjs.AppBase;
	import DI = xp.mdposteditor.DI;
	export class App extends AppBase
	{

		boot()
		{


			this.disableLiveReload();


			this.wireServices( xp.mdposteditor.services );
			this.wireControllers( xp.mdposteditor.controllers );
			this.wireDirectives( xp.mdposteditor.directives );
			this.wireFilters( xp.mdposteditor.filters );
			this.config( xp.mdposteditor.config );
		}
		/* TODO Remove this "hack" to disable LiveReload on Admin Pages */
		disableLiveReload()
		{
			if( window.LiveReload)
			{
				window.LiveReload.performReload = (message:any)=> {};
			}
			else
			{
				setTimeout(()=>window.LiveReload.performReload = (message:any)=>{},2000);
			}

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