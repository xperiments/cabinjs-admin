///<reference path="../reference.ts"/>

module xp.mdposteditor.directives
{

	export class EnterKey implements ng.IDirective
	{
		static inject = { "ngEnter":()=>new EnterKey };

		link( scope:ng.IScope, element:ng.IAugmentedJQuery, attrs:ng.IAttributes )
		{

			element.bind("keydown keypress", function(event) {
				if(event.which === 13) {
					scope.$apply(function(){
						scope.$eval(attrs['ngEnter'], {'event': event});
					});

					event.preventDefault();
				}
			});

		}
	}
}