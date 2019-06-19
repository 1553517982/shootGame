/// <reference path="../base/ICondition.ts" />
module bt {

	export class ConditionDecorator implements bt.ICondition {
		public child: bt.ICondition;

		public constructor() {
		}

		public execute(input: bt.BlackBoard): boolean {
			return true;
		}

		public setChild(child: bt.ICondition): bt.ICondition {
			this.child = child;
			return this;
		}

		public clear() {
			this.child.clear()
			this.child = null
		}
	}
}