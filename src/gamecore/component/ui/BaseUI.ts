/**
 * UI基类
 * 
 */
class BaseUI extends eui.Component {
    /**界面名称 */
    private viewName: string
    /**界面controller */
    protected controller: ViewController
    /**是否关闭销毁 */
    public hideDestroy: boolean

    public constructor(viewName: string) {
        super()
        this.viewName = viewName
        let viewConf = UIConfig[this.viewName]
        if (viewConf) {
            this.skinName = viewConf.skinName
            this.hideDestroy = viewConf.destroy
        }
    }

    public childrenCreated(): void {
        this.onCreate()
    }

    public onCreate() {
        console.log("界面创建完毕：", this.viewName)
        this.controller.onCreate(this.viewName)
    }

    public onShow() {
        this.controller.onShow(this.viewName)
        console.log("打开界面" + this.viewName)
    }

    public onHide() {
        this.controller.onHide(this.viewName)
        console.log("关闭界面" + this.viewName)
    }

    public destroy() {
        this.controller.destroy(this.viewName)
        console.log("销毁界面" + this.viewName)
    }

    public close() {
        App.UIManager.hideUI(this.viewName)
    }

}