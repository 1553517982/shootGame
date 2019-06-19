//移动命令
class MoveCommand extends BaseCommand implements ICommand {
	//命令id 防止重复包
	commandid: number
	//命令时间戳 防止广播过期包
	commandtimestamp: number
	//命令类型
	commandtype: CommandType
	/**命令参数*/
	//主人
	ownerid: number
	//朝向
	dir: number

	public constructor(param: any) {
		super(param)
		this.commandtype = CommandType.Idle
	}

	/**执行攻击 */
	public excute() {

	}
}