///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import IMediaResource 		= xp.mdposteditor.services.IMediaResource;
	import IPost 				= xp.mdposteditor.models.IPost;

	import PostLoaderService	= xp.mdposteditor.services.PostLoaderService;
	import PostWriterService	= xp.mdposteditor.services.PostWriterService;
	import GalleryPickerService = xp.mdposteditor.services.GalleryPickerService;

	import Post 				= xp.mdposteditor.models.Post;

	import DI 					= xp.mdposteditor.DI;

	export class EditPostController
	{
		static $inject = [
			 DI.$scope
			,DI.$routeParams
			,DI.$location
			,DI.PostLoaderService
			,DI.PostWriterService
			,DI.GalleryPickerService
		];
		post:Post;
		image:string="";
		markdown:string="";
		previewVisible:boolean = false;
		editor:AceAjax.Editor;
		hasHeadImage:boolean = false;
		constructor
		(
			 private $scope
			,private $routeParams
			,private $location
			,private postLoaderService:PostLoaderService
			,private postWriterService:PostWriterService
			,private galleryPickerService:GalleryPickerService

		)
		{
			$scope.aceLoaded = (editor:AceAjax.Editor)=>
			{
				this.editor = editor;
			};
			postLoaderService.load( $routeParams.id ).then(( response:IPost )=>{
				this.post = new Post();
				this.post.mix( response );
				this.post.image && (this.hasHeadImage = true);
			});

		}

		togglePreview()
		{
			this.previewVisible = !this.previewVisible;
		}
		insertImage()
		{

			this.galleryPickerService.pickFile().then((file)=>{
				this.editor.insert('\r\n');
				this.editor.insert('![image]('+file.replace('/src','')+') ');
				this.editor.insert('\r\n');
				this.updateEditor();
			});

		}
		updatePost()
		{
			this.postWriterService.updatePost( this.post ).then(( )=> this.$location.path( "/" ));
		}
		updateEditor()
		{
			this.post.content = this.editor.getSession().getValue();
		}
		setStyle( style:string )
		{
			var selection:string = this.getSelection();
			var result:string = "";
			switch ( style )
			{
				case "b":
					result = ["**",selection,"**"].join('');
					break;
				case "i":
					result = ["*",selection,"*"].join('');
					break;
				case "q":
					result = ["\n> ",selection].join('');
					break;
				case "o":
					result = ["\n1. ",selection].join('');
					break;
				case "u":
					result = ["\n - ",selection].join('');
					break;
				case "h":
					result = ["\n----------\n",selection].join('');
					break;
			}
			this.editor.insert(result);
			this.updateEditor();
		}

		pickHeader()
		{
			this.galleryPickerService.pickFile().then((file)=>{
				this.post.image = file;
				this.hasHeadImage = true;
			});
		}
		clearHeader()
		{
			this.post.image = null;
			this.hasHeadImage = false;
		}

		getSelection():string
		{
			return this.editor.session.getTextRange(this.editor.getSelectionRange());
		}

	}

}