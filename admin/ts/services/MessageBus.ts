/**
 * MessageBus.ts
 * Created by xperiments on 04/06/14.
 */
///<reference path="../reference.ts"/>


module ng
{
	export interface IScope
	{
		$on(name: '$destroy', listener:Function);
	}
}

module xp.mdposteditor.services
{
	//http://stackoverflow.com/questions/11252780/whats-the-correct-way-to-communicate-between-controllers-in-angularjs/19498009#19498009
	//https://gist.github.com/floatingmonkey/3384419
	//https://gist.github.com/turtlemonvh/10686980
	import DI = xp.mdposteditor.DI;
	export class MessageBus
	{
		static $inject=[DI.$rootScope];
		constructor(private $rootScope:ng.IScope){}
		public emit(msg:string, data?:any )
		{
			data = data || {};
			this.$rootScope.$emit(msg, data);
		}
		public on(msg:string, func:any, scope?:ng.IScope ):any
		{
			var unbind = this.$rootScope.$on(msg, func);
			scope && scope.$on('$destroy', unbind);
			return unbind;
		}
	}
}
