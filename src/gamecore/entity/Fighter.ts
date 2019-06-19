/**
 * 可战斗实体的基类
 * 
 */

class Fighter extends Entity implements Fighteable, Moveable {
	/**目标 */
	private targetId: number
	/**当前动作 */
	private curAction: ActionType
	/**身体 */
	private bodyModel: AnimationSprite
	/**行为树 */
	private behaviorTree: bt.BehaviorTree
	/**寻路路径节点列表 */
	private pathNodes: MapGrid[]
	/**是否正在移动 */
	public isMoving: boolean
	/**目标点x坐标 */
	public tx: number
	/**目标点y坐标 */
	public ty: number
	/**攻击力 */
	public atk: number;
	/**防御力 */
	public def: number;
	/**hp */
	public hp: number;
	/**maxhp */
	public maxhp: number;

	public constructor(property) {
		super(property)
		this.isMoving = false
		this.curAction = ActionType.Idle

		this.updateBodyModel(this.bodyId)
		this.updateBodyPart()
		if (property.ai) {
			RES.getResAsync(property.ai, this.onBehaviorLoaded, this)
		}
	}

	private onBehaviorLoaded(config) {
		if (config) {
			this.behaviorTree = BehaviorTreeFactory.createTree(this.getId(), config)
		}
	}

	public onTick() {
		super.onTick()
		if (this.behaviorTree) {
			this.behaviorTree.onTick()
		}
	}

	public destructor() {
		super.destructor()
		if (this.behaviorTree) {
			this.behaviorTree.clear()
			this.behaviorTree = null
		}
	}

	//移动一次只会移动一个格子 所以没有停到格子中心点时需要强制对位
	private nextGrid: MapGrid
	private processingPath() {
		if (this.pathNodes && this.pathNodes.length > 0) {
			if (!this.nextGrid || (this.nextGrid && Math.floor(this.x) == Math.floor(this.nextGrid.x) && Math.floor(this.y) == Math.floor(this.nextGrid.y))) {
				this.nextGrid = this.pathNodes.shift()
				if (this.parent) {
					this.parent.setChildIndex(this, this.parent.numChildren - 32 + this.YToMapCellY)
				}
				this.move(Math.floor(this.nextGrid.x), Math.floor(this.nextGrid.y))
			}
		} else {
			this.nextGrid = null
		}
	}

	public get pathLength() {
		if (this.pathNodes) {
			return this.pathNodes.length
		}
		return 0
	}

	/**寻路 */
	public findPath(x: number, y: number) {
		if (this.tx != x || this.ty != y) {
			var paths = App.BattleController.findPath(this.XToMapCellX, this.YToMapCellY, x, y)
			if (paths) {
				Log.warn("新路径长度：", paths.length)
				//需要判断是否耿优解 直接比较长度即可
				if (!this.pathNodes || this.pathNodes.length == 0 || paths.length < this.pathNodes.length) {
					var oldLen = this.pathNodes && this.pathNodes.length || 0
					Log.warn("寻路坐标：", this.XToMapCellX, this.YToMapCellY, x, y)
					this.pathNodes = paths
				} else {
					//将最后一个格子放入当前寻路节点
					var lastNode = paths[paths.length - 1]
					Log.warn("最后一个格子放入路径列表", lastNode)
					this.pathNodes.push(lastNode)
				}
				this.processingPath()
				this.tx = x
				this.ty = y
			} else if (!this.pathNodes || this.pathNodes.length == 0) {
				this.idle()
			}
		}
	}

	/**
	 * @override 移动
	 * 移动的单位必须是按照格子数来 必须移动到格子中心点32*32
	 */
	public move(x: number, y: number): boolean {
		console.warn(this.x, this.y, x, y)
		var dir = GameUtils.getDirection(this.x, this.y, x, y)
		this.changeDir(dir)
		var deltax = Math.abs(this.x - x)
		var deltay = Math.abs(this.y - y)
		let deltat = Math.sqrt(deltax * deltax + deltay * deltay) / this.movespeed
		egret.Tween.removeTweens(this)
		egret.Tween.get(this).to({ x: x, y: y }, deltat * 1000).call(this.moveComplete, this)
		this.isMoving = true
		this.changeAction(ActionType.Move)
		return true
	}

	private moveComplete() {
		//移动结束  继续处理剩余的路径点 直到路径点全部处理完
		if (!this.pathNodes || this.pathNodes.length == 0) {
			this.isMoving = false
		} else {
			this.processingPath()
		}

	}

	/**停止移动
	 *  @todo 
	 */
	public movestop(): boolean {
		this.changeAction(ActionType.Idle)
		return true;
	}
	/**待机移动 
	 *  @todo 
	*/
	public idle(): boolean {
		this.movestop()
		return true;
	}

	/**改变朝向 */
	public changeDir(dir: number) {
		if (this.dir == dir) {
			return
		}
		//Log.info("方向切换:", this.dir)
		this.dir = dir
		//2D游戏改变朝向 需要改变行为动作
		this.updateBodyPart()
	}

	/**受击 
	 * @todo
	*/
	public underAttack(skillId: number, sourceHandle: number) {
		var attacker = EntityManager.instance.getEntity(sourceHandle) as Fighter
		var damage = Formula.damage(attacker, this, skillId)
		var newValue = (this.hp - damage)
		this.setProperty({ hp: newValue })
	}

	private changeAction(actionName: ActionType) {
		if (this.curAction == actionName) {
			return
		}
		//Log.info("状态切换:", actionName)
		this.curAction = actionName
		this.updateBodyPart()
	}
	//更新外观动作
	private updateBodyPart() {
		if (this.bodyModel) {
			var scaleX = DirectionScaleX[this.dir]
			var frameName = ActionTypeName[this.curAction] + DirectionActionName[this.dir]
			this.bodyModel.scaleX = scaleX
			this.playAction(frameName, true)
		}
	}
	//更新模型
	public updateBodyModel(modelId) {
		if (!this.bodyModel) {
			//需要加载的时候再动态创建Group 
			App.ResourceUtils.createGroup(modelId + "", [modelId + "_json", modelId + "_png"])
			this.bodyModel = new AnimationSprite(modelId, -1)
			this.bodyModel.y = 12
			this.addChild(this.bodyModel)
		}
		if (modelId) {
			this.bodyModel.changeAnimation(modelId)
		}
	}

	/**
	 * 播放动作
	*/
	public playAction(frameName, bForce?: boolean) {
		if (this.bodyModel) {
			this.bodyModel.playAction(frameName, bForce)
		}
	}
	//设置目标
	public setTarget(targetId) {
		this.targetId = targetId
	}
	//是否有目标
	public hasTarget(): boolean {
		var entity = this.getTarget()
		return !!entity
	}
	//是否有目标
	public getTarget(): Fighter {
		var entity = EntityManager.instance.getEntity(this.targetId) as Fighter
		return entity
	}
	//返回当前所在的地图格子X坐标
	public get XToMapCellX(): number {
		return Math.floor(this.x / MAP_GRID_SIZE) * MAP_GRID_SIZE + MAP_GRID_SIZE / 2
	}
	//返回当前所在的地图格子Y坐标
	public get YToMapCellY(): number {
		return Math.floor(this.y / MAP_GRID_SIZE) * MAP_GRID_SIZE + MAP_GRID_SIZE / 2
	}

	//追击目标
	public catchTarget() {
		var entity = EntityManager.instance.getEntity(this.targetId) as Fighter
		this.findPath(entity.XToMapCellX, entity.YToMapCellY)
	}

	//追击目标
	public attackTarget() {
		var entity = EntityManager.instance.getEntity(this.targetId) as Fighter
		var skillid = 0
		var handle = this.getId()
		this.changeAction(ActionType.Attack)
		entity.underAttack(skillid, handle)
	}
	/**
	 * 死亡
	 */
	public die() {
		EntityManager.instance.removeEntity(this.getId())
	}
}