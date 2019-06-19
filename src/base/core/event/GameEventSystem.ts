/**游戏事件通知管理中心 */
class GameEventObject extends GameComponent {
	/**事件id */
	eventId: GameEvent
	/**回调函数 */
	callback: Function
	/**归属者 */
	owner: any
	/**是否休眠 */
	isSleep: boolean

	public constructor(id, eventId, callback, owner) {
		super()
		this.eventId = eventId;
		this.callback = callback;
		this.isSleep = false;
		this.owner = owner;
	}

	public trigger(...param) {
		if (!this.isSleep) {
			this.callback.call(this.owner, ...param);
		}
	}

	public pause() {
		this.isSleep = true;
	}

	public resume() {
		this.isSleep = false;
	}
	/**是否可触发 */
	public canTriiger() {
		return !this.isSleep
	}
}

class GameEventSystem {
	/**事件监听列表 */
	private $eventHandles: any;
	/**事件对象列表 */
	private $eventObjList: any;
	/**事件下标索引列表 */
	private $eventIndexList: any;

	public constructor() {
		this.$eventHandles = {}
		this.$eventIndexList = {}
		this.$eventObjList = {}
	}

	/**创建事件对象 */
	private createEventObj(eventId: GameEvent, handle: Function, thisObj?: any): GameEventObject {
		var eventGenerateId = generateId()
		return new GameEventObject(eventGenerateId, eventId, handle, thisObj);
	}

	private static $instance: GameEventSystem;

	public static get instance(): GameEventSystem {
		if (this.$instance == null) {
			this.$instance = new GameEventSystem();
		}
		return this.$instance;
	}

	/**添加事件监听 */
	public add(eventId: GameEvent, handle: Function, thisObj?: any): number {
		var eventObj = this.createEventObj(eventId, handle, thisObj)
		if (!this.$eventHandles[eventId]) {
			this.$eventHandles[eventId] = [];
		}
		var eventObjId = eventObj.getId()
		this.$eventObjList[eventObjId] = eventObj;
		this.$eventHandles[eventId].push(eventObjId);
		this.$eventIndexList[eventObjId] = (this.$eventHandles[eventId].length - 1);
		return eventObjId
	}

	/**移除事件监听 */
	public remove(eventObjID: number) {
		var eventObj: GameEventObject = this.$eventObjList[eventObjID];
		if (eventObj) {
			var eventId = eventObj.eventId;
			var eventIndex = this.$eventIndexList[eventObjID]
			if (this.$eventHandles[eventId]) {
				//这里将id置0即可  不需要移除 否则下标会缩进导致下标列表有问题
				this.$eventHandles[eventId][eventIndex] = 0;
			}
			delete this.$eventIndexList[eventObjID]
			delete this.$eventObjList[eventObjID]
		}
	}

	/**暂停事件监听 */
	public pause(eventObjID: number) {
		var event: GameEventObject = this.$eventObjList[eventObjID]
		if (event) {
			event.pause()
		}
	}

	/**恢复事件监听 */
	public resume(eventObjID: number) {
		var event: GameEventObject = this.$eventObjList[eventObjID]
		if (event) {
			event.resume()
		}
	}

	/**恢复指定事件监听 */
	public resumeEvent(eventId: GameEvent) {
		var objArray = this.$eventHandles[eventId];
		if (objArray && objArray.length > 0) {
			var i: number
			var eventObjId
			var eventObj: GameEventObject;
			for (i = 0; i < objArray.length; i++) {
				eventObj = objArray[i];
				eventObjId = objArray[i];
				eventObj = this.$eventObjList[eventObjId]
				if (eventObj) {
					eventObj.resume();
				}
			}
		}
	}

	/**暂停指定事件 */
	public pauseEvent(eventId: GameEvent) {
		var objArray = this.$eventHandles[eventId];
		if (objArray && objArray.length > 0) {
			var i: number
			var eventObjId
			var eventObj: GameEventObject;
			for (i = 0; i < objArray.length; i++) {
				eventObjId = objArray[i];
				eventObj = this.$eventObjList[eventObjId]
				if (eventObj) {
					eventObj.pause();
				}
			}
		}
	}

	/**暂停所有事件 */
	public pauseAll() {
		var objList = this.$eventObjList;
		var eventId;
		var eventObj: GameEventObject;
		for (eventId in objList) {
			eventObj = objList[eventId];
			eventObj.pause();
		}
	}

	/**派发事件 */
	public dispatch(eventId: GameEvent, ...params) {
		let eventHandleList = this.$eventHandles[eventId];
		if (eventHandleList && eventHandleList.length > 0) {
			var i: number
			var eventObj: GameEventObject;
			var eventObjId;
			for (i = 0; i < eventHandleList.length; i++) {
				eventObjId = eventHandleList[i];
				eventObj = this.$eventObjList[eventObjId]
				if (eventObj) {
					eventObj.trigger(...params);
				}
			}
		}
	}
}