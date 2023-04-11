import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import config from "../config/config.js";
import state from "../store/index.js";
import { download } from "../assets";
import { downloadCanvasToImage, reader } from "../config/helpers.js";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants.js";
import { fadeAnimation, slideAnimation } from "../config/motion.js";
import {
  AiPicker,
  ColorPicker,
  CustomButton,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
  });
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
        break;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
        break;
      case "aipicker":
        return (
          <AiPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSumbit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    if (!prompt) return alert("Please enter a prompt");

    try {
      //call backend to generate ai image
      setGeneratingImg(true);
      const response = await fetch("http://localhost:8080/api/v1/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      });
      const data = await response.json();

      handleDecals(type, `data:image/png;base64,${data.photo}`);
    } catch (error) {
      alert(error);
    } finally {
      setGeneratingImg(false);
      setActiveEditorTab("");
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;

      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      default:
        state.isFullTexture = false;
        state.isLogoTexture = true;
        break;
    }

    //after setting the state, activeFilterTab is updated
    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };
  const handleDecals = (type, res) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = res;
    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const readFile = (type) => {
    reader(file).then((res) => {
      handleDecals(type, res);
      setActiveEditorTab("");
    });
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            key="custom"
            className="absolute top-0 left-0 z-10"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen">
              <div className="editortabs-container tabs">
                {EditorTabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    tab={tab}
                    handleClick={() => {
                      setActiveEditorTab(tab.name);
                    }}
                  />
                ))}
              </div>
              {generateTabContent()}
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5"
            {...fadeAnimation}
          >
            <CustomButton
              type="filled"
              title="Go Back"
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              handleClick={() => (state.intro = true)}
            />
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => {
                  handleActiveFilterTab(tab.name);
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
