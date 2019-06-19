class EntityManager {
	/**对象列表 */
	private entitys: any
	/**主角id */
	private heroId: number

	private static $instance: EntityManager
	public static get instance() {
		if (!this.$instance) {
			this.$instance = new EntityManager()
		}
		return this.$instance
	}

	public constructor() {
		this.entitys = {}
	}

	public get hero(): Hero {
		return this.getEntity(this.heroId) as Hero
	}

	public clear() {
		var idList = Object.keys(this.entitys)
		for (var i in idList) {
			this.removeEntity(Number(idList[i]))
		}
	}

	/**创建实体 */
	public createEntity(property): Entity {
		var entity: Entity = null
		switch (property.type) {
			case EntityType.Player:
				entity = new Player(property)
				break;
			case EntityType.Food:
				entity = new Food(property)
				break;
			case EntityType.MainPlayer:
				entity = new Hero(property)
				//记录一下主角
				this.heroId = entity.getId()
				break;
		}
		this.entitys[entity.getId()] = entity
		return entity
	}

	/**获取实体 */
	public getEntity(entityId): Entity {
		return this.entitys[entityId]
	}

	/**根据实体类型获取实体列表 */
	public getEntitysByType(type: EntityType): Fighter[] {
		let ret = []
		for (var k in this.entitys) {
			if (this.entitys[k].type == type) {
				ret.push(this.entitys[k])
			}
		}
		return ret
	}
	/**移除实体 */
	public removeEntity(entityId: number) {
		var entity = this.entitys[entityId] as Fighter
		if (entity) {
			entity.destructor()
			delete this.entitys[entityId]
		}
	}
}