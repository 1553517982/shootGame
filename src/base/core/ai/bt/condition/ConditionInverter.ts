/// <reference path="../base/ICondition.ts" />
/// <reference path="./ConditionDecorator.ts" />

module bt{
	/**
	 * @description 反转结果
	 */
	export class ConditionInverter extends bt.ConditionDecorator {

		public constructor() {
			super();
		}

		public static create():bt.ConditionInverter {
			return new bt.ConditionInverter();
		}

		public execute( input:bt.BlackBoard ):boolean {
			if ( this.child ) {
				return !this.child.execute( input );
			}
			return true;
		}
	}
}