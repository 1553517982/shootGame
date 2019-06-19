/// <reference path="../base/ICondition.ts" />

module bt {
	/**
	 * @description 条件集合
	 */
	export class ConditionComposite implements bt.ICondition {
		protected children: bt.ICondition[] = [];

		public constructor() {
		}

		public addCondition(node: bt.ICondition): bt.ConditionComposite {
			this.children.push(node);
			return this;
		}

		execute(input: bt.BlackBoard): boolean {
			return true;
		}

		clear() {
			for (var k in this.children) {
				var child = this.children[k]
				child.clear()
			}
			this.children = []
		}
	}
}