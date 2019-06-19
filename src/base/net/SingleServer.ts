class SingleServer {
	private routCallback: any

	public constructor() {
		this.routCallback = {}
	}

	public on(rout: string, callback) {
		this.routCallback[rout] = callback
	}

	public off(rout: string) {
		delete this.routCallback[rout]
	}

	public response(rout: string, param: any, callback) {

	}
}