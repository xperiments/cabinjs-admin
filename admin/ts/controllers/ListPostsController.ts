///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import PostDirectoryService = xp.mdposteditor.services.PostDirectoryService;
	import FileService = xp.mdposteditor.services.FileService;
	import ModalService = xp.mdposteditor.services.ModalService;
	import IPostCollection = xp.mdposteditor.models.IPostCollection;
	import DI = xp.mdposteditor.DI;
	export class ListPostsController
	{
		static $inject = [ DI.$scope, DI.PostDirectoryService, DI.FileService, DI.ModalService ];
		posts:IPostCollection;
		constructor( private $scope, private postDirectoryService:PostDirectoryService, private fileService:FileService, private modalService:ModalService )
		{
			this.listPosts();
		}
		listPosts():ng.IPromise<any>
		{
			return this.postDirectoryService.getPosts().then( ()=>this.posts = this.postDirectoryService.posts );
		}
		deletePost( file:string ):void
		{
			this.modalService.show( "Confirm Delete","Are you sure?" )
				.then(()=>{
					this.fileService.deleteFile( file )
						.then( ()=>this.listPosts() );
				})

		}
	}

}