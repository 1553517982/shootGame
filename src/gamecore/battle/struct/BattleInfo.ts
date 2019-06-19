class BattleInfo extends BaseContainer {
	//对局伪随机种子
	public timeseed: number
	/**关卡地图 */
	private battleMap: RandomMap
	//对局角色列表
	public roles: Entity[]

	public constructor(info) {
		super()
		this.timeseed = info.timeseed
		this.roles = []
		this.initScene(info)
	}

	private initScene(info) {
		if (!this.battleMap) {
			this.battleMap = new RandomMap()
			this.addChild(this.battleMap)
		}
		var self = this
		this.battleMap.init(info.mapId, function () {
			self.createFighters(info.roles)
		})
	}
	/**创建关卡怪物 */
	private createFighters(roles: any) {
		var conf = RES.getRes("robot_json")
		for (var k in roles) {
			var entity = EntityManager.instance.createEntity(conf[roles[k]])
			var pos = this.battleMap.randomPos
			entity.x = pos.x + this.battleMap.cellSize / 2
			entity.y = pos.y + this.battleMap.cellSize / 2
			this.roles.push(entity)
			this.addChild(entity)
		}
	}
	/**关卡寻路 */
	public findPath(posx: number, posy: number, tposx: number, tposy: number): MapGrid[] {
		return this.battleMap.findPath(posx, posy, tposx, tposy)
	}

	/**获取随机可移动坐标 */
	public getValidRandomGrid(randomValue: number): MapGrid {
		return this.battleMap.getValidRandomGrid(randomValue)
	}

	public onTick() {
		for (var k in this.roles) {
			var entity = this.roles[k]
			entity.onTick()
		}
	}

	/**主角死亡时游戏结束 */
	public gameOver() {
		Log.info("主角死亡 游戏结束")
	}
	/**重新开始 */
	public restart() {
		Log.info("重新开始")
	}
}