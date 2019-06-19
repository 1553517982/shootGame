//玩家
class Player extends Fighter {
	public constructor(property) {
		super(property)
	}

	/**************************************************** 
	 * 						属性变化
	 ****************************************************
	*/
	/**注册属性监听 
	 * @override
	*/
	public registPropCallback() {
		super.registPropCallback()
		this.propCallFunc["hp"] = this.onHpChanged.bind(this)
		this.propCallFunc["bodyId"] = this.onBodyChanged.bind(this)
	}
	/**血量变化 */
	public onHpChanged(oldValue, newValue) {
		if (newValue <= 0) {
			this.hp == 0
			this.die()
		}
		Log.info("当前血量：", this.hp)
	}

	/**外观变化 */
	public onBodyChanged(oldValue, newValue) {
		this.updateBodyModel(newValue)
	}
}