/**
 * PostWriter.ts
 * Created by xperiments on 03/06/14.
 */
///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import FileUploader = xp.mdposteditor.services.FileUploader;
	import IFileUploaderFile = xp.mdposteditor.services.IFileUploaderFile;
	import DI = xp.mdposteditor.DI;
	import Post = xp.mdposteditor.models.Post;

	export class PostWriter
	{
		static $inject = [DI.$http,DI.FileUploader];
		constructor
		(
			 private $http:ng.IHttpService
			,public fileUploader:FileUploader
		){}
		updatePost( post:Post ):ng.IPromise<any>
		{
			var postFile:string = post.serialize();
			var blob = new Blob([postFile], { type: "text/plain"});
			var fileName = post.file ? post.file : this.fileUploader.getPostFileName( post.title )+'.md';
			return this.fileUploader.uploadFilesToUrl('/upload', [ { contents:blob, name:fileName} ], './posts/','post');
		}
	}

}
