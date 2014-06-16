/**
 * Created by pedro.casaubon on 11/06/14.
 */
module xp.mdposteditor
{
	export class DI
	{
		/*NG*/
		static ngRoute:string 				= "ngRoute" ;
		static ngSanitize:string 			= "ngSanitize" ;
		static $scope:string				= "$scope";
		static $rootScope:string			= "$rootScope";
		static $routeParams:string			= "$routeParams";
		static $stateProvider:string		= "$stateProvider";
		static $location:string				= "$location";
		static $http:string					= "$http";
		static $q:string					= "$q";
		static $timeout:string				= "$timeout";

		/* CUSTOM */
		static uiAce:string 				= "ui.ace";
		static markdown:string 				= "btford.markdown";

		static FlickrCommons:string			= "FlickrCommons";
		static PostLoader:string			= "PostLoader";
		static PostWriter:string			= "PostWriter";
		static PostDirectory:string			= "PostDirectory";
		static Media:string					= "Media";
		static MessageBus:string			= "MessageBus";
		static HanSON:string				= "HanSON";
		static FileUploader:string			= "FileUploader";
		static GalleryPickerService:string 	= "GalleryPickerService";

	}
}