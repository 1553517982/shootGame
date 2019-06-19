class JoyStick extends BaseContainer {
	//摇杆背景
	private circlebg: egret.Shape
	//摇杆
	private circleCenter: egret.Shape

	public constructor(radius: number, opacity: number) {
		super()
		this.circlebg = new egret.Shape()
		this.circlebg.graphics.beginFill(0x0f00f0, opacity)
		this.circlebg.graphics.drawCircle(0, 0, radius)
		this.circlebg.graphics.endFill()
		this.addChild(this.circlebg)

		this.circleCenter = new egret.Shape()
		this.circleCenter.graphics.beginFill(0x00efe0, opacity)
		this.circleCenter.graphics.drawCircle(0, 0, radius / 2)
		this.circleCenter.graphics.endFill()
		this.addChild(this.circleCenter)

		this.touchEnabled = true
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
		this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
		this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
		this.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this)
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this)
	}

	public destructor() {
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this)
		this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this)
		this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this)
		this.removeEventListener(egret.TouchEvent.TOUCH_CANCEL, this.onTouchEnd, this)
		this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this)
	}
	//记录上一次tick的时间戳
	private preTick: number
	private onTick(dt: number): boolean {
		//if (!this.preTick || dt - this.preTick > 100) {
		this.caculateMoveCommand()
		//	this.preTick = dt
		//}
		return true
	}

	private onTouchBegin(event: egret.TouchEvent) {
		this.circleCenter.x = event.localX
		this.circleCenter.y = event.localY
		//Log.info(event.localX, event.localY)
		//同时启动定时器
		egret.startTick(this.onTick, this)
	}

	private onTouchMove(event: egret.TouchEvent) {
		this.circleCenter.x = event.localX
		this.circleCenter.y = event.localY
		//Log.info(event.localX, event.localY)
	}

	private onTouchEnd(event: egret.TouchEvent) {
		this.circleCenter.x = 0
		this.circleCenter.y = 0
		//Log.info(event.localX, event.localY)
		egret.stopTick(this.onTick, this)
	}
	//计算移动命令
	private caculateMoveCommand() {
		var touchX = this.circleCenter.x
		var touchY = this.circleCenter.y
		//暂时只有四方向
		var dir = null
		if (touchX > 0 && Math.abs(touchY) < touchX) {
			dir = EntityDirection.Right
		} else if (touchX < 0 && Math.abs(touchY) < Math.abs(touchX)) {
			dir = EntityDirection.Left
		} else if (touchY < 0 && Math.abs(touchY) > Math.abs(touchX)) {
			dir = EntityDirection.Down
		} else if (touchY > 0 && touchY > Math.abs(touchX)) {
			dir = EntityDirection.Up
		}
		if (dir != null && EntityManager.instance.hero) {
			EntityManager.instance.hero.dirMove(dir)
		}
	}
}