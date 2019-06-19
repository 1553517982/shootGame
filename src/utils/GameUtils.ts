
class GameUtils {
	public constructor() {
	}

	public static getDirection(x, y, tx, ty) {
		var angle: number = Math.atan2(ty - y, tx - x);
		var pi = Math.PI;
		var pi2 = pi / 2;
		var pi8 = pi / 8;
		var pi16 = pi / 16;
		var direction = EntityDirection.RightDown;
		//8方向
		// if (angle > -pi8 && angle <= pi8) {
		// 	direction = EntityDirection.Right;
		// } else if (angle > pi8 && angle <= (pi2 - pi8)) {
		// 	direction = EntityDirection.RightUp;
		// } else if (angle > (pi2 - pi8) && angle <= (pi2 + pi8)) {
		// 	direction = EntityDirection.Up;
		// } else if (angle > (pi2 + pi8) && angle <= (pi - pi8)) {
		// 	direction = EntityDirection.LeftUp;
		// } else if (angle > (pi - pi8) || angle <= (-pi + pi8)) {
		// 	direction = EntityDirection.Left;
		// } else if (angle > (-pi2 + pi8) && angle <= (0 - pi8)) {
		// 	direction = EntityDirection.RightDown;
		// } else if (angle > (-pi2 - pi8) && angle <= (-pi2 + pi8)) {
		// 	direction = EntityDirection.Down;
		// } else if (angle > (-pi + pi8) && angle <= (-pi2 - pi8)) {
		// 	direction = EntityDirection.LeftDown;
		// }
		//四方向
		// if (angle > -pi16 && angle <= pi2) {
		// 	direction = EntityDirection.RightDown;
		// } else if (angle > -pi2 && angle <= -pi16) {
		// 	direction = EntityDirection.RightUp;
		// } else if (angle > -pi + pi16 && angle <= -pi2) {
		// 	direction = EntityDirection.LeftUp;
		// } else {
		// 	direction = EntityDirection.LeftDown;
		// }
		//return  direction
		if (Math.floor(x) == Math.floor(tx)) {
			return Math.floor(ty) > Math.floor(y) ? EntityDirection.Down : EntityDirection.Up
		} else {
			return Math.floor(tx) > Math.floor(x) ? EntityDirection.Right : EntityDirection.Left
		}
	}
}