/**
 * 播放特效控件
 */
class AnimationSprite extends egret.MovieClip {
	/**当前特效名称 */
	private actionName: string
	/**当前特效动作 */
	private curFrameName: string
	/**循环次数 默认为-1 无限循环*/
	private loopTimes: number
	/**是否已加载完毕 */
	private bLoaded: boolean
	/**是否已经开始加载 */
	private isLoading: boolean

	/**
	 * @param animationName 动画名称
	 * @param loop 循环次数
	 */
	public constructor(animationName: string, loop?: number) {
		super()
		this.actionName = animationName
		this.loopTimes = loop || -1
		this.bLoaded = false
		this.isLoading = false
		this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemove, this)
	}

	/**
	 * 加载完毕
	 */
	private onLoaded(groupName: string) {
		Log.info("资源加载完毕:", groupName)
		this.isLoading = false
		this.bLoaded = true
		if (this.curFrameName) {
			this.playAction(this.curFrameName, true)
		}
	}
	/**播放完毕 */
	private onEnd() {

	}
	/**切换特效 */
	public changeAnimation(animationName: string) {
		this.actionName = animationName
		this.bLoaded = false
		this.isLoading = false
		if (this.curFrameName) {
			this.playAction(this.curFrameName, true)
		}
	}


	/**从父节点移除 */
	private onRemove() {
		this.bLoaded = false
		this.isLoading = false
	}
	/**设置特效动作 */
	public playAction(name: string, forcePlay?: boolean) {
		if (this.isPlaying && this.curFrameName == name && !forcePlay) {
			return
		}
		this.curFrameName = name
		if (this.bLoaded) {
			//如果是切换其他动画 则需要先停止当前的
			if (this.isPlaying) {
				this.stop()
			}
			var mcFactory = ObjectPool.getMovieClipFactory(this.actionName)
			this.movieClipData = mcFactory.generateMovieClipData(this.actionName);
			super.gotoAndPlay(this.curFrameName, this.loopTimes)
		} else if (!this.isLoading) {
			//如果还没开始加载  则先加载
			this.isLoading = true
			App.ResourceUtils.loadGroup(this.actionName, this.onLoaded, null, this)
		}
	}
}