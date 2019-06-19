/// <reference path="./Decorator.ts" />
/// <reference path="../base/ErrorCode.ts" />

module bt {
	/**
	 * @description 重复执行子节点，执行完毕后返回 success，否则返回 running
	 */
	export class Repeater extends bt.Decorator implements bt.INode {
		public count: number = 1;

		public constructor() {
			super();
			this.name = bt.NodeType.Repeater;
		}

		public static create(count?: number): bt.Repeater {
			let unit = new bt.Repeater();
			unit.count = Math.max(1, count || 1);
			return unit;
		}

		execute(input: bt.BlackBoard): number {
			if (!this.child) throw bt.ErrorCode.e1;
			let state = this.child.tick(input);
			if (state == bt.State.running) {
				return bt.State.running;
			}
			let data = this.getAndCreateMethod(input);
			data.curCount++;
			if (data.curCount >= this.count) {
				data.curCount = 0;
				return bt.State.success;
			}
			return bt.State.running;
		}

		protected getAndCreateMethod(input: bt.BlackBoard): any {
			if (input.btMethod[this.hashid]) {
				return input.btMethod[this.hashid];
			}
			else {
				let data = { curCount: 0 };
				if (!input) return data;
				input.btMethod[this.hashid] = data;
				return input.btMethod[this.hashid];
			}
		}
	}
}