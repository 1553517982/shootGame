class LoginManager extends Manager {
	private static $instance: LoginManager
	public static get instance(): LoginManager {
		if (!this.$instance) {
			this.$instance = new LoginManager()
		}
		return this.$instance
	}

	public onLoginSuccess(account: string, password: string) {
		var response = {
			account: account,
			password: password,
			lastServerId: "1",
			recommandServerId: "1",
			createTime: "1554121810",
			serverlist: {
				"1": {
					ip: "127.0.0.1",
					port: "3010",
					state: "good",
					name: "测试服"
				}
			}
		}
		App.EventSystem.dispatch(GameEvent.E_ACCOUNT_LOGIN, response)
	}

	/**
	 * 进入服务器成功
	 */
	public onEnterServerSuccess(serverid: string) {
		App.EventSystem.dispatch(GameEvent.E_ENTER_SERVER, serverid)
	}
}