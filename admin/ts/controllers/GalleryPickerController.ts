///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import IMediaResource 		= xp.mdposteditor.services.IMediaResource;
	import FileService 			= xp.mdposteditor.services.FileService;
	import MediaService 		= xp.mdposteditor.services.MediaService;
	import MessageBusService 	= xp.mdposteditor.services.MessageBusService;
	import GalleryPickerService = xp.mdposteditor.services.GalleryPickerService;
	import GalleryPickerEvent	= xp.mdposteditor.services.GalleryPickerEvent;
	import StaticEvent 			= io.xperiments.angularjs.StaticEvent;

	export interface IGalleryDropObject
	{
		file?:File;
		textDrop?:string;
	}
	export class GalleryPickerController
	{
		static $inject =
		[
			 DI.$scope
			,DI.$timeout
			,DI.MediaService
			,DI.MessageBusService
			,DI.FileService
			,DI.GalleryPickerService
		];



		public visible:boolean = false;
		public imageNode:IMediaResource[];
		public imageParentNode:IMediaResource[];
		public rootPath:string;
		public folderDepth:IMediaResource[][] =[];
		public folderPath:string[] =['root'];
		public uploadImage:string;
		public uploadImageName:string;
		public onSelect:(name:string)=>void;
		public lastFolder:IMediaResource;
		constructor(
			 private $scope:ng.IScope
			,private $timeout:ng.ITimeoutService
			,private mediaService:MediaService
			,private messageBusService:MessageBusService
			,private fileService:FileService
			,private galleryPickerService:GalleryPickerService
		)
		{
			this.messageBusService.on(GalleryPickerEvent.PICK, ( )=>{

				this.toggleGalleryPicker( );

			}, $scope );
		}
		public toggleGalleryPicker( )
		{

			this.visible = !this.visible;
			this.folderPath = ['root'];
			if( this.visible )
			{
				this.updateMedia();
			}
		}
		public close()
		{
			this.galleryPickerService.reject();
		}
		public showFolder( file:IMediaResource )
		{
			this.lastFolder = file;
			this.folderPath.push( file.name );
			this.folderDepth.push( this.imageNode );
			this.imageNode = file.children;
		}
		public selectImage( image:string )
		{
			this.toggleGalleryPicker();
			this.galleryPickerService.resolve( image );
		}

		public folderUp()
		{
			this.folderPath.pop();
			this.imageNode = this.folderDepth.pop()
		}
		public isMediaFile( file:IMediaResource )
		{
			return ['.jpg','.png','.gif'].indexOf( file.ext )!=-1;
		}
		public onDrop( dropObject:IGalleryDropObject = null  )
		{
			if( dropObject.textDrop )
			{
				this.fileService.downloadFile(dropObject.textDrop, './src/images/' + this.getRelativeUploadPath()+ this.hashCode( dropObject.textDrop ) )
					.then((data)=>
					{
						this.$timeout( ()=>{ this.toggleGalleryPicker(); this.galleryPickerService.resolve(data.downloadedImage);},1000);
					});
			}
			else
			{
				this.fileService.uploadFilesToUrl('/upload', [{ contents: dropObject.file, name: dropObject.file.name }], './src/images/' + this.getRelativeUploadPath())
					.then((data)=>
					{
						this.toggleGalleryPicker();
						this.galleryPickerService.resolve(data.uploadedFiles[0].path);
					});
			}
		}

		private updateMedia( ):ng.IPromise<any>
		{
			return this.mediaService.listMedia().then( ( data:IMediaResource )=>this.initFolder(data) );
		}

		private initFolder( data:IMediaResource )
		{
			this.rootPath = data.path;
			this.imageNode = data.children;
			this.lastFolder = data;
		}

		private getRelativeUploadPath()
		{
			var path:string[] = this.folderPath.slice(0); // clone array;
			path.push('');
			path.shift();
			console.log(path.join('/'));
			return path.join('/');
		}
		private hashCode( str:string ):number
		{
			var hash:number = 0;
			if (str.length == 0) return hash;
			for (var i:number = 0, total:number=str.length, char:number ; i < total; i++)
			{
				char = str.charCodeAt(i);
				hash = ((hash<<5)-hash)+char;
				hash = hash & hash; // Convert to 32bit integer
			}
			return hash;
		}

	}

}