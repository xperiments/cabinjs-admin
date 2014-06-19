/**
 * PostDirectory.ts
 * Created by xperiments on 29/05/14.
 */
///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import IPostCollection = xp.mdposteditor.models.IPostCollection;
	import DI = xp.mdposteditor.DI;
	export class PostDirectoryService
	{
		static $inject:string[] = [DI.$http];
		posts:IPostCollection = {};
		constructor(private $http:ng.IHttpService)
		{

		}
		getPosts()
		{
			return this.$http.get('/listPosts').success((data:any)=>{
				this.posts = data;
			})
		}
	}
}