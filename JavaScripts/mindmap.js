"use strict";
//思维导图，我想做成兼顾紧凑和信息展示的那种
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchFile(dest) {
    return __awaiter(this, void 0, void 0, function* () {
        var response = yield fetch(dest);
        if (response.ok) {
            var raw = response.blob();
            return raw;
        }
        return null;
    });
}
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
        this.pixelPerfect();
    }
    pixelPerfect() {
        this.style.width = this.width.toString + "px";
        this.style.height = this.height.toString + "px";
        this.width = Math.floor(this.width * this.dpiScale);
        this.height = Math.floor(this.height * this.dpiScale);
        this.canvasContext.scale(this.dpiScale, this.dpiScale);
    }
}
Graph.observedAttributes = ["devicePixelRatio", "size"];
class MindMap extends Graph {
    constructor() {
        super();
        this.XMLRaw = "";
        this.rootObj = new MindMapObj("");
        var acanvas = this.getContext("2d");
        if (!acanvas || !(acanvas instanceof CanvasRenderingContext2D)) {
            throw new Error('Failed to get 2D context');
        }
        else {
            this.canvasContext = acanvas;
        }
        this.XMLDoc = new Document();
        this.dpiScale = window.devicePixelRatio;
        this.pixelPerfect();
    }
    connectedCallback() {
        //测试图样
        debugger;
        var acanvas = this.canvasContext;
        acanvas.fillStyle = "black";
        acanvas.moveTo(0, 0);
        acanvas.lineTo(600, 400);
        acanvas.moveTo(0, 0);
        acanvas.lineTo(400, 600);
        acanvas.stroke();
        acanvas.font = "12px serif";
        console.log(this.dataset.href);
        if (this.dataset.href) {
            var parse = new DOMParser();
            fetch(this.dataset.href)
                .then(response => response.text()) // 解析数据
                .then(data => this.XMLRaw = data) // 处理数据
                .then(data => this.XMLDoc = parse.parseFromString(this.XMLRaw, "application/xml"))
                .then(data => console.log(this.XMLRaw))
                .then(data => acanvas.fillText(this.XMLRaw, -10000, 100))
                .catch(error => console.error('Error happened:', error)); // 错误处理
            this.XMLDoc = parse.parseFromString(this.XMLRaw, "application/xml");
        }
        else {
            this.rootObj = new MindMapObj("空导图");
        }
    }
    loadMMXML(mm) {
        return __awaiter(this, void 0, void 0, function* () {
            var parse = new DOMParser();
            this.XMLDoc = parse.parseFromString(this.XMLRaw, "application/xml");
        });
    }
}
MindMap.observedAttributes = ["devicePixelRatio", "size"];
customElements.define("mengxi-mindmap", MindMap, { extends: "canvas" });
class MindMapObj {
    constructor(content) {
        this.position = [0, 0];
        this.children = []; //小孩(bushi)子级
        //connectors:MindMapConnector[] = [];//指示关系用的连接符
        this.visible = false; //可见性
        this.content = content;
    }
}
