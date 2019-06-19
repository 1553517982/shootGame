/**事件id生成器 */
var generateID: number = 0

function generateId(): number {
	generateID = generateID + 1;
	return generateID
}


/**全局枚举定义 */




/**游戏内事件 */
enum GameEvent {
	default,
	/**Socket已经连接上*/
	E_SOCKET_CONNECT,
	/**Socket重新连接上*/
	E_SOCKET_RECONNECT,
	/**Socket开始重新连接上*/
	E_SOCKET_START_RECONNECT,
	/**Socket已关闭*/
	E_SOCKET_CLOSE,
	/*socket收到消息*/
	E_SOCKET_DATA,
	/**Socket不能连接上*/
	E_SOCKET_NOCONNECT,
	/**Socketdebug的消息*/
	E_SOCKET_DEBUG_INFO,
	/**帐号登录成功*/
	E_ACCOUNT_LOGIN,
	/**进入服务器成功*/
	E_ENTER_SERVER,

}
