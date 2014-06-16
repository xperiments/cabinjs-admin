/**
 * Created by pedro.casaubon on 10/06/14.
 */
module xp.mdposteditor.config
{
	export class Router
	{
		static $inject = ['$routeProvider', '$locationProvider'];
		constructor( $routeProvider:ng.route.IRouteProvider, $locationProvider:ng.ILocationProvider)
		{
			$routeProvider
				.when('/', {
					template: ListPostView.html,
					controller:  xp.mdposteditor.controllers.ListPostsController,
					controllerAs: 'list'
				})
				.when('/posts', {
					template: ListPostView.html,
					controller:  xp.mdposteditor.controllers.ListPostsController,
					controllerAs: 'list'
				})
				.when('/edit/:id', {
					template: EditPostView.html,
					controller:  xp.mdposteditor.controllers.EditPostController,
					controllerAs: 'edit'
				})

		}
	}
}
