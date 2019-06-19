/**游戏组件对象基类 */
class GameComponent {
	/**组件id */
	private compid: number
	public constructor() {
		this.compid = generateId()
	}

	public getId(): number {
		return this.compid;
	}
	public destructor() {
	}
}

/**组件化 */
interface Componentable {
	components: GameComponent[]
	/**添加组件 */
	addComponent(comp: GameComponent)
	/**删除组件 */
	removeComponent(comp: GameComponent)
}