/**
 * Post.ts
 * Created by xperiments on 29/05/14.
 */
///<reference path="../reference.ts"/>
module xp.mdposteditor.models
{
	export interface IPostCollection
	{
		[filename:string]:IPost;
	}
	export interface IPost
	{
		title:string;
		date:string;
		description?:string;
		image?:string;
		content?:string;
		categories?:string[];
		published:boolean;

	}
	export interface IPostJSON
	{
		title:string;
		date:string;
		description?:string;
		image?:string;
		content?:string;
		categories?:string[];
		published:boolean;

	}
	export class Post implements IPost
	{
		title:string;
		date:string;
		description:string;
		image:string;
		content:string;
		categories:string[];
		file:string;
		published:boolean;
		serialize()
		{
			var jsonMetadata:IPostJSON = <IPostJSON>{};
				jsonMetadata.title = this.title;
				jsonMetadata.date = this.date;
			this.description && (jsonMetadata.description = this.description);
			this.image && this.image!="" && (jsonMetadata.image = this.image.replace('./src',''));
			this.categories && (jsonMetadata.categories = this.categories);
			return ( JSON.stringify(jsonMetadata,null,4)+'\n'+this.content );
		}
		mix( json:any ):void
		{
			Object.keys( json ).forEach((key)=>{
				this[ key ] = json[key];
			});
		}

		static getDateString( date:Date )
		{
			return [date.getFullYear(),date.getMonth()+1,date.getDate()].join('-');
		}


	}

}