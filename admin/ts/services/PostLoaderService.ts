/**
 * PostLoader.ts
 * Created by xperiments on 29/05/14.
 */
///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import Post = xp.mdposteditor.models.Post;
	import DI = xp.mdposteditor.DI;
	export class PostLoaderService
	{
		static $inject:string[] = [
			 DI.$http
			,DI.$timeout
			,DI.$q
			,DI.HanSON
		];
		currentPost:any;
		constructor( private $http:ng.IHttpService , private $timeout:ng.ITimeoutService, private $q:ng.IQService, private hanSON:any ){}

		load( fileName:string ):ng.IPromise<any>
		{
			var deferred = this.$q.defer();
			if(fileName=="::new")
			{
				var newPost:Post = new Post();
					newPost.date = Post.getDateString(new Date);
					newPost.published = false;
				// Resolve the deferred $q object before returning the promise
				deferred.resolve(newPost);
				return deferred.promise;
			} else {
				this.$http.get('/posts/'+fileName)
					.then((data:any)=>{ deferred.resolve( this.getMetadata( data.data, fileName ) ); } );

				return deferred.promise;
			}
		}

		getMetadata( content:string, filename:string  ):Post
		{

			var curlyNest = 1;
			var currentIndex = content.indexOf('{')+1;

			while (curlyNest !== 0 && content.substr(currentIndex).length > 0) {
				if (content.substr(currentIndex).indexOf('}') === -1 &&
					content.substr(currentIndex).indexOf('{') === -1) {
					return null;
				}
				if (content.substr(currentIndex).indexOf('}') !== -1) {
					if (content.substr(currentIndex).indexOf('{') !== -1) {
						if (content.substr(currentIndex).indexOf('}') < content.substr(currentIndex).indexOf('{')) {
							currentIndex += content.substr(currentIndex).indexOf('}') + 1;
							curlyNest--;
						} else {
							currentIndex += content.substr(currentIndex).indexOf('{') + 1;
							curlyNest++;
						}
					} else {
						currentIndex += content.substr(currentIndex).indexOf('}') + 1;
						curlyNest--;
					}
				} else {
					currentIndex += content.substr(currentIndex).indexOf('{') + 1;
					curlyNest++;
				}
			}


			var metadata:Post = this.hanSON.parse( content.substr( 0,currentIndex ) );
			var content:string = content.substr( currentIndex+1 );
				metadata['content'] = content;
				metadata['file'] = filename;
				metadata.published = filename[0]!="_";
			return metadata;
		}
	}
}
