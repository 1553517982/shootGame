//定义实体相关的枚举

//实体动作类型
enum ActionType {
	//移动
	Move,
	//待机
	Idle,
	//攻击
	Attack,
}

/**动作对应的序列帧名称 */
const ActionTypeName = {
	[ActionType.Move]: "move",
	[ActionType.Idle]: "stand",
	[ActionType.Attack]: "stand",
}

/**实体类型定义 */
enum EntityType {
	//默认
	defaul,
	//主角
	MainPlayer,
	//玩家
	Player,
	//食物
	Food
}

//方向枚举
enum EntityDirection {
	//上
	Up,
	//右上
	RightUp,
	//右
	Right,
	//右下
	RightDown,
	//下
	Down,
	//左下
	LeftDown,
	//左
	Left,
	//左上
	LeftUp
}

/**方向对应的序列帧名称 */
const DirectionActionName = {
	[EntityDirection.Up]: "_up",
	[EntityDirection.RightUp]: "_right_up",
	[EntityDirection.Right]: "_right",
	[EntityDirection.RightDown]: "_right_down",
	[EntityDirection.Down]: "_down",
	[EntityDirection.LeftDown]: "_right_down",
	[EntityDirection.Left]: "_left",
	[EntityDirection.LeftUp]: "_right_up"
}

const DirectionScaleX = {
	[EntityDirection.Up]: 1,
	[EntityDirection.RightUp]: 1,
	[EntityDirection.Right]: 1,
	[EntityDirection.RightDown]: 1,
	[EntityDirection.Down]: 1,
	[EntityDirection.LeftDown]: 1,
	[EntityDirection.Left]: 1,
	[EntityDirection.LeftUp]: 1
}

//地图格子尺寸
const MAP_GRID_SIZE = 32;