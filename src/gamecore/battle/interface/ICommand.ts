/**
 * 命令类型 
*/
enum CommandType {
	//待机
	Idle,
	//移动
	Move,
	//攻击
	Attack,
	//改变朝向
	ChangeDir
}

/**
 * 命令接口
 * 为了方便定义proto 把所有战斗需要的参数都定义出来 然后非必须的用option标记
 */
interface ICommand {
	//命令id 防止重复包
	commandid: number
	//命令时间戳 防止广播过期包
	commandtimestamp: number
	//命令类型
	commandtype: CommandType
	/**命令参数*/
	//主人
	ownerid: number
	//执行命令
	excute();
}

class BaseCommand implements ICommand {
	//命令id 防止重复包
	commandid: number
	//命令时间戳 防止广播过期包
	commandtimestamp: number
	//命令类型
	commandtype: CommandType
	/**命令参数*/
	//主人
	ownerid: number

	public constructor(param: any) {
		for (var key in param) {
			this[key] = param[key]
		}
	}
	
	/**执行攻击 */
	public excute() {

	}
}