/**
 * PostWriter.ts
 * Created by xperiments on 03/06/14.
 */
///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import FileService = xp.mdposteditor.services.FileService;
	import IFileUploaderFile = xp.mdposteditor.services.IFileUploaderFile;
	import DI = xp.mdposteditor.DI;
	import Post = xp.mdposteditor.models.Post;

	export class PostWriterService
	{
		static $inject = [DI.$http,DI.FileService];
		constructor
		(
			 private $http:ng.IHttpService
			,public fileService:FileService
		){}
		updatePost( post:Post ):ng.IPromise<any>
		{
			var postFile:string = post.serialize();
			var blob = new Blob([postFile], { type: "text/plain"});
			var fileName = post.file ? post.file : this.fileService.getPostFileName( post.title )+'.md';
				fileName = fileName[0]=="_" ? fileName.substr(1):fileName;
			return this.fileService.uploadFilesToUrl('/upload', [ { contents:blob, name:fileName} ], '/posts/','post', post.published ? "1":"0");
		}

	}

}
