/**
 * UI管理类
 */

class UIManager {
	//单例
	public static $instance: UIManager;
	public _windowContainer: BaseContainer

	/**记录创建的界面 */
	public viewList: any;
	/**记录打开的界面 */
	public openList: any;

	public constructor() {
		this.viewList = {}
		this.openList = {}
	}

	public init(stage) {
		this._windowContainer = new BaseContainer()
		this._windowContainer.width = stage.width
		this._windowContainer.height = stage.height
		stage.addChild(this._windowContainer)
	}

	public static get instance(): UIManager {
		if (!this.$instance) {
			this.$instance = new UIManager();
		}
		return this.$instance
	}

	/**打开窗口 */
	public showUI(viewName: string, callback?) {
		var viewInstance = this.viewList[viewName]
		if (!viewInstance) {
			var viewClass = egret.getDefinitionByName(viewName)
			if (viewClass) {
				viewInstance = new viewClass(viewName)
				this._windowContainer.addChild(viewInstance)
				this.viewList[viewName] = viewInstance
			}
		} else {
			this._windowContainer.addChild(viewInstance)
		}
		if (viewInstance) {
			viewInstance.onShow()
			this.openList[viewName] = viewInstance
		}
	}

	/**关闭窗口 */
	public hideUI(viewName: string) {
		var viewInstance = this.openList[viewName]
		if (viewInstance) {
			if (viewInstance.hideDestroy) {
				viewInstance.destroy()
				this._windowContainer.removeChild(viewInstance)
				delete this.openList[viewName]
				delete this.viewList[viewName]
			} else {
				viewInstance.onHide()
				this._windowContainer.removeChild(viewInstance)
				delete this.openList[viewName]
			}
		}
	}

	/**销毁窗口 */
	public destroyUI(viewName: string) {
		var viewInstance = this.openList[viewName] || this.viewList[viewName]
		if (viewInstance) {
			viewInstance.destroy()
			this._windowContainer.removeChild(viewInstance)
			delete this.openList[viewName]
			delete this.viewList[viewName]
		}
	}
}