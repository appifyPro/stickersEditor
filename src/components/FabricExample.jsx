import React, { useEffect, useState } from "react";
import StockImg from "./StockImg";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import { fabric } from "fabric";

const FabricExample = () => {
  const [objects, setObjects] = useState([]);
  const { editor, onReady, selectedObjects } = useFabricJSEditor();
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(2); // Add this state at the top
  const [deleteButtonPosition, setDeleteButtonPosition] = useState({
    top: 0,
    left: 0,
  });
  const [opacity, setOpacity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  useEffect(() => {
    const initCanvas = () => {
      editor?.canvas.setWidth(500);
      editor?.canvas.setHeight(750);
      editor?.canvas.setBackgroundColor(null);
      
      editor?.canvas.renderAll();

      editor.canvas.on("mouse:move", handleMouseMove);
      editor.canvas.on("mouse:up", handleMouseUp);
      editor.canvas.on("selection:created", handleObjectSelected);
      editor.canvas.on("selection:updated", handleObjectSelected);
      editor.canvas.on("selection:cleared", handleSelectionCleared);
      editor.canvas.on("object:moving", handleObjectMoving);
      editor.canvas.on("object:modified", handleObjectModified);
    };

    const handleObjectModified = () => {
      const currentState = JSON.stringify(editor.canvas);
      setUndoStack((prevStack) => [...prevStack, currentState]);
      setRedoStack([]);
    };

    const handleMouseMove = (event) => {
      const target = editor?.canvas.findTarget(event.e);
      if (target) {
        updateDeleteButtonPosition(target);
      }
    };

    const handleMouseUp = (event) => {
      const target = editor?.canvas.findTarget(event.e);
      if (target) {
        const cornerClicked = target.__corner;
        if (cornerClicked) {
          console.log("Corner clicked:", cornerClicked);
        }
      }
    };

    const handleObjectSelected = (event) => {
      const activeObject = event.target;
      if (activeObject) {
        updateDeleteButtonPosition(activeObject);
        setOpacity(activeObject.opacity || 1);
      }
    };

    const handleSelectionCleared = () => {
      setDeleteButtonPosition({ top: 0, left: 0 });
    };

    const handleObjectMoving = (event) => {
      const activeObject = event.target;
      if (activeObject) {
        updateDeleteButtonPosition(activeObject);
      }
    };

    const updateDeleteButtonPosition = (target) => {
      const canvasBoundingRect = editor.canvas
        .getElement()
        .getBoundingClientRect();
      const objectBoundingRect = target.getBoundingRect();
      const top = canvasBoundingRect.top + objectBoundingRect.top - 30;
      const left =
        canvasBoundingRect.left +
        objectBoundingRect.left +
        objectBoundingRect.width;
      setDeleteButtonPosition({ top, left });
    };

    if (editor) {
      initCanvas();
    }
  }, [editor]);

  useEffect(() => {
    if (editor) {
      editor.canvas.on("object:added", updateObjects);
      editor.canvas.on("object:removed", updateObjects);
    }
  }, [editor]);

  const updateObjects = () => {
    setObjects(editor.canvas.getObjects());
  };

  const [borderColor, setBorderColor] = useState("#000000");

  const onAddRectangle = () => {
    const rectangle = new fabric.Rect({
      left: 150,
      top: 150,
      width: 100,
      height: 100,
      fill: "transparent",
      stroke: borderColor,
      strokeWidth: 2,
    });
    editor.canvas.add(rectangle);
    editor.canvas.renderAll();
    updateObjects();
  };

  const onAddLine = () => {
    const line = new fabric.Line([50, 100, 200, 200], {
      stroke: borderColor,
      strokeWidth: 2,
    });
    editor.canvas.add(line);
    editor.canvas.renderAll();
    updateObjects();
  };

  const onAddCircle = () => {
    const circle = new fabric.Circle({
      left: 150,
      top: 150,
      radius: 50,
      fill: "transparent",
      stroke: borderColor,
      strokeWidth: 2,
    });
    editor.canvas.add(circle);
    editor.canvas.renderAll();
    updateObjects();
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prevState = undoStack.pop();
      setRedoStack((prevStack) => [
        ...prevStack,
        JSON.stringify(editor.canvas),
      ]);
      editor.canvas.loadFromJSON(prevState, () => {
        editor.canvas.renderAll();
        updateObjects();
      });
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop();
      setUndoStack((prevStack) => [
        ...prevStack,
        JSON.stringify(editor.canvas),
      ]);
      editor.canvas.loadFromJSON(nextState, () => {
        editor.canvas.renderAll();
        updateObjects();
      });
    }
  };

  const onAddImage = (e, imageUrl) => {
    e.preventDefault();
    fabric.Image.fromURL(
      imageUrl,
      (img) => {
        img.set({ crossOrigin: "anonymous" }); // Set crossOrigin property
        editor?.canvas.add(img);
        editor?.canvas.centerObject(img);
        editor?.canvas.renderAll();
        updateObjects();
      },
      { crossOrigin: "anonymous" } // Ensure crossOrigin is set correctly
    );
  };

  const onDeleteSelected = () => {
    const activeObject = editor?.canvas.getActiveObject();
    if (activeObject) {
      editor?.canvas.remove(activeObject);
      editor?.canvas.discardActiveObject();
      editor?.canvas.renderAll();
      updateObjects();
    }
  };

  const addText = () => {
    const text = new fabric.IText("Your Text Here", {
      left: 50,
      top: 50,
      fill: "#000000",
    });
    editor.canvas.add(text);
    editor.canvas.setActiveObject(text);
    editor.canvas.renderAll();
    updateObjects();
  };

  const changeTextColor = (color) => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject && activeObject.type === "i-text") {
      activeObject.set("fill", color);
      editor.canvas.renderAll();
    }
  };

  const changeFillColor = (color) => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("fill", color);
      editor.canvas.renderAll();
    }
  };

  const handleBorderColorChange = (borderColor) => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("stroke", borderColor);
      editor.canvas.renderAll();
    }
  };

  const changeOpacity = (opacity) => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("opacity", opacity);
      editor.canvas.renderAll();
      setOpacity(opacity);
    }
  };

  const selectObject = (object) => {
    editor.canvas.setActiveObject(object);
    editor.canvas.renderAll();
    setOpacity(object.opacity || 1);
  };

  const bringToFront = () => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      editor.canvas.bringToFront(activeObject);
      editor.canvas.renderAll();
      updateObjects();
    }
  };

  const sendToBack = () => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      editor.canvas.sendToBack(activeObject);
      editor.canvas.renderAll();
      updateObjects();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const fabricImage = new fabric.Image(img, {
            crossOrigin: "anonymous", // Ensure crossOrigin is set
          });
          editor?.canvas.add(fabricImage);
          editor?.canvas.centerObject(fabricImage);
          editor?.canvas.renderAll();
          updateObjects();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  console.log("these are the objects", objects);
  // Download canvas image without toDataURL
  const downloadCanvasImage = () => {
    if (editor.canvas) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = editor.canvas.width;
      tempCanvas.height = editor.canvas.height;
      const tempCtx = tempCanvas.getContext("2d");

      // Ensure all images have crossOrigin set to "anonymous"
      editor.canvas.getObjects("image").forEach((img) => {
        if (!img.crossOrigin) {
          img.crossOrigin = "anonymous";
        }
      });

      tempCtx.drawImage(editor.canvas.getElement(), 0, 0);

      tempCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "canvas_image.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          console.error("Failed to generate blob from canvas");
        }
      }, "image/png");
    } else {
      console.error("Canvas not found");
    }
  };
  const triggerFileInput = () => {
    document.getElementById("fileInput").click();
  };

  const changeStrokeWidth = (width) => {
    const activeObject = editor.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set("strokeWidth", width);
      editor.canvas.renderAll();
      setStrokeWidth(width);
    }
  };

  return (
    <div className="">
      <div className="w-screen h-12 p-1 text-sm justify-center align-center gap-8 border-b border-gray-400 flex flex-row">
        {" "}
        <div className="relative group">
          <img
            src="/undo.svg"
            className="w-8  p-1 cursor-pointer hover:bg-gray-200 h-full"
            onClick={handleUndo}
          ></img>
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Undo
          </div>
        </div>
        <div className="relative group">
          <img
            src="/redo.svg"
            className="w-8  p-1 cursor-pointer hover:bg-gray-200 h-full"
            onClick={handleRedo}
          ></img>
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Redo
          </div>
        </div>
        <div className="relative group">
          <input
            className="w-8 p-1 cursor-pointer hover:bg-gray-200 h-full"
            type="color"
            onChange={(e) => changeFillColor(e.target.value)}
          />
          <div className="absolute top-6 left-full  z-30  p-1 border bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Select fill color
          </div>
        </div>
        <div className="relative group ">
          <input
            className="w-16 p-1 bg-gray-100 text-base focus:border-none focus:outline-none cursor-pointer hover:bg-gray-200 h-full"
            type="number"
            min="0"
            max="16"
            value={strokeWidth}
            onChange={(e) => changeStrokeWidth(parseFloat(e.target.value))}
          />
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Stroke width
          </div>
        </div>
        <div className="relative group">
          <input
            className="w-8 p-1 cursor-pointer hover:bg-gray-200 h-full"
            type="color"
            onChange={(e) => handleBorderColorChange(e.target.value)}
          />
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Select border color
          </div>
        </div>
        <div className="relative group">
          <input
            className="p-1 cursor-pointer hover:bg-gray-200 h-full"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => changeOpacity(e.target.value)}
          />
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Select opacity
          </div>
        </div>
        <div className="relative group">
          <img
            src="/front.svg"
            className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full"
            onClick={bringToFront}
          ></img>
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Bring to front
          </div>
        </div>
        <div className="relative group">
          <img
            src="/back.svg"
            className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full"
            onClick={sendToBack}
          ></img>
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Send to back
          </div>
        </div>
        <div className="relative group">
          <input
            className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full"
            type="color"
            onChange={(e) => changeTextColor(e.target.value)}
          />
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Text color
          </div>
        </div>
        <div className="relative group">
          <img
            src="/delete.svg"
            className="w-8  p-1 cursor-pointer hover:bg-gray-200 h-full"
            onClick={onDeleteSelected}
          ></img>
          <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Delete
          </div>
        </div>
      </div>
      <div className="flex flex-row canvas-container">
        <div classNam="w-[400px]">
          <h1 className="text-2xl font-bold mb-4">Object List</h1>
          <ul className="px-2 max-h-full text-2xl  w-[400px] overflow-y-auto text-left">
            {objects.map((object, index) => (
              <li
                key={index}
                onClick={() => selectObject(object)}
                className="p-2 mb-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100 transition-all"
              >
                {object.type}
                {object.text ? (
                  <span className="text-gray-400  text-xl">
                    - {object.text}
                  </span>
                ) : (
                  <span className="text-gray-400  text-xl">- {index}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-screen py-4 w-[100%] flex border border-gray-400">
          <div className="w-[500px] h-screen relative ">
          <div className="border-2 left-11 top-9 border-red-600 border-dashed  w-[420px] h-[680px] absolute flex justify-center items-center m-auto "></div>
  <div className="border-2 left-20 top-16 border-green-600 border-dashed w-[350px] h-[612px] absolute flex justify-center items-center m-auto "></div>
          <FabricJSCanvas
            className="sample-canvas border border-red-600 shadow-2xl "
            onReady={onReady}
          >
         
          </FabricJSCanvas>
      
          <button
            onClick={onDeleteSelected}
            style={{
              position: "absolute",
              top: deleteButtonPosition.top,
              left: deleteButtonPosition.left,
              backgroundColor: "red",
              zIndex: 100,
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              display: selectedObjects.length > 0 ? "block" : "none",
            }}
          >
            X
          </button>
          </div>
        </div>

        <div className=" items-center">
          <div className="w-full relative group hover:bg-gray-200 p-1">
            <img
              src="/text.svg"
              className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full m-auto"
              onClick={addText}
            ></img>
            <p>Text</p>
            <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Add text to the canvas
            </div>
          </div>
          <div className="w-full relative group hover:bg-gray-200 p-1">
            <StockImg onAddImage={onAddImage} />

            <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Add text to the canvas
            </div>
          </div>
          <div className="w-full relative group hover:bg-gray-200 p-1">
            <img
              src="/image.svg"
              className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full m-auto"
              onClick={triggerFileInput}
            ></img>
            <input
              id="fileInput"
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
            <p>Image</p>
            <div className="absolute top-6 left-full p-1 border z-30 bg-yellow-100 text-black shadow-lg w-max opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Add text to the canvas
            </div>
          </div>
          {/*  shapes dropdown */}
          <div className="relative">
            <div onClick={toggleDropdown} className=" p-2  hover:bg-gray-200">
              <img
                src="/shapes.svg"
                className="w-10 p-1 cursor-pointer hover:bg-gray-200 h-full m-auto"
                alt="shape icon"
              ></img>
              <p>Shapes</p>
            </div>
            {isDropdownOpen && (
              <div className="absolute right-full top-0 mr-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                <button
                  onClick={onAddCircle}
                  className="flex items-center p-2 w-full hover:bg-gray-200 focus:outline-none"
                >
                  <img
                    src="/circle-icon.svg"
                    alt="Circle"
                    className="w-8 h-8 mr-11 "
                  />
                  Add Circle
                </button>
                <button
                  onClick={onAddRectangle}
                  className="flex items-center p-2 w-full hover:bg-gray-200 focus:outline-none"
                >
                  <img
                    src="/rect-icon.svg"
                    alt="Rectangle"
                    className="w-8 h-8 mr-5"
                  />
                  Add Rectangle
                </button>
                <button
                  onClick={onAddLine}
                  className="flex items-center p-2 w-full hover:bg-gray-200 focus:outline-none"
                >
                  <img
                    src="/line-icon.svg"
                    alt="Line"
                    className="w-8 h-8 mr-12"
                  />
                  Add Line
                </button>
              </div>
            )}
          </div>
          <button onClick={downloadCanvasImage}>Download Image</button>
        </div>
      </div>
    </div>
  );
};

export default FabricExample;
