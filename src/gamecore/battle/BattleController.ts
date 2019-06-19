//对局对象
class BattleController extends SingtonClass {
	/**战斗定时器 */
	private battleTimer: number
	/**随机数种子 */
	private seed: number;
	/**记录当前生成的客户端命令 */
	private commands: ICommand[]
	/**记录处理服务器返回的命令 */
	private performCommands: ICommand[]
	/**当前对局 */
	private curBattle: BattleInfo
	/**是否单机模式 */
	private bLocal: boolean

	public constructor() {
		super()
	}

	/**战斗环境初始化 */
	public initEnv(battleInfo: BattleInfo) {
		this.curBattle = battleInfo
		this.seed = battleInfo.timeseed;
		this.commands = []
		this.performCommands = []
		//重置定时器
		this.startUpdateTimer()
		NetCenter.on(MessageRoute.BATTLE.ONCOMMANDS, function (ret) {
			this.excuteCommands(ret)
		})
	}
	/**初始化对战信息 */
	public initialize(battleCfg: any): BattleInfo {
		var battleInfo = new BattleInfo(battleCfg)
		//是否是单机模式
		this.bLocal = battleCfg.local;
		this.initEnv(battleInfo)
		return battleInfo
	}

	/**
	 * 获取战斗随机数
	 */
	public getRandom(max?: number, min?: number): number {
		max = max || 1
		min = min || 0
		//线性同余 制造伪随机数
		this.seed = (this.seed * 9301 + 49297) % 233280
		var rnd = this.seed / 233280
		return min + rnd * Math.abs(max - min)
	}

	/**添加命令 */
	public addCommand(command: ICommand) {
		//如果是单机 直接执行命令
		if (this.bLocal) {
			command.excute()
		} else {
			this.commands.push(command)
		}
	}

	/**向服务器同步命令 */
	public synCommand() {
		//
		NetCenter.request(MessageRoute.BATTLE.SEND_COMMANDS, this.commands, function (response) {
			console.warn("发送命令返回")
		})
		//清空当前队列
		this.commands.length = 0
	}

	/**执行服务器返回的命令 */
	public excuteCommands(commands: ICommand[]) {
		if (commands && commands.length > 0) {
			for (var k in commands) {
				commands[k].excute()
				this.performCommands.push(commands[k])
			}
		}
	}

	/**战斗定时器 刷新战斗对象 */
	private startUpdateTimer() {
		if (!this.battleTimer) {
			let self = this
			this.battleTimer = setInterval(function () {
				self.onTick()
			}, 50)
		}
	}

	private onTick() {
		//0.05秒向服务器同步一次命令
		this.synCommand()
		this.curBattle.onTick()
	}

	public finish() {
		NetCenter.off(MessageRoute.BATTLE.ONCOMMANDS)
		EntityManager.instance.clear()
	}

	/**获取寻路路径 */
	public findPath(posx: number, posy: number, tposx: number, tposy: number): MapGrid[] {
		var pathnodes = this.curBattle.findPath(posx, posy, tposx, tposy)
		if (pathnodes) {
			pathnodes.shift()
		}
		return pathnodes
	}

	/**获取随机可移动格子 */
	public getValidRandomGrid(): MapGrid {
		var randomValue = this.getRandom()
		return this.curBattle.getValidRandomGrid(randomValue)
	}
}