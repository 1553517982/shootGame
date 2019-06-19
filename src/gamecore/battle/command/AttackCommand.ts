//攻击命令
class AttackCommand extends BaseCommand implements ICommand {
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
	//技能id
	skillid: number

	public constructor(param: any) {
		super(param)
		this.commandtype = CommandType.Attack
	}

	/**执行攻击 */
	public excute() {

	}
}