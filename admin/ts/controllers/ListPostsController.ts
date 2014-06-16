///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import PostDirectory = xp.mdposteditor.services.PostDirectory;
	import FileUploader = xp.mdposteditor.services.FileUploader;
	import IPostCollection = xp.mdposteditor.models.IPostCollection;
	import DI = xp.mdposteditor.DI;
	export class ListPostsController
	{
		static $inject = [ DI.$scope, DI.PostDirectory, DI.FileUploader ];
		posts:IPostCollection;
		constructor( private $scope, private postDirectory:PostDirectory, private fileUploader:FileUploader )
		{
			this.listPosts();
		}
		listPosts():ng.IPromise<any>
		{
			return this.postDirectory.getPosts().then( ()=>this.posts = this.postDirectory.posts );
		}
		deletePost( file:string ):ng.IPromise<any>
		{
			return this.fileUploader.deleteFile( file ).then( ()=>{ this.listPosts() })
		}
	}

}