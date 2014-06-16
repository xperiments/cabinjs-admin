///<reference path="../reference.ts"/>
module xp.mdposteditor.controllers
{
	import DI = xp.mdposteditor.DI;
	export class SideController
	{
		static $inject = [DI.$scope];

		constructor( private $scope )
		{

		}
		dashboard(){}
		posts(){}
		media(){}
	}

}