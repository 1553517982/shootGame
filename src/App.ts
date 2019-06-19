/**定义全局单例管理器 */

class App {
	/**全局事件管理器 */
	public static get EventSystem(): GameEventSystem {
		return GameEventSystem.instance;
	}
	/**全局状态管理器 */
	public static get GSManager(): GameStateManager {
		return GameStateManager.instance
	}
	/**全局窗口管理器 */
	public static get UIManager(): UIManager {
		return UIManager.instance
	}
	/**全局资源管理器 */
	public static get ResourceUtils(): ResourceUtils {
		return ResourceUtils.instance()
	}
	/**战斗管理 */
	public static get BattleController(): BattleController {
		return BattleController.instance()
	}
	/**DEBUG */
	public static get DebugUtils(): DebugUtils {
		return DebugUtils.instance()
	}

}