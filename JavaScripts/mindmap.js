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
        this.dpiScale = window.devicePixelRatio;
    }
    pixelPerfect() {
        this.style.width = this.width + "px";
        this.style.height = this.height + "px";
        this.width = Math.floor(this.width * this.dpiScale);
        this.height = Math.floor(this.height * this.dpiScale);
    }
}
Graph.observedAttributes = ["devicePixelRatio", "size"];
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
        this.dpiScale = window.devicePixelRatio;
        this.pixelPerfect();
    }
    connectedCallback() {
        var acanvas = this.getContext("2d");
        if (!acanvas || !(acanvas instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context');
        }
        else {
            this.canvasContext = acanvas;
        }
        acanvas.font = "48px serif";
        acanvas.fillText("canvas可以用，好欸！", 0, 48);
    }
    read_MM_XML(mm) {
    }
}
MindMap.observedAttributes = ["devicePixelRatio", "size"];
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
