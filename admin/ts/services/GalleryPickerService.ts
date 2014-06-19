///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import MessageBusService 				= xp.mdposteditor.services.MessageBusService;
	import StaticEvent		 				= io.xperiments.angularjs.StaticEvent;
	export class GalleryPickerEvent
	{
		static PICK:string = "";
	}
	export module GalleryPickerEvent
	{
		StaticEvent.init( GalleryPickerEvent );
	}
	export class GalleryPickerService
	{
		static $inject = [
			DI.$q
			,DI.MessageBusService
		];
		private deferred:ng.IDeferred<string>;
		constructor(
			 private $q:ng.IQService
			,private messageBus:MessageBusService
		)
		{

		}
		pickFile():ng.IPromise<string>
		{
			this.deferred = this.$q.defer();
			this.messageBus.emit(GalleryPickerEvent.PICK );
			return this.deferred.promise;
		}
		public resolve( file:string )
		{
			this.deferred.resolve( file );
		}
		public reject()
		{
			this.deferred.reject();
		}
	}


}