/**
 * AppBase.ts
 * Created by xperiments on 10/06/14.
 */
///<reference path="reference.ts"/>

module io.xperiments.angularjs
{
	export interface IInjectable
	{
		():ng.IDirective;
	}
	export interface IInjectableObject
	{
		[name:string]:IInjectable
	}
	export interface IAppBase
	{
		app:ng.IModule;
		boot();

	}
	export class AppBase implements IAppBase
	{
		app:ng.IModule;
		constructor( public id:string = "app", public dependencies:string[] = [] )
		{
			this.app = angular.module( id, dependencies );
			this.boot();
		}
		boot(){}



		/* UTILS */
		public wireServices( package:any ){ this.app.service( package ) }
		public wireControllers(  package:any ){ this.app.controller( package ) }
		public wireDirectives(  package:any ){

			Object.keys( package ).forEach( ( clsName:string )=>{
				package[clsName].hasOwnProperty('inject') && this.app.directive( package[clsName].inject );
			});
		}
		public wireFilters( package:any ){

			Object.keys( package ).forEach( ( clsName:string )=>{
				package[clsName].hasOwnProperty('inject') && this.app.filter( package[clsName].inject );
			});
		}
		public config( package:any ){
			Object.keys( package ).forEach( ( clsName:string )=>{
				this.app.config( package[clsName] );
			});
		}
		public constants( obj:{[ name:string]:any} )
		{
			this.app.constant( obj );
		}
	}

	export class StaticEvent
	{
		static init( EventClass:StaticEvent )
		{
			Object.keys( EventClass ).forEach(( key:string )=>{
				EventClass[key] = [ StaticEvent.className( EventClass ), key ].join('.')
			})
		}
		static className( cls:any ):string
		{
			var funcNameRegex = /function (.{1,})\(/;
			var results = (funcNameRegex).exec(cls.toString());
			return (results && results.length > 1) ? results[1] : "";
		}
	}

}

