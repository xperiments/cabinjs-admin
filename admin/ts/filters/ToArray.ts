///<reference path="../reference.ts"/>

module xp.mdposteditor.filters
{

	export class ToArray implements ng.IDirective
	{
		static inject = { "toArray":()=>ToArray.toArray };

		static toArray( obj:any ):any[]
		{
			var result:any[] = [];
			angular.forEach(obj, (val, key)=>{ result.push(val); });
			return result;
		}

	}
}