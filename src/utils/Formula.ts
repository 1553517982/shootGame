class Formula {
	/**
	 * 伤害计算
	 */
	static damage(source: Fighter, target: Fighter, skillId: number): number {
		return (source.atk || 0) - (target.def || 0)
	}
}