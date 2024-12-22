# 自动监视knowledges中更改，并将knowledges目录结构转json
# 需要python模块 watchdog
import time
import sys,os,pathlib
import logging
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


def formatted_folder(folder,displayName=None):
    displayName = folder if(displayName==None) else displayName
    return {"displayName": displayName, "type": "folder", "files": [], "folders": {}}


def formatted_file(file,root, displayName=None):
    displayName = file if (displayName == None) else displayName
    return {"displayName": displayName, "type": "file", "href": "".join([root,"\\",file])[1:]}# [1:]是为了去那个点，让它变成网站的绝对路径


def json_dir(path):
    print('\033[2J\033[H', end='')
    PathOffset = len(pathlib.Path(path).parts)
    print("Monitoring",path,"Path offset is",PathOffset)

    currentwalk = os.walk(path)
    firstobj = next(currentwalk)
    treeRoot = {"displayName": "根目录",
      "type": "folder",
      "files":[],
      "folders":{} }
    for file in firstobj[2]:
        treeRoot["files"].append(formatted_file(file,firstobj[0]))

    for folder in firstobj[1]:
        treeRoot["folders"][str(folder)] = (formatted_folder(folder))

    print (firstobj[1])
    print(treeRoot)
    #print(treeRoot["folders"])

    for root, folders, files in currentwalk:
        #print((root,folders,files))
        pathIndex = ""
        for part in pathlib.Path(root).parts[PathOffset:]:
            pathIndex = "".join((pathIndex,f"['{part}']"))
        #print(pathIndex)
        print("".join(("treeRoot['folders']",pathIndex)))
        for folder in folders:
            eval("".join(("treeRoot['folders']",pathIndex)))["folders"][str(folder)] = (formatted_folder(folder))
    
    print(treeRoot)
        # print((pathlib.Path(root).parts[PathOffset:], dirs, files))
        # .\knowledges\A\110\testfile.html
        #   v
        # json[knowledges][A][110][testfile.html]
        # treeroot

class DirHandler(FileSystemEventHandler):
    walkPath = ""
    def __init__(self,path:str="."):
        self.walkPath = path
    def on_created(self,event):self.json_dir()
    def on_deleted(self,event):self.json_dir()
    def on_moved(self,event):json_dir()


if __name__ == "__main__":

    path = sys.argv[1] if len(sys.argv) > 1 else '.'

    while True:
        json_dir(path)
        time.sleep(60)

#    event_handler = DirHandler(path)
#    observer = Observer()
#    observer.schedule(event_handler, path, recursive=True)
#    observer.start()
#    try:
#        while(observer.is_alive()):
#            observer.join(1)
#    finally:
#        observer.stop()
#        observer.join()
