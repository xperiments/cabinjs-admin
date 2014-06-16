///<reference path="../reference.ts"/>
module xp.mdposteditor.services
{
	import DI = xp.mdposteditor.DI;
	export interface FlickrCommonsImage
	{
		big:string;
		small:string;
	}
	export class FlickrCommons
	{
		static $inject = [DI.$http];
		searchPhotoResults:FlickrCommonsImage[];
		searchResult:
		{
			page:number;
			pages:number;
			perpage:number;
			images:FlickrCommonsImage[];
		}
		constructor(private $http:ng.IHttpService )
		{
			this.search( 'cars')

		}
		search( text:string , per_page:number = 100 ):ng.IPromise<any>
		{
			return this.$http({
				url: 'https://api.flickr.com/services/rest/',
				method: "GET",
				params: {
					 method: "flickr.photos.search"
					,api_key: "2c6a2d4c00106f6f3fe64dcfa433c9ca"
					,tags: text.replace(' ',',')
					,text: text
					,license: "1%2C2%2C3%2C4%2C5%2C6%2C7"
					,format: "json"
					,nojsoncallback: "1"
					,sort: "relevance"
					,per_page:per_page

				}
			}).then( (response:any )=>{

				var photos = response.data.photos.photo;
				var images:string[] = [];
				this.searchPhotoResults = photos.map( ( datas )=>{
					var id = datas.id;
					var title = datas.title;
					var secret = datas.secret;
					var server = datas.server;
					var farm = datas.farm;
					var owner = datas.owner;
					var base = id + '_' + secret + '_s.jpg';
					var major = id + '_' + secret + '_b.jpg';
					var url = 'http://farm' + farm + '.static.flickr.com/' + server + '/' + major;
					var img = 'http://farm' + farm + '.static.flickr.com/' + server + '/' + base;

					return { small:img, big:url };
				});


				this.searchResult = {
					page:response.data.photos.page,
					pages:response.data.photos.pages,
					perpage:response.data.photos.perpage,
					images:this.searchPhotoResults
				}
			})
		}
	}

}


// list avaliable sizes
// https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=2c6a2d4c00106f6f3fe64dcfa433c9ca&photo_id=14304486913
