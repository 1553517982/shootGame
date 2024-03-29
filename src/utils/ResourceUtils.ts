/**
 * 资源加载工具类，
 * 支持多个resource.json文件加载
 * 封装Group的加载
 * 增加静默加载机制
 */
class ResourceUtils extends SingtonClass {
    private _configs: Array<any>;
    private _onConfigComplete: Function;
    private _onConfigCompleteTarget: any;

    private _groups: any;
    private _groupIndex: number = 0;
    private _itemLoadErrorFunction: Function;

    /**
     * 构造函数
     */
    public constructor() {
        super();

        this._configs = new Array<any>();
        this._groups = {};

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onResourceItemLoadError, this);
    }

    /**
     * 添加一个配置文件
     * @param jsonPath resource.json路径
     * @param filePath 访问资源路径
     */
    public addConfig(jsonPath: string, filePath: string): void {
        this._configs.push([jsonPath, filePath]);
    }

    /**
     * 开始加载配置文件
     * @param $onConfigComplete 加载完成执行函数
     * @param $onConfigCompleteTarget 加载完成执行函数所属对象
     */
    public loadConfig($onConfigComplete: Function, $onConfigCompleteTarget: any): void {
        this._onConfigComplete = $onConfigComplete;
        this._onConfigCompleteTarget = $onConfigCompleteTarget;
        this.loadNextConfig();
    }

    /**
     * 加载
     */
    private loadNextConfig(): void {
        //加载完成
        if (this._configs.length == 0) {
            this._onConfigComplete.call(this._onConfigCompleteTarget);
            this._onConfigComplete = null;
            this._onConfigCompleteTarget = null;
            return;
        }

        var arr: any = this._configs.shift();
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        RES.loadConfig(arr[0], arr[1]);
    }

    /**
     * 加载完成
     * @param event
     */
    private onConfigCompleteHandle(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigCompleteHandle, this);
        this.loadNextConfig();
    }

    /**
     * 加载资源组
     * @param $groupName 资源组名称
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroup($groupName: string, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void {
        if (!this._groups[$groupName]) {
            this._groups[$groupName] = []
        }
        this._groups[$groupName].push([$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget]);
        RES.loadGroup($groupName);
    }

    /**
     * 同时加载多个组
     * @param $groupName 自定义的组名称
     * @param $subGroups 所包含的组名称或者key名称数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadGroups($groupName: string, $subGroups: Array<any>, $onResourceLoadComplete: Function, $onResourceLoadProgress: Function, $onResourceLoadTarget: any): void {
        RES.createGroup($groupName, $subGroups, true);
        this.loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget)
    }

    /**
     * 静默加载
     * @param $groupName 资源组名称
     * @param $groupName 所包含的组名称或者key名称数组
     */
    public pilfererLoadGroup($groupName: string, $subGroups: Array<any> = null): void {
        //添加前缀，防止与正常加载组名重复
        var useGroupName = "pilferer_" + $groupName;
        if (!$subGroups) {
            $subGroups = [$groupName];
        }
        RES.createGroup(useGroupName, $subGroups, true);
        RES.loadGroup(useGroupName, -1);
    }

    /**
     * 资源组加载完成
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        var groupName: string = event.groupName;
        if (this._groups[groupName]) {
            for (var i in this._groups[groupName]) {
                var loadComplete: Function = this._groups[groupName][i][0];
                var loadCompleteTarget: any = this._groups[groupName][i][2];
                if (loadComplete != null) {
                    loadComplete.apply(loadCompleteTarget, [groupName]);
                }
            }

            this._groups[groupName] = null;
            delete this._groups[groupName];
        }
    }

    /**
     * 资源组加载进度
     */
    private onResourceLoadProgress(event: RES.ResourceEvent): void {
        // var groupName: string = event.groupName;
        // if (this._groups[groupName]) {
        //     var loadProgress: Function = this._groups[groupName][1];
        //     var loadProgressTarget: any = this._groups[groupName][2];
        //     if (loadProgress != null) {
        //         loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
        //     }
        // }
    }

    /**
     * 资源组加载失败
     * @param event
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        Log.warn(event.groupName + "资源组有资源加载失败");
        this.onResourceLoadComplete(event);
    }

    /**
     * 资源加载失败
     * @param event
     */
    private onResourceItemLoadError(event: RES.ResourceEvent): void {
        Log.warn(event.resItem.url + "资源加载失败");
        if (this._itemLoadErrorFunction) {
            this._itemLoadErrorFunction(event);
        }
    }

    /**
     * 注册资源加载失败处理函数
     */
    public registerItemLoadErrorFunction(func: (event: RES.ResourceEvent) => void): void {
        this._itemLoadErrorFunction = func;
    }

    /**
     * 混合加载资源组
     * @param $resources 资源数组
     * @param $groups 资源组数组
     * @param $onResourceLoadComplete 资源加载完成执行函数
     * @param $onResourceLoadProgress 资源加载进度监听函数
     * @param $onResourceLoadTarget 资源加载监听函数所属对象
     */
    public loadResource($resources = [], $groups = [], $onResourceLoadComplete: Function = null, $onResourceLoadProgress: Function = null, $onResourceLoadTarget: any = null): void {
        var needLoadArr = $resources.concat($groups);
        var groupName = "loadGroup" + this._groupIndex++;
        RES.createGroup(groupName, needLoadArr, true);
        if (!this._groups[groupName]) {
            this._groups[groupName] = []
        }
        this._groups[groupName].push([$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget]);
        //this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget];
        RES.loadGroup(groupName);
    }

    /**
     * 动态创建加载组
     * @param {string} $groupName
     * @param {string[]} resKeys
     * @param {boolean} bOverride 是否覆盖
     */
    public createGroup($groupName: string, resKeys: string[], bOverride?: boolean): void {
        RES.createGroup($groupName, resKeys, bOverride);
    }

    /**
     * 动态创建Resource
     * @param {string} resKey
     * @param {string} resType
     * @param {string} resUrl
     */
    public createResource(resKey: string, resType: string, resUrl: string) {
        var res: any = {
            name: resKey,
            type: resType,
            url: resUrl
        }
        RES.$addResourceData(res);
    }

    /**
     * 获取文件的真实路径
     */
    public getFileRealPath(key: string): string {
        let fileInfo = RES.getResourceInfo(key);
        return fileInfo.root + fileInfo.url;
    }
}
