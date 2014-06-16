///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import FlickrCommons = xp.mdposteditor.services.FlickrCommons;
	import FlickrCommonsImage = xp.mdposteditor.services.FlickrCommonsImage;
	import DI = xp.mdposteditor.DI;
	export class MediaController
	{
		static $inject = [ DI.$scope, DI.FlickrCommons ];
		searchImages:FlickrCommonsImage[];
		searchValue:string="";
		per_page:number=100;
		constructor( private $scope, private flickrCommons:FlickrCommons)
		{

		}
		search()
		{
			if( this.searchValue == "" ) return;
			this.flickrCommons.search( this.searchValue , this.per_page ).then(()=>{
				this.searchImages = this.flickrCommons.searchPhotoResults;
			})
		}
	}

}