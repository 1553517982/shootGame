class LoginView extends BaseUI {
	/**登录按钮 */
	private Btn_login: eui.Button
	/**帐号控件 */
	private editext_account: eui.EditableText
	/**帐号控件 */
	private editext_password: eui.EditableText

	protected controller: LoginController

	private bLoginSuccess: boolean

	/**选择的服务器 */
	private selectedServerId: string

	public onCreate() {
		this.controller = new LoginController(this)
		this.Btn_login.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onLogin, this)
		super.onCreate()
	}

	/**点击登录按钮 */
	private onLogin() {
		if (!this.bLoginSuccess) {
			var account = this.editext_account.text
			var password = this.editext_password.text
			this.controller.onLogin(account, password)
		} else {
			/**
			 * @todo 这里是玩家选择的服务器id
			 */
			this.selectedServerId = "1"
			this.controller.onEnterServer(this.selectedServerId)
		}
	}
	/**登录成功回调 */
	public onLoginSuccess(response) {
		console.log(response)
		this.bLoginSuccess = true
	}

	/**进入游戏服 */
	public onEnterServerSuccess() {
		this.close()
	}
}