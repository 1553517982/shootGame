/**场景基类 */

class Scene extends BaseContainer {
	/**地图根节点 */
	private _mapRootLayer: BaseContainer;
	/**特效根节点 */
	private _effectRootLayer: BaseContainer;

	public constructor() {
		super()
		this._mapRootLayer = new BaseContainer()
		this.addChild(this._mapRootLayer)
	}

	public onEnter() {

	}

	public onExit() {

	}
}