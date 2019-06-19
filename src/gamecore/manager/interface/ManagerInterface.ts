interface ManagerInterface {
	/**初始化 */
	init();
	/**重置 */
	reset();
	/**清理 */
	finit();
}


class Manager extends GameComponent implements ManagerInterface {
	public constructor() {
		super()
	}

	/**初始化 */
	public init() {

	}

	/**清理 */
	public finit() {

	}
	/**重置 */
	public reset() {

	}
}