class MessageRoute {
    public static CODE = {
        OK: 200,
        FAIL: 500
    }

    public static CONNECTOR = {
        //入口
        ENTRY: "connector.entryHandler.entry",
        //创建角色
        CREATEROLE: "connector.roleHandler.createPlayer",
        /**进入场景 */
        ENTER_SCENE: "area.playerHandler.enterScene"
    }

    public static BATTLE = {
        /**接收到服务器命令返回 */
        ONCOMMANDS: "onCommands",
        //发送命令给服务器
        SEND_COMMANDS: "sendCommands",
    }
}