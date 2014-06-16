///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import MessageBus 				= xp.mdposteditor.services.MessageBus;
	import GalleryPickerController 	= xp.mdposteditor.controllers.GalleryPickerController;
	export class GalleryPickerService
	{
		static $inject = [
			DI.$q
			,DI.MessageBus
		];
		constructor(
			 private $q:ng.IQService
			,private messageBus:MessageBus
		)
		{

		}
		pickFile():ng.IPromise<any>
		{
			var deferred:ng.IDeferred<any> = this.$q.defer();
			this.messageBus.emit(GalleryPickerController.PICK , deferred );
			return deferred.promise;
		}
	}


}