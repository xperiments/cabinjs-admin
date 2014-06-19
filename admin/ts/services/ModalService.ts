///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import MessageBusService = xp.mdposteditor.services.MessageBusService;
	import StaticEvent = io.xperiments.angularjs.StaticEvent;
	import DI = xp.mdposteditor.DI;

	export class ModalServiceEvent
	{
		static SHOW:string = "";
	}
	export module ModalServiceEvent
	{
		StaticEvent.init( ModalServiceEvent );
	}
	export class ModalService
	{
		static $inject = [
			DI.$q
			,DI.MessageBusService
		];

		deferred:ng.IDeferred<any>;
		constructor
		(
			private $q:ng.IQService
			,private messageBusService:MessageBusService
		)
		{

		}
		show( title:string, content:string ):ng.IPromise<boolean>
		{
			this.deferred = this.$q.defer();
			this.messageBusService.emit(ModalServiceEvent.SHOW, { title:title, content:content } );
			return this.deferred.promise;
		}
		accept()
		{
			this.deferred.resolve();
		}
		cancel()
		{
			this.deferred.reject();
		}

	}

}
