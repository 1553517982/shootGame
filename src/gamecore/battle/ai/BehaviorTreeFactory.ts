class BehaviorTreeFactory {
	/**创建行为树 */
	public static createTree(ownerid, config): bt.BehaviorTree {
		var tree = new bt.BehaviorTree(ownerid)
		tree.root = this.initNodes(config)
		return tree
	}

	/**初始化行为树 */
	public static initNodes(config) {
		//初始化根节点
		var rootType = config.type
		var node = this.createNode(rootType, config.name, config.param)
		if (config.children) {
			for (var key in config.children) {
				var subConfg = config.children[key]
				var child = this.initNodes(subConfg)
				//如果父节点是条件集合  则子节点当做附属条件加入数组
				if (rootType == bt.NodeType.ConditionSequences
					|| rootType == bt.NodeType.ConditionSelector) {
					node.addCondition(child)
				} else {
					switch (subConfg.type) {
						case bt.NodeType.Condition:
						case bt.NodeType.ConditionDecorator:
						case bt.NodeType.ConditionInverter:
						case bt.NodeType.ConditionSelector:
						case bt.NodeType.ConditionSequences:
							node.setCondition(child)
							break
						default:
							node.addNote(child)
					}
				}
			}
		}
		return node
	}

	public static createNode(nodeType: string, nodeName?: string, param?: any): any {
		switch (nodeType) {
			case bt.NodeType.Inverter:
				return new bt.Inverter();
			case bt.NodeType.Queue:
				return new bt.Queue();
			case bt.NodeType.Repeater:
				return new bt.Repeater();
			case bt.NodeType.RepeatUntilFail:
				return new bt.RepeatUntilFail();
			case bt.NodeType.RepeatUntilSuccess:
				return new bt.RepeatUntilSuccess();
			case bt.NodeType.Selector:
				return new bt.Selector();
			case bt.NodeType.Succeeder:
				return new bt.Succeeder();
			case bt.NodeType.Sequence:
				return new bt.Sequences();
			case bt.NodeType.ConditionDecorator:
				return new bt.ConditionDecorator();
			case bt.NodeType.ConditionInverter:
				return new bt.ConditionInverter();
			case bt.NodeType.ConditionSelector:
				return new bt.ConditionSelector();
			case bt.NodeType.ConditionSequences:
				return new bt.ConditionSequences();
		}
		if (nodeName) {
			var className = egret.getDefinitionByName(nodeName)
			return new className(param)
		}
	}
}