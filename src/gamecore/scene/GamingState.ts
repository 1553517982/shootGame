//游戏状态
class GamingState implements GameState {
	public onEnter() {
		console.log("进入游戏状态")
		GameWorld.instance.switchScene(GameStateDef.Gaming)
	}

	public onExit() {
		console.log("离开游戏状态")
	}
}