"use strict";
//思维导图，我想做成兼顾紧凑和信息展示的那种
class Graph extends HTMLCanvasElement {
    constructor() {
        super();
        var acanvas = this.getContext("2d");
        if (!acanvas || !(acanvas instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context');
        }
        else {
            this.canvasContext = acanvas;
        }
    }
}
class MindMap extends Graph {
    constructor() {
        super();
        var acanvas = this.getContext("2d");
        if (!acanvas || !(acanvas instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context');
        }
        else {
            this.canvasContext = acanvas;
        }
        this.rootObj = new MindMapObj("空导图");
    }
    connectedCallback() {
        var _a;
        var acanvas = this.getContext("2d");
        if (!acanvas || !(acanvas instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context');
        }
        else {
            this.canvasContext = acanvas;
        }
        this.canvasContext.lineWidth = 8;
        (_a = this.canvasContext) === null || _a === void 0 ? void 0 : _a.strokeRect(15, 15, 114, 514);
    }
    read_MM_XML(mm) {
    }
}
customElements.define("mengxi-mindmap", MindMap, { extends: "canvas" });
class MindMapObj {
    constructor(content) {
        this.position = [0, 0];
        this.children = []; //小孩
        this.connectors = []; //连接符
        this.visible = false;
        this.content = content;
    }
}
class MindMapConnector {
    constructor() {
        this.content = null;
        this.visible = false;
    }
}
