/// <reference path="./Composite.ts" />
/// <reference path="../base/ErrorCode.ts" />
/// <reference path="../BehaviorTree.ts" />

module bt {
	/**
	 * @description 序列执行，所有节点返回 success，才返回 success，否则返回 failure
	 */
	export class Sequences extends bt.Composite implements bt.INode {

		public constructor() {
			super();
			this.name = bt.NodeType.Sequence;
		}

		public static create(): bt.Sequences {
			return new bt.Sequences();
		}

		execute(input: bt.BlackBoard): number {
			let len: number = this.children.length;
			if (len == 0) throw bt.ErrorCode.e1;
			let state = bt.State.success;
			let data = this.getAndCreateMethod(input);
			for (var idx = data.index; idx < len; idx++) {
				let node = this.children[idx];
				state = node.tick(input);
				if (state == bt.State.running) {
					data.index = idx;
					state = bt.State.running;
					break;
				}
				if (state == bt.State.failure) {
					node.clearMethod(input);
					break;
				}
			}
			if (state != bt.State.running) {
				data.index = 0;
			}
			return state;
		}
	}
}