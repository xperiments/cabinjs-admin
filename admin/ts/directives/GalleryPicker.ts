///<reference path="../reference.ts"/>

module xp.mdposteditor.directives
{
	import GalleryPickerController = xp.mdposteditor.controllers.GalleryPickerController;
	export class GalleryPickerDirective implements ng.IDirective
	{
		static inject = { "mdGallery":()=>new GalleryPickerDirective };
		scope:any = {
			onSelect:'&',
			selectedPath: '='
		};
		restrict:string = 'E';
		controller:any = GalleryPickerController;
		controllerAs:string = "gallery";
		template:string = GalleryPicker.html;
		link( scope:any, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, ctrl )
		{
			console.log(  scope,element,attrs,ctrl  )

		}
	}


}