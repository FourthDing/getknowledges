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
        this.href = "";
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
        console.log(this.dataset.href);
    }
    connectedCallback() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.dataset.href) {
                this.href = this.dataset.href;
                yield this.fetchMMFile();
                yield this.loadMMXML(this.XMLRaw);
            }
            else {
                this.rootObj = new MindMapObj("空导图");
            }
            //测试图样
            var acanvas = this.canvasContext;
            acanvas.strokeRect(1, 1, 100, 100);
            acanvas.font = "12px serif";
            acanvas.fillText(this.XMLRaw, -10000, 100);
            acanvas.moveTo(0, 0);
            acanvas.lineTo(600, 400);
            acanvas.moveTo(0, 0);
            acanvas.lineTo(400, 600);
            acanvas.stroke();
        });
    }
    fetchMMFile() {
        return __awaiter(this, void 0, void 0, function* () {
            var fileBlob = (yield fetchFile(this.href)) || new Blob();
            this.XMLRaw = yield fileBlob.text();
        });
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
