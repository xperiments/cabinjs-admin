///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import IMediaResource = xp.mdposteditor.services.IMediaResource;
	import FileUploader = xp.mdposteditor.services.FileUploader;
	import Media = xp.mdposteditor.services.Media;
	import MessageBus = xp.mdposteditor.services.MessageBus;
	import DI = xp.mdposteditor.DI;

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
			,DI.Media
			,DI.MessageBus
			,DI.FileUploader
		];
		static PICK:string = "GalleryPickerController.PICK";
		static CLOSE:string = "GalleryPickerController.CLOSE";
		static SELECT:string = "GalleryPickerController.SELECT";


		public visible:boolean = false;
		public imageNode:IMediaResource[];
		public imageParentNode:IMediaResource[];
		public rootPath:string;
		public folderDepth:IMediaResource[][] =[];
		public folderPath:string[] =['root'];
		public uploadImage:string;
		public uploadImageName:string;
		public onSelect:(name:string)=>void;
		public currentDeferred:ng.IDeferred<any>;
		public lastFolder:IMediaResource;
		constructor(
			 private $scope:ng.IScope
			,private $timeout:ng.ITimeoutService
			,private media:Media
			,private msgBus:MessageBus
			,private fileUploader:FileUploader
		)
		{
			this.msgBus.on(GalleryPickerController.PICK, ( event, deferred:ng.IDeferred<any> )=>{

				this.currentDeferred = deferred;
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
			this.currentDeferred.reject();
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
			this.currentDeferred.resolve( image );
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
				this.fileUploader.downloadFile(dropObject.textDrop, './src/images/' + this.getRelativeUploadPath()+ this.hashCode( dropObject.textDrop ) )
					.then((data)=>
					{
						this.$timeout( ()=>{ this.toggleGalleryPicker(); this.currentDeferred.resolve(data.downloadedImage);},1000);
					});
			}
			else
			{
				this.fileUploader.uploadFilesToUrl('/upload', [{ contents: dropObject.file, name: dropObject.file.name }], './src/images/' + this.getRelativeUploadPath())
					.then((data)=>
					{
						this.toggleGalleryPicker();
						this.currentDeferred.resolve(data.uploadedFiles[0].path);
					});
			}
		}

		private updateMedia( ):ng.IPromise<any>
		{
			return this.media.listMedia().then( ( data:IMediaResource )=>this.initFolder(data) );
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