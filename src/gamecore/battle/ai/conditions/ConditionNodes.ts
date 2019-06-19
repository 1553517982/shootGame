class ConditionTest implements bt.ICondition {
	private param: any
	public constructor(param) {
		this.param = param
	}

	public execute(input): boolean {
		//Log.info("ConditionTest:", this.param)
		return this.param == "ConditionTest2"
	}

	public clear() { }
}

class ConditionWithoutTarget implements bt.ICondition {
	private param: any
	public constructor(param) {
		this.param = param
	}

	public execute(input): boolean {
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		return !entity.hasTarget()
	}

	public clear() { }
}

class ConditionWithoutEntityType implements bt.ICondition {
	private param: any
	public constructor(param) {
		this.param = param
	}

	public execute(input): boolean {
		var array = EntityManager.instance.getEntitysByType(this.param)
		return (array.length == 0)
	}

	public clear() { }
}

class ConditionTargetDistance implements bt.ICondition {
	private param: any
	public constructor(param) {
		this.param = param
	}

	public execute(input): boolean {
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		var target = entity.getTarget()
		if (target) {
			var disX = Math.abs(entity.XToMapCellX - target.XToMapCellX)
			var disY = Math.abs(entity.YToMapCellY - target.YToMapCellY)
			var param = this.param.split(',')
			switch (param[0]) {
				case "more":
					return (disX + disY > Number(param[1]))
				case "less":
					return (disX + disY < Number(param[1]))
				case "equal":
					return (disX + disY == Number(param[1]))
			}
		}
		return false
	}

	public clear() { }
}

//是否碰到某个类型的对象(跟某类型的对象处于同一个格子时 认为是碰到了 用于吃食物)
class ConditionAttachEntityType implements bt.ICondition {
	private param: any
	public constructor(param) {
		this.param = param
	}

	public execute(input): boolean {
		var entity = EntityManager.instance.getEntity(input.content) as Fighter
		if (!entity) {
			return false
		}
		var targets = EntityManager.instance.getEntitysByType(this.param)
		if (targets) {
			for (var k in targets) {
				var target = targets[k]
				if (target.XToMapCellX == entity.XToMapCellX && target.YToMapCellY == entity.YToMapCellY) {
					return true
				}
			}
		}
		return false
	}

	public clear() { }
}