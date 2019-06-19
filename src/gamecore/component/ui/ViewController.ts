/**
 * 界面controller基类
 */
class ViewController {
	/**游戏内事件监听列表 */
	private gameEventList: any;
	/**界面实例 */
	private viewInstance: any

	public constructor(view) {
		this.viewInstance = view
		this.gameEventList = {}
	}

	/**返回view的实例 */
	public get view(): any {
		return this.viewInstance
	}

	/**
	* 添加游戏内事件侦听
	* @param type 事件的类型。
	 */
	public bindGameEvent(type: GameEvent, listener: Function, thisObject: any, viewName: string) {
		if (!this.gameEventList[viewName]) {
			this.gameEventList[viewName] = {}
		}
		if (!this.gameEventList[viewName][type]) {
			var eventId = App.EventSystem.add(type, listener, thisObject)
			this.gameEventList[viewName][type] = eventId
		}
	}

	/**暂停所有事件监听 */
	public pauseGameEvent(viewName: string) {
		for (var eventType in this.gameEventList[viewName]) {
			var eventId = this.gameEventList[viewName][eventType]
			App.EventSystem.pause(eventId)
		}
	}

	/**恢复所有事件监听 */
	public resumeGameEvent(viewName: string) {
		for (var eventType in this.gameEventList[viewName]) {
			var eventId = this.gameEventList[viewName][eventType]
			App.EventSystem.resume(eventId)
		}
	}

	/**界面打开时 */
	public onShow(viewName: string) {
		this.resumeGameEvent(viewName)
	}
	/**界面关闭时 */
	public onHide(viewName: string) {
		this.pauseGameEvent(viewName)
	}
	public close(viewName: string) {
		this.onHide(viewName)
	}
	/**界面销毁时 */
	public destroy(viewName: string) {
		this.releaseGameEvents(viewName)
	}
	/**界面初始化成功 */
	public onCreate(viewName: string) {
		//绑定事件 全部写在这里
	}

	/**移除事件监听 */
	public releaseGameEvents(viewName: string) {
		let gameEvents = this.gameEventList[viewName]
		for (var eventType in gameEvents) {
			var eventId = gameEvents[eventType]
			App.EventSystem.remove(eventId)
		}
		delete this.gameEventList[viewName]
	}
}