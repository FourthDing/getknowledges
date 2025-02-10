# 自动监视knowledges中更改，并将knowledges目录结构转json
# 需要python模块 watchdog
import time
import sys, os, pathlib, re
import logging
import typing
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler


class compositedict(dict):
    def __init__(self, seq=None, **kwargs):
        super(compositedict, self).__init__()
        if seq is None:
            pass
        elif isinstance(seq, dict):
            for k, v in seq.items():
                self[k] = compositedict(v) if isinstance(v, dict) else v
        else:
            for k, v in seq:
                self[k] = compositedict(v) if isinstance(v, dict) else v
        for k, v in kwargs.items():
            self[k] = compositedict(v) if isinstance(v, dict) else v

    def __getitem__(self, item):
        if not self.__contains__(item):
            self[item] = compositedict()
        return super(compositedict, self).__getitem__(item)


def navFolderObj(Obj: dict, *paths):
    # 试图在dict中导航，最后到达dict[a][b][c]...[x][y][z]这样的
    pointer = Obj  # 现在它俩指向一个表，修改同步
    for point in paths:
        pointer = pointer["folders"][point]
    return pointer


def get_title(path: Path, file):
    with open(str(path / file)) as mdDocument:
        separatedArticle = re.split(r"\n+", mdDocument.read())  # 分个行就行了
    for line in separatedArticle:  # 挨行读文件
        for i in range(0, len(line) - 1):
            if line[i] == "#" and not (line[i + 1] == "#"):
                # 这一定就是标题了，见好就收
                return line[i + 1 :].strip()  # 从第i位到结尾，去除所有空白字符
        return os.path.splitext(file)[0]  # 没有我要的h1，把文件名返回得了


def pathObj2Dict(folder):
    # 例如iter出(WindowsPath('knowledges'), ['A', 'B', 'C', 'D', 'E'], ['index.html', 'markdowntest.md', 'test.mm', 'tips.html'])
    # ->{"displayname":"","type":"folder","folders": {},"files": []}(文件夹)
    current = folder[0]
    folderObjs = folder[1]
    fileObjs = folder[2]

    data = {
        "displayName": "." if len(current.parts) < 1 else current.parts[-1],
        "type": "folder",
        "folders": {},
        "files": [],
    }  # 执行的目录

    for folderObj in folderObjs:  # 先处理文件夹
        if folderObj[0] == ".":  # 带.的不要
            continue
        else:
            inserted = {  # 把夹插进去
                "displayName": folderObj,
                "type": "folder",
                "folders": {},
                "files": [],
            }  # 模板
        data["folders"][folderObj] = inserted
        # 文件夹名，类型(文件夹)，子文件夹(用obj方便)，子文件
        # print("命中文件夹,", inserted)  # 测试用
        # print("->", str(current))

    for fileStr in fileObjs:  # 再处理文件
        fileHref = current / fileStr  # 可以这样拼接路径

        match os.path.splitext(fileStr)[1]:
            case ".md":  # 是markdown文件！读头一个h1作为显示名（如果它是）
                inserted = {
                    "displayName": get_title(current, fileStr),
                    "type": "article",
                    "href": str(fileHref),
                }

            case (
                ".js" | ".css" | "mm" | ".json"
            ):  # 它们在幕后支持网站功能或者是文档内容的一部分
                continue  # 跳过了，不将它们加入目录
            case _:  # 其它文件先加着，显得我们东西多(机灵)
                inserted = {
                    "displayName": fileStr,
                    "type": "article",
                    "href": str(fileHref),
                }
        data["files"].append(inserted)
        # print("命中文件,", inserted)  # 测试用
        # print("->",str(current),"navfolderObj:")
        # 文件名，类型(文件)，链接
    # print("获得", current, "的json:", data)

    return data


def formatted_folder(folder, displayName=None):
    displayName = folder if (displayName == None) else displayName
    return {"displayName": displayName, "type": "folder", "files": [], "folders": {}}


def formatted_file(file, root, displayName=None):
    displayName = file if (displayName == None) else displayName
    return {
        "displayName": displayName,
        "type": "file",
        "href": "".join([root, "\\", file])[1:],
    }  # [1:]是为了去那个点，让它变成网站的绝对路径


def json_dir(path):
    # 试图清屏
    print("\033c", end="")
    PathOffset = bool(
        len(pathlib.Path(path).parts)
    )  # 非只有"."的路径会把自己的文件夹名带进来，导航时要减一位
    # 将写入文件的json树(字典形态)
    tree = {"displayName": "", "children": []}
    # 目前搜索的路径
    pathCurrent = Path(path)
    # 任务：遍历
    pathWalk = (
        pathCurrent.walk()  # 这是什么？这是个iter->tuple(Path(dirpath), [dirnames], [filenames])s
    )
    print("然后获得了这堆东西:")
    for thing in pathWalk:
        pathStr = str(thing[0])
        if ("\." in pathStr) or (
            pathStr[0] == "." and not len(pathStr) == 1
        ):  # 排除了含.的,但不排除扫描的根目录
            continue
        print(pathObj2Dict(thing))

    print("写文件……", end="")
    jsonObj = open("test.json")  # 开始文件操作

    jsonObj.close()  # 关闭文件
    print("完成。")
    print("构建出的json为：")
    print("正在监视", path, "下的修改，路径深度减一:", PathOffset)


class DirHandler(FileSystemEventHandler):
    walkPath = ""

    def __init__(self, path: str = "."):
        self.walkPath = path

    def on_created(self, event):
        json_dir()

    def on_deleted(self, event):
        json_dir()

    def on_moved(self, event):
        json_dir()


if __name__ == "__main__":
    # 设置监测位置
    path = sys.argv[1] if len(sys.argv) > 1 else "."

    while True:
        json_dir(path)
        time.sleep(60)
    # 启动watchdog
    event_handler = DirHandler(path)
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()
    try:
        while observer.is_alive():
            observer.join(1)
    finally:
        observer.stop()
        observer.join()
