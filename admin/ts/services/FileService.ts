/**
 * FileUploader.ts
 * Created by xperiments on 03/06/14.
 */
///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import DI = xp.mdposteditor.DI;
	export interface IFileUploaderFile
	{
		contents:any;
		name:string;
	}
	export class FileService
	{
		static $inject = [DI.$http];
		constructor( private $http:ng.IHttpService ){}
		uploadFilesToUrl( uploadUrl:string, contents:IFileUploaderFile[], uploadDir:string, type:string = "image", postPublished:string = "0" ):ng.IPromise<any>
		{
			var fd:FormData = new FormData();
			fd.append('uploadDir', uploadDir);
			fd.append('type', type);
			fd.append('postPublished', postPublished);
			contents.forEach(( file:IFileUploaderFile )=>{
				fd.append("uploadFiles[]", file.contents, file.name );
			});

			return this.$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).then( (data)=>{
				return data.data;
			})
		}
		deleteFile( file:string )
		{

			var fd:FormData = new FormData();
				fd.append('file', file);

			return this.$http.post('/delete', fd,{
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			} ).then( (data)=>{
				return data.data;
			})
		}
		downloadFile( source:string, dest:string ):ng.IPromise<any>
		{

			return this.$http.get('/downloadFile', { params:{ src:source, dst:dest } } ).then( (data)=>{
				return data.data;
			})
		}
		getPostFileName( postTile:string )
		{
			return postTile
				.toLowerCase() // change everything to lowercase
				.replace(/^\s+|\s+$/g, '') // trim leading and trailing spaces
				.replace(/[_|\s|\.]+/g, '-') // change all spaces, periods and underscores to a hyphen
				.replace(/[^a-z\u0400-\u04FF0-9-]+/g, '') // remove all non-cyrillic, non-numeric characters except the hyphen
				.replace(/[-]+/g, '-') // replace multiple instances of the hyphen with a single instance
				.replace(/^-+|-+$/g, ''); // trim leading and trailing hyphens
		}


	}
}