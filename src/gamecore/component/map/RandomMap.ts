//格子属性 0-可行走区域  1-遮罩  2-阻挡
enum GridType {
	//默认为可行走区域
	default,
	//遮罩
	mask,
	//阻挡
	block
}

//地图格子
class MapGrid extends eui.Image {
	//格子id
	gid: string
	//x坐标
	x: number
	//y坐标
	y: number
	//x格子坐标
	cellx: number
	//y格子坐标
	celly: number
	//格子属性 0-可行走区域  1-遮罩  2-阻挡
	type: GridType

	constructor(param) {
		super()
		this.resetGrid(param)
	}

	//重设格子信息
	resetGrid(param) {
		this.gid = param.id
		this.x = param.x
		this.y = param.y
		this.anchorOffsetX = 16
		this.anchorOffsetY = 16
		this.cellx = param.cellx
		this.celly = param.celly
		this.type = param.type
		this.source = param.source
	}

	/**是否可到达 */
	get attainable(): boolean {
		return this.type != GridType.block
	}
}
/**
 * 随机地图 
 * 利用柏林噪音生成2d随机地图
*/
class RandomMap extends BaseContainer {
	/**地图id */
	private mapId: string
	//地图宽度
	private mapWidth: number;
	//地图高度
	private mapHeight: number;
	/**格子大小 */
	public cellSize: number
	/**地图格子信息 */
	private grids: MapGrid[]
	/**随机数种子 */
	public static seed: number;
	/**格子池 */
	private gridsPool: MapGrid[]
	/**用于调试地图信息显示地图格子 */
	public static showGrid: boolean;
	/**第一个可移动点作为出生点 */
	public get bornGridId(): number {
		return this.validGridIds[0]
	}
	/**记录可移动的格子id列表 */
	private validGridIds: number[];
	/**地表层 */
	private groundLayer: BaseContainer

	public static showPath: boolean

	/**遮罩层 */

	/**装饰层	*/

	//记录装饰过的节点
	decoratedIdList: any

	public get bornPos(): any {
		var cellx = this.grids[this.bornGridId].cellx
		var celly = this.grids[this.bornGridId].celly
		return { x: cellx * this.cellSize, y: celly * this.cellSize }
	}

	public get randomPos(): any {
		var randomIdx = Math.floor(RandomMap.getRandom(this.validGridIds.length - 1))
		var randomId = this.validGridIds[randomIdx]
		var cellx = this.grids[randomId].cellx
		var celly = this.grids[randomId].celly
		return { x: cellx * this.cellSize, y: celly * this.cellSize }
	}

	public constructor() {
		super()
		this.gridsPool = []
	}

	/**初始化 */
	private loadCompleteCallback: Function
	public init(mapId: string, loadCompleteCallback?: Function) {
		this.mapId = mapId
		this.loadCompleteCallback = loadCompleteCallback
		RES.getResAsync("map_json", this.loadComplete, this)
	}
	/**配置加载完毕 */
	private loadComplete(config) {
		var mapConf = config[this.mapId]
		this.width = mapConf.width
		this.height = mapConf.height
		this.mapWidth = mapConf.width
		this.mapHeight = mapConf.height
		this.cellSize = mapConf.cellSize
		this.validGridIds = []
		RandomMap.seed = mapConf.seed || 0
		this.initGrids(mapConf.metal)
		if (this.loadCompleteCallback) {
			this.loadCompleteCallback()
			this.loadCompleteCallback = null
		}
	}

	/**
	 * 获取伪随机数
	 */
	public static getRandom(max?: number, min?: number): number {
		max = max || 1
		min = min || 0
		//线性同余 制造伪随机数
		RandomMap.seed = (RandomMap.seed * 9301 + 49297) % 233280
		var rnd = RandomMap.seed / 233280
		return min + rnd * Math.abs(max - min)
	}

	/**构造 
	 * @param mapMetal 地图材质配置  地表资源集合  装饰资源集合
	*/
	private initGrids(mapMetal: any) {
		//生成随机地图
		this.createMapGrids(mapMetal.ground, mapMetal.blockPercent, mapMetal.maskPercent)
		/**@todo 需要进行光滑处理 */
		this.smoothMapGrids()
		//生成装饰物
		var decorators = RES.getRes("decorators_json")
		this.initDecorator(decorators[mapMetal.decorators])
	}

	/**对地图进行光滑处理 */
	private smoothMapGrids() {
		//保证每一个可移动点之间的连通性
		var startId = this.validGridIds[0]

		var visitors = {}
		var allResults = []
		//找出最长的集合
		var findResultId = 0
		var maxPathLength = 0
		for (var k = 0; k < this.validGridIds.length; k++) {
			var grid = this.grids[this.validGridIds[k]]
			var result = {}
			this.findGridNeiboors(grid.cellx, grid.celly, result, visitors)
			var nodeLength = Object.keys(result).length
			if (nodeLength > 0) {
				allResults.push(result)
				if (nodeLength > maxPathLength) {
					findResultId = (allResults.length - 1)
					maxPathLength = nodeLength
				}
			}
		}
		//然后其他集合跟这个打通
		for (var resultIdx in allResults) {
			if (findResultId != Number(resultIdx)) {
				this.connectTwoResult(allResults[resultIdx], allResults[findResultId])
			}
		}
		//Log.info(allResults)
	}

	private cellxyToGridId(cellx, celly) {
		return celly * this.mapWidth + cellx
	}

	/**打通两个集合 */
	private connectTwoResult(arrayA: number[], arrayB: number[]) {
		var findGridIdA = null
		var findGridIdB = null
		var minDistance = this.mapWidth + this.mapHeight
		//找出行和列的差值之和最小的两个格子 将中间的格子打通
		for (var gridIdA in arrayA) {
			for (var gridIdB in arrayB) {
				var distance = this.getGridDistance(Number(gridIdA), Number(gridIdB))
				if (minDistance > distance) {
					findGridIdA = gridIdA
					findGridIdB = gridIdB
					minDistance = distance
				}
			}
		}
		//连通两个格子之间的路径  如果是阻挡 则将阻挡重置成可移动区域并加入可移动格子列表
		var gridA = this.grids[findGridIdA]
		var gridB = this.grids[findGridIdB]
		var cellxA = gridA.cellx
		var cellyA = gridA.celly
		var cellxB = gridB.cellx
		var cellyB = gridB.celly
		var minx = Math.min(cellxA, cellxB)
		var maxx = Math.max(cellxA, cellxB)
		var miny = Math.min(cellyA, cellyB)
		var maxy = Math.max(cellyA, cellyB)

		for (var y = miny; y <= maxy; y++) {
			for (var x = minx; x < maxx; x++) {
				var tempGridId = this.cellxyToGridId(x, y)
				if (this.grids[tempGridId] && !this.grids[tempGridId].attainable) {
					if (RandomMap.showGrid) {
						this.gridTypeRect.graphics.beginFill(0xffffff, 0.2)
						this.gridTypeRect.graphics.drawRect(this.grids[tempGridId].x - this.cellSize / 2, this.grids[tempGridId].y - this.cellSize / 2, this.cellSize, this.cellSize)
						this.gridTypeRect.graphics.endFill()
					}
					this.grids[tempGridId].type = GridType.default
					this.validGridIds.push(tempGridId)
				}
			}
		}
	}

	private getGridDistance(gridIdA: number, gridIdB: number): number {
		var gridA = this.grids[gridIdA]
		var gridB = this.grids[gridIdB]
		var cellxA = gridA.cellx
		var cellyA = gridA.celly
		var cellxB = gridB.cellx
		var cellyB = gridB.celly
		return Math.abs(cellxB - cellxA) + Math.abs(cellyB - cellyA)
	}

	/**递归处理连通性问题 
	 * result 保存跟cellx celly连同的胡同列表
	*/
	private findGridNeiboors(cellx, celly, results, visitors) {
		var gridId = this.cellxyToGridId(cellx, celly)
		if (results[gridId] || visitors[gridId]) {
			return
		}
		visitors[gridId] = true
		if (this.grids[gridId].type != GridType.block) {
			results[gridId] = true
		} else {
			return
		}
		//找左边
		if (cellx > 0) {
			this.findGridNeiboors(cellx - 1, celly, results, visitors)
		}
		//找右边
		if (cellx < (this.mapWidth - 1)) {
			this.findGridNeiboors(cellx + 1, celly, results, visitors)
		}
		//找上边
		if (celly > 0) {
			this.findGridNeiboors(cellx, celly - 1, results, visitors)
		}
		//找下边
		if (celly < (this.mapHeight - 1)) {
			this.findGridNeiboors(cellx, celly + 1, results, visitors)
		}
		return results
	}

	/**
	 * 创建装饰层
	 * @param decorators {
     *          "block": {},
     *          "mask": {}
     *       }
	 * }
	*/
	private initDecorator(decorators: any) {
		this.decoratedIdList = {}
		for (var key in this.grids) {
			var grid = this.grids[key]
			//只需要处理未装饰过的节点
			if (!this.decoratedIdList[grid.gid]) {
				switch (grid.type) {
					case GridType.mask:
						this.decoratGrids(grid, GridType.mask, decorators)
						break;
					case GridType.block:
						this.decoratGrids(grid, GridType.block, decorators)
						break;
				}
			}
		}
	}
	/**装饰对应的格子 
	 * 创建装饰层 寻找尽可能大的矩形同类型集合 来创建最大的装饰物 
	 * 然后将旁边孤立的噪声点设置成孤立的装饰物并标记为已修饰
	*/
	private decoratGrids(grid: MapGrid, gridType: GridType, decorators: any) {
		//找到相邻的格子 只往右下找
		var cellx = grid.cellx
		var celly = grid.celly
		var rect = this.findMaxRect(grid, gridType)
		//根据矩形 创建装饰物
		var decoratorCfg = null
		if (gridType == GridType.block) {
			decoratorCfg = decorators.block
		} else if (gridType == GridType.mask) {
			decoratorCfg = decorators.mask
		}
		this.drawDecoratorRect(cellx, celly, rect.width, rect.height, decoratorCfg)
	}


	/**查找可构建的最大矩形 */
	private findMaxRect(grid: MapGrid, gridType: GridType) {
		//找到相邻的格子 只往右下找
		var cellx = grid.cellx
		var celly = grid.celly

		//找出相邻切类型相同的每一行最大矩形长度  集合最小值 即为最大矩形
		var rects = {}
		var minX = null
		if (celly > 20) {
			let a = 1
		}
		var maxHeight = 0
		for (var v = celly; v < this.mapHeight; v++) {
			rects[v] = 0
			for (var h = cellx; h < this.mapWidth; h++) {
				var gridid = this.cellxyToGridId(h, v)
				if (!this.decoratedIdList[gridid] && this.grids[gridid].type == gridType) {
					rects[v]++
				} else {
					break
				}
			}
			//如果新的一行类型不一样 直接break
			if (rects[v] == 0) {
				break
			} else {
				if ((!minX || minX > rects[v])) {
					minX = rects[v]
				}
			}
			maxHeight++
		}
		return { width: (minX || 1), height: (maxHeight || 1) }
	}

	/**绘制装饰物 
	 * @param cellx 起始格子x
	 * @param celly 起始格子y
	 * @param width 矩形宽度
	 * @param height 矩形高度
	 * @param decoratorCfg 装饰物配置  1x1 1x2 1x3 2x1  2x2 2x3 3x1 3x2 3x3的装饰物 超过3x3的矩形都可以用3x3来生成
	*/
	private rectsShape: egret.Shape;
	private drawDecoratorRect(cellx, celly, width, height, decoratorCfg) {
		var key = this.getDecoratorKey(width, height)
		var cfg = decoratorCfg[key]
		//随机一个装饰物
		if (RandomMap.showGrid) {
			if (!this.rectsShape) {
				this.rectsShape = new egret.Shape()
				this.addChild(this.rectsShape)
			}
		}
		var conf = RES.getRes("maptile_json")
		var randomIdx = Math.floor(RandomMap.getRandom(cfg.length - 1));
		var decorator = cfg[randomIdx]
		if (decorator) {
			console.log("width:", width, "height:", height)
			var idx = 0
			for (var v = 0; v < height; v++) {
				for (var h = 0; h < width; h++) {
					var gridId = this.cellxyToGridId(cellx + h, celly + v)
					var grid = this.grids[gridId]
					if (grid) {
						var source = this.findDecoratorSource(width, height, h, v, decorator)
						var img = new eui.Image(conf[source])
						this.addChild(img)
						img.x = grid.x - this.cellSize / 2
						img.y = grid.y - this.cellSize / 2
						this.decoratedIdList[gridId] = true
						idx++
					}
				}
			}
		}

		if (RandomMap.showGrid) {
			var color = 0xff0000
			var gridId = this.cellxyToGridId(cellx, celly)
			var grid = this.grids[gridId]
			if (grid.attainable) {
				color = 0x00ff00
			}
			this.rectsShape.graphics.beginFill(color, 0.5)
			this.rectsShape.graphics.lineStyle(10, 0x000000)
			this.rectsShape.graphics.drawRect(cellx * this.cellSize, celly * this.cellSize, width * this.cellSize, height * this.cellSize)
			this.rectsShape.graphics.endFill()
			this.setChildIndex(this.rectsShape, this.numChildren)
		}
	}
	/**根据位置找出装饰物资源名称 */
	private findDecoratorSource(width, height, h, v, decorators) {
		var decoratorLen = decorators.parts.length
		if (width * height == decoratorLen) {
			var idx = (width * v + h)
			return decorators.parts[idx]
		} else {
			var curCol = Math.floor((width * v + h) / width)
			var curRow = h
			var totalCol = height
			var totalRow = width
			var sourceIdx = 0
			if (decoratorLen / 3 == 3) {
				//3*3
				sourceIdx = this.findDecorator3x3(curCol, curRow, width, height)
			} else if (decoratorLen / 3 == 2) {
				//3*2 2*3
				if (width > 3) {
					sourceIdx = this.findDecorator3x2(curCol, curRow, width, height)
				} else {
					sourceIdx = this.findDecorator2x3(curCol, curRow, width, height)
				}
			} else if (decoratorLen / 3 == 1) {
				//3*1  1*3
				if (width > 3) {
					sourceIdx = this.findDecorator3x1(curCol, curRow, width, height)
				} else {
					sourceIdx = this.findDecorator1x3(curCol, curRow, width, height)
				}
			}
			return decorators.parts[sourceIdx]
		}
	}

	private findDecorator3x3(curCol, curRow, width, height): number {
		if (curCol == 0) {
			if (curRow == 0) {
				return 0
			} else if (curRow > 0 && curRow < width - 1) {
				return 1
			} else {
				return 2
			}
		} else if (curCol == height - 1) {
			if (curRow == 0) {
				return 6
			} else if (curRow > 0 && curRow < width - 1) {
				return 7
			} else {
				return 8
			}
		} else {
			if (curRow == 0) {
				return 3
			} else if (curRow > 0 && curRow < width - 1) {
				return 4
			} else {
				return 5
			}
		}
	}

	private findDecorator3x2(curCol, curRow, width, height): number {
		if (curCol == 0) {
			if (curRow == 0) {
				return 0
			} else if (curRow > 0 && curRow < width - 1) {
				return 1
			} else {
				return 2
			}
		} else {
			if (curRow == 0) {
				return 3
			} else if (curRow > 0 && curRow < width - 1) {
				return 4
			} else {
				return 5
			}
		}
	}

	private findDecorator2x3(curCol, curRow, width, height): number {
		if (curCol == 0) {
			if (curRow == 0) {
				return 0
			} else {
				return 1
			}
		} else if (curCol == height - 1) {
			if (curRow == 0) {
				return 2
			} else {
				return 3
			}
		} else {
			if (curRow == 0) {
				return 4
			} else {
				return 5
			}
		}
	}


	private findDecorator3x1(curCol, curRow, width, height): number {
		if (curRow == 0) {
			return 0
		} else if (curRow > 0 && curRow < width - 1) {
			return 1
		} else {
			return 2
		}
	}

	private findDecorator1x3(curCol, curRow, width, height): number {
		if (curCol == 0) {
			return 0
		} else if (curCol == height - 1) {
			return 2
		} else {
			return 1
		}
	}

	/**获取装饰配置的key  */
	private getDecoratorKey(width: number, height: number): string {
		var pre = (width >= 3) ? 3 : width
		var tail = (height >= 3) ? 3 : height
		return (pre + "x" + tail)
	}

	/**回收旧的地图格子对象 */
	private recycleOldGrids() {
		for (var k in this.grids) {
			this.gridsPool.push(this.grids[k])
			this.removeChild(this.grids[k])
		}
		this.grids = []
	}

	/**创建格子数据对象 */
	private createGrid(param: any): MapGrid {
		if (this.gridsPool.length > 0) {
			var grid = this.gridsPool.pop()
			grid.resetGrid(param)
			return grid
		}
		return new MapGrid(param)
	}
	private gridTypeRect: egret.Shape
	private createMapGrids(groundRes: string, blockPercent: number, maskPercent: number): any {
		var xSample = 0;
		var ySample = 0;
		var mapWidth = this.mapWidth
		var mapHeight = this.mapHeight
		var cellsize = this.cellSize

		this.recycleOldGrids()
		var conf = RES.getRes("maptile_json")
		if (RandomMap.showGrid) {
			if (!this.gridTypeRect) {
				this.gridTypeRect = new egret.Shape()
			}
			this.gridTypeRect.graphics.beginFill(0xffffff)
			this.gridTypeRect.graphics.drawRect(0, 0, mapWidth, mapHeight)
			this.gridTypeRect.graphics.endFill()
		}
		var blockRate = (1 - blockPercent)
		var maskRate = (1 - blockPercent - maskPercent)
		for (var y = 0; y < mapHeight; y++) {
			for (var x = 0; x < mapWidth; x++) {
				var gridType = GridType.default
				var color = 0xffffff;
				if (x == 0 || y == 0 || x == mapWidth - 1 || y == mapHeight - 1) {
					color = 0xff0000;
					gridType = GridType.block
				} else {
					xSample = RandomMap.getRandom(mapWidth);
					ySample = RandomMap.getRandom(mapHeight);
					var ret = PerlinNoise.noise2d(xSample, ySample);
					if (ret > blockRate) {
						color = 0xff0000;
						gridType = GridType.block
					}
					else if (ret > maskRate) {
						color = 0x00ffff;
						gridType = GridType.mask
					}
				}

				var posx = x * cellsize
				var posy = y * cellsize
				if (RandomMap.showGrid) {
					this.gridTypeRect.graphics.beginFill(color, 0.3)
					this.gridTypeRect.graphics.drawRect(posx, posy, cellsize, cellsize)
					this.gridTypeRect.graphics.endFill()
				}

				//格子结构信息{id: id, x:x, y:y, type:type }
				var gid = this.cellxyToGridId(x, y)
				var grid = this.createGrid({ id: gid, x: posx + cellsize / 2, y: posy + cellsize / 2, cellx: x, celly: y, type: gridType, source: conf[groundRes] })
				this.grids.push(grid)
				this.addChild(grid)
				//Log.info("创建格子：", x + "," + y, ret)
				if (gridType != GridType.block) {
					//先存入临时可移动格子集合 需要进行光滑处理
					this.validGridIds.push(gid)
				}
			}
		}
		if (RandomMap.showGrid) {
			if (this.gridTypeRect) {
				this.addChild(this.gridTypeRect)
			}
		}
	}

	/**获取寻路路径 
	 * 传进来的是像素坐标 要转换成格子坐标寻路
	*/
	//显示路径信息
	private pathLine: egret.Shape
	public findPath(posx: number, posy: number, tposx: number, tposy: number): MapGrid[] {
		if (!this.pathLine) {
			this.pathLine = new egret.Shape()
			this.addChild(this.pathLine)
		}
		this.pathLine.graphics.clear()
		var cellx = Math.floor(posx / this.cellSize)
		var celly = Math.floor(posy / this.cellSize)
		var tcellx = Math.floor(tposx / this.cellSize)
		var tcelly = Math.floor(tposy / this.cellSize)
		var startGridId = this.cellxyToGridId(cellx, celly)
		var endGridId = this.cellxyToGridId(tcellx, tcelly)
		var paths: MapGrid[] = AStar.findPath(startGridId, endGridId, this.grids, this.mapWidth, this.mapHeight)
		if (paths) {
			if (RandomMap.showPath) {
				this.pathLine.graphics.beginFill(0xffee00)
				for (var k in paths) {
					this.pathLine.graphics.drawRect(paths[k].x - this.cellSize / 2, paths[k].y - this.cellSize / 2, this.cellSize, this.cellSize)
				}
				this.pathLine.graphics.endFill()
			}
		}
		return paths
	}

	/**获取可移动的随机格子 
	 * random 0-1的随机值
	*/
	public getValidRandomGrid(random: number): MapGrid {
		var len = this.validGridIds.length
		var randomIdx = Math.floor((len - 1) * random)
		var gridId = this.validGridIds[randomIdx]
		return this.grids[gridId]
	}
}

RandomMap.showGrid = false
RandomMap.showPath = false