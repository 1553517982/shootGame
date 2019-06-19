/// <reference path="../BlackBoard.ts" />

module bt {
	/**
	 * @description 条件接口
	 */
	export interface ICondition {
		execute(input: bt.BlackBoard): boolean;
		clear(): void;
	}
}