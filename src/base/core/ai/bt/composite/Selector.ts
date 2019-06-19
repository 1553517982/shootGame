/// <reference path="./Composite.ts" />
/// <reference path="../base/ErrorCode.ts" />
/// <reference path="../BehaviorTree.ts" />

module bt {
	/**
	 * @description 选择器，只要有一个节点返回 success，则返回 success，所有子节点都返回 failure，则返回 failure
	 */
	export class Selector extends bt.Composite implements bt.INode {

		public constructor() {
			super();
			this.name = bt.NodeType.Selector;
		}

		public static create(): bt.Selector {
			return new bt.Selector();
		}

		execute(input: bt.BlackBoard): number {
			let len: number = this.children.length;
			if (len == 0) throw bt.ErrorCode.e1;
			let state = bt.State.failure;
			let data = this.getAndCreateMethod(input);
			for (var idx = data.index; idx < len; idx++) {
				let node = this.children[idx];
				state = node.tick(input);
				if (state == bt.State.success) {
					state = bt.State.success;
					break;
				}
				else if (state == bt.State.running) {
					data.index = idx;
					state = bt.State.running;
					break;
				}
				else {
					node.clearMethod(input);
				}
			}
			if (state != bt.State.running) {
				data.index = 0;
			}
			return state;
		}
	}
}