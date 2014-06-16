/**
 * HandSON.ts
 * Created by xperiments on 03/06/14.
 */
///<reference path="../reference.ts"/>
interface Window
{
	HanSON:any;
}
module xp.mdposteditor.services
{

	export class HanSON
	{
		constructor(){ return window.HanSON; }
	}
}