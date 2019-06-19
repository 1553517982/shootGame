class NetCenter {
	private static pomelo: PomeloForEgret.Pomelo = new PomeloForEgret.Pomelo();

	private static server: any = null;

	private static connected: boolean = false;

	private static isdebug: boolean = false;

	private static singleServer: SingleServer
	/**
	 * 请求连接服务器
	 * @param host 地址
	 * @param port 端口
	 * @param callback
	 */
	public static connectServer(host: string, port: number, callback: Function): void {
		this.server = { host: host, port: port };
		let self = this;
		this.pomelo.init(this.server, function () {
			self.connected = true;

			self.pomelo.on(PomeloForEgret.Pomelo.EVENT_CLOSE, function () {
				self.onConnectionClose.bind(self)();
			});

			if (!!callback) {
				callback();
			}
		});
	}

	public static registSingleServer(server: SingleServer) {
		this.singleServer = server
	}

	/**
	 * 断开连接
	 */
	public static disconnect(): void {
		this.pomelo.disconnect();
	}

	private static onConnectionClose(): void {
		egret.log('服务器已断开');
		this.connected = false;
	}

	public static isConnected(): boolean {
		return this.connected;
	}

	public static request(route: string, msg: any, callback: any): void {
		if (this.singleServer) {
			this.singleServer.response(route, msg, callback)
			return
		}
		this.pomelo.request(route, msg, callback);
	}

	public static on(route: string, callback: any): void {
		if (this.singleServer) {
			this.singleServer.on(route, callback)
			return
		}
		this.pomelo.on(route, callback);
	}

	public static off(route: string): void {
		if (this.singleServer) {
			this.singleServer.off(route)
			return
		}
		this.pomelo.off(route);
	}
}