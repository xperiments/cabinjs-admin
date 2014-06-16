/**
 * MediaService.ts
 * Created by xperiments on 04/06/14.
 */
///<reference path="../reference.ts"/>


module xp.mdposteditor.services
{
	import PostCollection = xp.mdposteditor.models.IPostCollection;
	import DI = xp.mdposteditor.DI;

	export interface IMediaResource
	{
		path:string;
		name:string;
		type:string;
		ext:string;
		children:IMediaResource[];
	}

	export class Media
	{
		static $inject =  [ DI.$http ];
		constructor(private $http:ng.IHttpService)
		{

		}
		listMedia():ng.IPromise<any>
		{
			return this.$http.get('/listImages').then( (data)=>{ return data.data } );
		}
	}
}
