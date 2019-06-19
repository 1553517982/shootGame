class GameWorld {
	//游戏世界单例
	private static _instance: GameWorld;
	//记录上一个游戏状态
	private _preGameState: GameStateDef
	//场景容器
	private _sceneRootLayer: BaseContainer;
	private _sceneObjMap: any

	public constructor() {
		this._sceneObjMap = {}
	}

	public static get instance(): GameWorld {
		if (!this._instance) {
			this._instance = new GameWorld()
		}
		return this._instance;
	}
	//开始游戏
	public start(stage: egret.Stage) {
		/**初始化游戏层级 */
		this.initLayer(stage)
		/**设置游戏状态为登录 */
		App.GSManager.setState(GameStateDef.Login)
	}

	/**
	 * 切换场景容器
	 */
	public switchScene(gameState: GameStateDef) {
		if (this._preGameState && this._preGameState != gameState) {
			let preScene = this.getScene(gameState)
			if (preScene) {
				preScene.onExit()
			}
		}

		let scene = this.getScene(gameState)
		if (scene) {
			let zOrder = 0;
			for (var k in this._sceneObjMap) {
				if (Number(k) != gameState) {
					this._sceneRootLayer.setChildIndex(scene, zOrder)
				}
				zOrder++
			}
			this._sceneRootLayer.setChildIndex(scene, zOrder)
			scene.onEnter()
		}
	}

	/**获取场景 */
	public getScene(gameState: GameStateDef): Scene {
		if (!this._sceneObjMap[gameState]) {
			if (gameState == GameStateDef.Gaming) {
				//游戏场景
				this.addScene(GameStateDef.Gaming, new GameScene())
			}
			else if (gameState == GameStateDef.Login) {
				//登录场景
				this.addScene(GameStateDef.Login, new LoginScene())
			}
			else if (gameState == GameStateDef.Loading) {
				//加载场景
				this.addScene(GameStateDef.Loading, new LoadingScene())
			}
		}
		return this._sceneObjMap[gameState]
	}

	private addScene(sceneDef: GameStateDef, scene: Scene) {
		scene.width = this._sceneRootLayer.width
		scene.height = this._sceneRootLayer.height
		this._sceneRootLayer.addChild(scene)
		this._sceneObjMap[sceneDef] = scene
	}

	/**初始化层级组件 */
	private initLayer(stage: egret.Stage) {
		/**游戏场景 */
		this._sceneRootLayer = new BaseContainer()
		this._sceneRootLayer.width = stage.width
		this._sceneRootLayer.height = stage.height
		stage.addChild(this._sceneRootLayer)
		/**UI容器 */
		App.UIManager.init(stage)
	}
}