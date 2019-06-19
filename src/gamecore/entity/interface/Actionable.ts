/**行为动作接口 */
interface Moveable {
	/**移动 */
	move(x: number, y: number): boolean;
	/**停止移动 */
	movestop(): boolean
	/** 待机*/
	idle(): boolean
}


interface Fighteable {
	/**hp */
	hp: number;
	/**maxhp */
	maxhp: number;
	/**攻击力 */
	atk: number;
	/**防御力 */
	def: number;
	/**攻击 */
	attackTarget()
	/**受击 */
	underAttack(skillId: number, sourceHandle: number)
}