class AStar {
	/**最大预估消耗 */
	private static MAX_FIND_COST: number = 9999999999999

	//两点之间的距离
	public static dist_betweenSqrt(nodeA: MapGrid, nodeB: MapGrid) {
		//都是可达到节点时才需要计算  否则直接返回极大值
		if (nodeA.attainable && nodeB.attainable) {
			return Math.pow(nodeA.cellx - nodeB.cellx, 2) + Math.pow(nodeA.celly - nodeB.celly, 2)
		}
		return this.MAX_FIND_COST
	}

	//两点之间的距离预测值
	public static heuristic_cost_estimate(nodeA: MapGrid, nodeB: MapGrid): number {
		return this.dist_betweenSqrt(nodeA, nodeB)
	}

	//查找开启列表中，F值最低的节点
	public static lowest_f_score(set: any, f_score: any): number {
		var lowest = AStar.MAX_FIND_COST
		var bestNode = null
		for (var i in set) {
			var nodeid = set[i]
			var score = f_score[nodeid]
			if (score < lowest) {
				lowest = score
				bestNode = nodeid
			}
		}
		return bestNode
	}

	//是否不在set中
	public static not_in(gridSet: any, nodeId: number): boolean {
		return !gridSet[nodeId]
	}

	//从set中删除一个节点
	public static remove_node(gridSet: any, nodeId: number) {
		delete gridSet[nodeId]
	}

	//反向查找得到路径
	public static unwind_path(flat_path: MapGrid[], map, current_node_id, nodeList: MapGrid[]): MapGrid[] {
		if (map[current_node_id]) {
			flat_path.unshift(nodeList[map[current_node_id]])
			return this.unwind_path(flat_path, map, map[current_node_id], nodeList)
		} else {
			return flat_path
		}
	}

	/**集合长度 */
	public static table_num(set): number {
		return Object.keys(set).length
	}

	/**查找相邻节点 
	 * 只返回相邻的四个节点 
	*/
	public static find_Neighbors(nodeId: number, nodeList: MapGrid[], mapWidth: number, mapHeight: number): number[] {
		var node = nodeList[nodeId]
		var cellx = node.cellx
		var celly = node.celly
		var ret = []
		//上
		if (celly > 0) {
			var nodeId = ((celly - 1) * mapWidth + cellx)
			if (nodeList[nodeId]) {
				ret.push(nodeId)
			}
		}
		//下
		if (celly < (mapHeight - 1)) {
			var nodeId = (celly + 1) * mapWidth + cellx
			if (nodeList[nodeId]) {
				ret.push(nodeId)
			}
		}
		//左
		if (cellx > 0) {
			var nodeId = (celly * mapWidth + (cellx - 1))
			if (nodeList[nodeId]) {
				ret.push(nodeId)
			}
		}
		//右
		if (celly < (mapWidth - 1)) {
			var nodeId = (celly * mapWidth + (cellx + 1))
			if (nodeList[nodeId]) {
				ret.push(nodeId)
			}
		}
		return ret
	}
	//
	// pathfinding functions
	//参数：star  开始点
	//goal  目标点
	//nodes 所有节点
	//

	public static findPath(start: number, goal: number, nodeList: MapGrid[], mapWidth: number, mapHeight: number): MapGrid[] {
		var closedset = {} //关闭列表
		var openset = {} //开启列表
		openset[start] = start
		var came_from = {}//记录节点的上一个节点


		var g_score = {}
		var f_score = {}
		g_score[start] = 0
		f_score[start] = g_score[start] + this.heuristic_cost_estimate(nodeList[start], nodeList[goal])// F = G + H

		while (this.table_num(openset) > 0) {
			var current = this.lowest_f_score(openset, f_score)// 找到F最小值
			if (current == null) {
				return null
			}
			//找到了目标点
			if (current == goal) {
				var flat_path = []
				var paths = this.unwind_path(flat_path, came_from, goal, nodeList)
				paths.push(nodeList[goal])
				return paths
			}
			//继续查找
			this.remove_node(openset, current)//从开启列表中删除选中节点	
			closedset[current] = current

			var neighbors = this.find_Neighbors(current, nodeList, mapWidth, mapHeight)//获得当前节点的附近节点
			for (var idx in neighbors) {
				var neighbor = neighbors[idx]
				if (this.not_in(closedset, neighbor)) {
					//附近节点没有在关闭列表里面，说明该节点还没有被选中
					var tentative_g_score = g_score[current] + this.dist_betweenSqrt(nodeList[current], nodeList[neighbor])
					if (this.not_in(openset, neighbor) || tentative_g_score < g_score[neighbor]) {
						came_from[neighbor] = current//记录父方格
						g_score[neighbor] = tentative_g_score
						f_score[neighbor] = g_score[neighbor] + this.heuristic_cost_estimate(nodeList[neighbor], nodeList[goal])
						if (this.not_in(openset, neighbor)) {
							openset[neighbor] = neighbor
						}
					}
				}
			}
		}
		return null
	}
}