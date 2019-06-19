//玩家
class Hero extends Player {
	public constructor(property) {
		super(property)
		// var rect = new egret.Shape()
		// rect.width = 32
		// rect.height = 48
		// rect.graphics.beginFill(0xff00ff, 0.5)
		// rect.graphics.drawRect(-16, -48, 32, 48)
		// rect.graphics.endFill()
		// this.addChild(rect)
	}

	//主角死亡需要做处理
	public die() {
		super.die()
	}
	/** */
	public dirMove(dir: EntityDirection) {
		var curGridX = this.XToMapCellX
		var curGridY = this.YToMapCellY
		var targetGridX = null
		var targetGridY = null
		switch (dir) {
			case EntityDirection.Left:
				targetGridX = curGridX - MAP_GRID_SIZE
				targetGridY = curGridY;
				break;
			case EntityDirection.Right:
				targetGridX = curGridX + MAP_GRID_SIZE
				targetGridY = curGridY;
				break;
			case EntityDirection.Up:
				targetGridX = curGridX
				targetGridY = curGridY + MAP_GRID_SIZE;
				break;
			case EntityDirection.Down:
				targetGridX = curGridX
				targetGridY = curGridY - MAP_GRID_SIZE;
				break;
		}
		if (this.isMoving == false) {
			this.findPath(targetGridX, targetGridY)
		}
	}
}