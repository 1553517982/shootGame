/// <reference path="./Decorator.ts" />
/// <reference path="../base/ErrorCode.ts" />

module bt {
	/**
	 * @description 重复执行，直到子节点返回失败为止，才返回成功
	 */
	export class RepeatUntilFail extends bt.Decorator implements bt.INode {

		public constructor() {
			super();
			this.name = bt.NodeType.RepeatUntilFail;
		}

		public static create():bt.RepeatUntilFail {
			return new bt.RepeatUntilFail();
		}

		execute( input:bt.BlackBoard ):number {
			if ( !this.child )throw bt.ErrorCode.e1;
			let state = this.child.tick( input );
			if ( state == bt.State.running ) {
				return bt.State.running;
			}
			if ( state == bt.State.failure ) {
				return bt.State.success;
			}
			return bt.State.running;
		}

	}
}