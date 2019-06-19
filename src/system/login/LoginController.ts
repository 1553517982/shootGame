class LoginController extends ViewController {
	/**服务器列表 */
	private serverList: any
	/**账号信息 */
	private accountInfo: any

	//绑定事件 全部写在这里
	public onCreate(viewName: string) {
		this.bindGameEvent(GameEvent.E_ACCOUNT_LOGIN, this.onLoginSuccess, this, viewName)
		this.bindGameEvent(GameEvent.E_ENTER_SERVER, this.onEnterServerSuccess, this, viewName)
		//this.bindGameEvent(GameEvent.E_SOCKET_CONNECT, this.onConnectServer, this)
	}

	/**点击登陆按钮 */
	public onLogin(account: string, password: string) {
		/**
		 * @todo 后台通信 获取游戏内帐号信息 
		 */
		LoginManager.instance.onLoginSuccess(account, password)
	}

	/**
	 * 进入服务器
	 */
	public onEnterServer(serverId: string) {
		// 1.连接服务器
		this.connectServer(serverId)
	}

	/**连接服务器成功 */
	private onConnectServer(serverId: string) {
		console.log("服务器连接成功！")
		//发送登录帐号协议
		let self = this
		NetCenter.request(MessageRoute.CONNECTOR.ENTRY, {
			// account: this.accountInfo.account,
			// password: this.accountInfo.password,
			account: 10000,
			password: 123456,
		}, (response) => {
			this.userInfoResponse(response)
		})
	}

	/**请求角色信息 */
	private userInfoResponse(response) {
		if (response.code == MessageRoute.CODE.OK) {
			if (!response.player) {
				this.createNewRole()
			} else {
				console.log("请求角色信息:", response)
				this.enterScene()
			}
		} else if (response.reason == 'user not exist') {
			this.createNewRole()
		}
	}

	private createNewRole() {
		NetCenter.request(MessageRoute.CONNECTOR.CREATEROLE, {
			name: "test1",
			roleId: 201,
		}, (response) => {
			this.createRoleResponse(response)
		})
	}

	/**创建角色返回 */
	private createRoleResponse(response) {
		this.enterScene()
	}

	/**进入游戏 */
	private enterScene() {
		NetCenter.request(MessageRoute.CONNECTOR.ENTER_SCENE, {}, (response) => {
			console.log("进入场景:", response)
			App.GSManager.setState(GameStateDef.Gaming)
		})
	}

	/**
	 * 连接服务器
	 * @param serverId 服务器id
	 */
	private connectServer(serverId: string) {
		var server = this.serverList[serverId]
		let self = this
		NetCenter.connectServer(server.ip, server.port, function () {
			self.onConnectServer(serverId)
		})
	}

	/**进入服务器成功 
	 * @param roleInfo  服务器角色信息  如果没有角色 需要走创角流程
	*/
	public onEnterServerSuccess(roleInfo: any) {
		//this.view.onEnterServerSuccess(serverId)
		//App.GSManager.setState(GameStateDef.Gaming)
	}

	/**处理登陆回调 */
	private onLoginSuccess(response: any) {
		this.accountInfo = {}
		this.accountInfo.account = response.account
		this.accountInfo.password = response.password
		this.accountInfo.lastServerId = response.lastServerId
		this.setServerList(response.serverlist)
		this.view.onLoginSuccess(response)
	}

	/**设置服务器列表 */
	private setServerList(list) {
		this.serverList = list
	}
}