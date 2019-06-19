/**
 *  游戏状态管理类
 * 
*/

enum GameStateDef {
    //加载
    Loading,
    //登录
    Login,
    //游戏中
    Gaming
}

interface GameState {
    //进入状态
    onEnter();
    //离开状态
    onExit();
}

class GameStateManager extends Manager {
    private _gameStateType: GameStateDef

    private _currentGameState: GameState

    private _gameStateMap: any

    public constructor() {
        super()
        this._gameStateMap = {}
    }

    private static $instance: GameStateManager;

    public static get instance(): GameStateManager {
        if (this.$instance == null) {
            this.$instance = new GameStateManager();
        }
        return this.$instance;
    }


    public setState(state: GameStateDef) {
        if (this._gameStateType != state) {
            this._gameStateType = state;
            this.changeState(state)
        }
    }

    public get state(): GameStateDef {
        return this._gameStateType
    }

    private changeState(state: GameStateDef) {
        if (this._currentGameState) {
            this._currentGameState.onExit()
        }
        this._currentGameState = this.getGameState(state)
        if (this._currentGameState) {
            this._currentGameState.onEnter()
        }
    }
    //根据状态类型 获取游戏状态对象
    private getGameState(state: GameStateDef): GameState {
        if (this._gameStateMap[state]) {
            return this._gameStateMap[state]
        }
        let nState = null
        switch (state) {
            case GameStateDef.Login:
                nState = new LoginState();
                break
            case GameStateDef.Gaming:
                nState = new GamingState();
                break
        }
        this._gameStateMap[state] = nState;
        return nState
    }
}