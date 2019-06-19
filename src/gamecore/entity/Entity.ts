class Entity extends BaseContainer implements Componentable, AttributesInterface {
	//属性相关
	private gameObjId: number
	/**名字 */
	name: string
	/**类型 */
	type: EntityType
	/**等级 */
	level: number
	/**外观类型 (静态外观 或 动态外观)*/
	bodyType: number
	/**外观 */
	bodyId: number
	/**x坐标 */
	cellx: number
	/**y坐标 */
	celly: number
	/**朝向 */
	dir: number
	/**移速 */
	speed: number
	//增益属性
	/**移速增益或减益 */
	speedPromotPer: number
	/**攻速增益或减益 */
	attackSpeedPromotPer: number
	/**防御增益或减益 */
	defPromotPer: number
	/**攻击增益或减益 */
	atkPromotPer: number
	/**组件列表 */
	components: GameComponent[]
	/**属性监听回调 */
	propCallFunc: any

	public constructor(property) {
		super();
		this.gameObjId = generateId();
		this.components = [];
		this.propCallFunc = {}
		this.propCallFunc["cellx"] = this.onCellXChanged.bind(this)
		this.propCallFunc["celly"] = this.onCellYChanged.bind(this)
		this.setProperty(property)
		this.registPropCallback()
	}

	public onTick() {
	}

	public unRegistPropCallback() {
		var keys = Object.keys(this.propCallFunc)
		for (var key in keys) {
			delete this.propCallFunc[keys[key]]
		}
		this.propCallFunc = {}
	}

	/**设置属性 */
	public setProperty(property) {
		for (var key in property) {
			var oldValue = this[key]
			this[key] = property[key]
			var func = this.propCallFunc[key]
			if (func) {
				func(oldValue, property[key])
			}
		}
	}

	public getId(): number {
		return this.gameObjId;
	}

	/**添加组件 */
	public addComponent(comp: GameComponent) {
		this.components.push(comp);
	}
	/**移除组件 */
	public removeComponent(comp: GameComponent) {
		let compId = comp.getId()
		var compList = this.components
		var compLength = compList.length;
		for (var i = 0; i < compLength; i++) {
			if (compList[i].getId() == comp.getId()) {
				var rcomp = compList.splice(i, 1);
				rcomp[0].destructor();
				rcomp = null;
				break
			}
		}
	}

	public destructor() {
		for (var i in this.components) {
			this.components[i].destructor()
		}
		this.components.length = 0
		this.unRegistPropCallback()
		if (this.parent) {
			this.parent.removeChild(this)
		}
	}

	//获取移速
	public get movespeed() {
		return this.speed * (1 + (this.speedPromotPer || 0))
	}


	/**************************************************** 
	 * 						属性变化
	 ****************************************************
	*/
	/**注册属性监听 
	 * @override
	*/
	public registPropCallback() {
		//this.propCallFunc["hp"] = this.onHpChanged.bind(this)
	}

	public onCellXChanged(oldcellx, cellx) {
		this.x = cellx * 32
	}

	public onCellYChanged(oldcelly, celly) {
		this.y = celly * 32
	}
}