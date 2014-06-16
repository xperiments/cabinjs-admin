///<reference path="../reference.ts"/>

//https://github.com/borisyankov/DefinitelyTyped/issues/2311
interface JQueryEventObject
{
	dataTransfer?:DataTransfer;
}

module xp.mdposteditor.directives
{
	import IInjectableObject = io.xperiments.angularjs.IInjectableObject;

	export interface FileDropZoneScope extends ng.IScope
	{
		onDrop:(params:any)=>void;
		file:File;
		fileName:string;
	}


	export class FileDropZoneDirective implements ng.IDirective
	{
		static inject:IInjectableObject = { "fileDropzone":()=>new FileDropZoneDirective() };
		restrict:string = "A";
		scope:any =
		{
			file: '=',
			fileName: '=',
			onDrop:'&'
		}

		link( scope:FileDropZoneScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes, $http:ng.IHttpService )
		{
				var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
				processDragOverOrEnter = function(event) {
					if (event != null) {
						event.preventDefault();
					}
					event.dataTransfer.effectAllowed = 'copy';
					return false;
				};
				validMimeTypes = attrs['fileDropzone'];
				checkSize = function(size) {
					var _ref;
					if (((_ref = attrs['maxFileSize']) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs['maxFileSize']) {
						return true;
					} else {
						alert("File must be smaller than " + attrs['maxFileSize'] + " MB");
						return false;
					}
				};
				isTypeValid = function(type) {
					if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
						return true;
					} else {
						alert("Invalid file type.  File must be one of following types " + validMimeTypes);
						return false;
					}
				};
				element.bind('dragover', processDragOverOrEnter);
				element.bind('dragenter', processDragOverOrEnter);
				return element.bind('drop', function(event:JQueryEventObject) {
					var file, name, reader, size, type;
					if (event != null) {
						event.preventDefault();
					}
					var textDrop = event.dataTransfer.getData('Text');
					if( textDrop!="" )
					{
						if( textDrop.indexOf('http')!=0 ) return false;
						scope.onDrop && scope.onDrop({data:{textDrop:textDrop}});
						return false;
					}

					file = (<DataTransfer>event.dataTransfer).files[0];
					name = file.name;
					type = file.type;
					size = file.size;

					reader = new FileReader();
					reader.onload = function(evt) {
						if (checkSize(size) && isTypeValid(type)) {
							return scope.$apply(function() {

								scope.file = file;
								if (angular.isString(scope.fileName))
								{
									scope.fileName = name;
								}
								scope.onDrop && scope.onDrop({data:{file:file}});
							});
						}
					};

					reader.readAsDataURL(file);
					return false;
				});
		}
	}
}