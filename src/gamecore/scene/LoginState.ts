//登录状态
class LoginState implements GameState {
	public onEnter() {
		console.log("进入登录状态")
		App.UIManager.showUI("LoginView")
		GameWorld.instance.switchScene(GameStateDef.Login)
	}

	public onExit() {
		App.UIManager.hideUI("LoginView")
		console.log("离开登录状态")
	}
}