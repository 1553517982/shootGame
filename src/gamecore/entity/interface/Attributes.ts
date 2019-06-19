/**基础属性 */
interface AttributesInterface {
	/**名字 */
	name: string
	/**类型 */
	type: EntityType
	/**等级 */
	level: number
	/**外观类型 (静态外观 或 动态外观)*/
	bodyType: number
	/**外观 */
	bodyId: number
	/**x坐标 */
	cellx: number
	/**y坐标 */
	celly: number
	/**朝向 */
	dir: number
	/**移速 */
	speed: number
	//增益属性
	/**移速增益或减益 */
	speedPromotPer: number
	/**攻速增益或减益 */
	attackSpeedPromotPer: number
	/**防御增益或减益 */
	defPromotPer: number
	/**攻击增益或减益 */
	atkPromotPer: number
	
}
