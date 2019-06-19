module bt {
	export const version: string = '1.1.0';
	export const enum State {
		success,
		failure,
		running
	}

	export const NodeType = {
		Action: 'Action',

		Condition: 'Condition',
		ConditionSelector: 'ConditionSelector',
		ConditionSequences: 'ConditionSequences',
		ConditionInverter: 'ConditionInverter',
		ConditionDecorator: 'ConditionDecorator',

		Sequence: 'Sequences',
		Queue: 'Queue',
		Selector: 'Selector',

		Inverter: 'Inverter',
		Repeater: 'Repeater',
		RepeatUntilFail: 'RepeatUntilFail',
		RepeatUntilSuccess: 'RepeatUntilSuccess',
		Succeeder: 'Succeeder'
	}

	export class BehaviorTree {
		//根节点
		public root: any;
		/**黑板 */
		private blackBoard: bt.BlackBoard

		public constructor(ownerid) {
			this.blackBoard = bt.BlackBoard.create()
			this.blackBoard.content = ownerid
		}

		//tick
		public onTick() {
			if (this.root) {
				this.root.tick(this.blackBoard)
			}
		}

		/**清理操作 */
		public clear() {
			this.blackBoard.clear()
			this.root.clear()
			this.blackBoard = null
			this.root = null
		}
	}

}