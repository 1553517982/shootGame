class ActionTest extends bt.BaseNode {
	private param: any
	public constructor(param) {
		super()
		this.param = param
	}

	public execute(input: bt.BlackBoard) {
		//Log.info("ActionTest:", this.param)
		return bt.State.success;
	}
}
//巡逻
class ActionMoveRandom extends bt.BaseNode {
	private param: any
	public constructor(param) {
		super()
		this.param = param
	}

	public execute(input: bt.BlackBoard) {
		//Log.info("ActionMoveRandom:", this.param)
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		if (entity.isMoving) {
			return bt.State.running;
		}
		var grid = App.BattleController.getValidRandomGrid()
		if (grid) {
			entity.findPath(grid.x, grid.y)
		}
		return bt.State.success;
	}
}

//追击 
class ActionCatch extends bt.BaseNode {
	private param: any
	public constructor(param) {
		super()
		this.param = param
	}

	public execute(input: bt.BlackBoard) {
		//Log.info("ActionMoveRandom:", this.param)
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		if (!entity.hasTarget()) {
			return bt.State.failure;
		}

		var target = entity.getTarget()
		var paths = App.BattleController.findPath(entity.XToMapCellX, entity.YToMapCellY, target.x, target.y)
		entity.findPath(target.XToMapCellX, target.YToMapCellY)
		return bt.State.success;
	}
}

//寻找目标
class ActionSearch extends bt.BaseNode {
	private param: any
	public constructor(param) {
		super()
		this.param = param
	}

	public execute(input: bt.BlackBoard) {
		//Log.info("ActionMoveRandom:", this.param)
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		var targets = EntityManager.instance.getEntitysByType(this.param)
		var minLength = null
		var targetId = null
		for (var k in targets) {
			var paths = App.BattleController.findPath(entity.XToMapCellX, entity.YToMapCellY, targets[k].XToMapCellX, targets[k].YToMapCellY)
			if (paths && paths.length > 0 && (minLength == null || minLength > paths.length)) {
				minLength = paths.length
				targetId = targets[k].getId()
			}
		}
		if (targetId) {
			entity.setTarget(targetId)
			return bt.State.success;
		}
		return bt.State.failure;
	}
}

//攻击目标
class ActionAttack extends bt.BaseNode {
	private param: any
	public constructor(param) {
		super()
		this.param = param
	}

	public execute(input: bt.BlackBoard) {
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		entity.attackTarget()
		return bt.State.success;
	}
}

//死亡
class ActionDie extends bt.BaseNode {
	private param: any
	public constructor(param) {
		super()
		this.param = param
	}

	public execute(input: bt.BlackBoard) {
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		entity.die()
		return bt.State.success;
	}
}