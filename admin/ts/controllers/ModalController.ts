///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{

	import DI = xp.mdposteditor.DI;
	import MessageBusService = xp.mdposteditor.services.MessageBusService;
	import ModalService = xp.mdposteditor.services.ModalService;
	import ModalServiceEvent = xp.mdposteditor.services.ModalServiceEvent;

	export class ModalController
	{
		static $inject = [ DI.$scope, DI.$q, DI.MessageBusService, DI.ModalService ];
		title:string;
		content:string;
		visible:boolean = false;
		constructor( private $scope, private $q:ng.IQService, private messageBusService:MessageBusService, private modalService:ModalService )
		{
			messageBusService.on( ModalServiceEvent.SHOW,( event:any, data:any)=>{
				this.title = data.title;
				this.content = data.content;
				this.visible = true;
			});
		}
		accept()
		{
			this.visible = false;
			this.modalService.accept();
		}
		cancel()
		{
			this.visible = false;
			this.modalService.cancel();
		}


	}

}