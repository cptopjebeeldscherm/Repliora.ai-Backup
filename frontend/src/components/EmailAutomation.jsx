import React, { useEffect, useState } from "react";
import { useEmailSettings } from "../context/EmailSettingsContext";
import { FiEdit2, FiTrash2, FiPlus, FiSave } from "react-icons/fi";

const EmailAutomation = () => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: "", processingTime: "", shippingTime: "", shippingPartner: "",
    returnPolicy: "", supportEmail: "", location: "", signature: "",
  });
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState("Where is my order?");
  const [templateCategories, setTemplateCategories] = useState({});
  const [customReplies, setCustomReplies] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateNameInput, setTemplateNameInput] = useState("");
  const [templateCategoryInput, setTemplateCategoryInput] = useState("Orders");
  const [editTemplateKey, setEditTemplateKey] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");

  const { setEmailSettings } = useEmailSettings();
  const userEmail = localStorage.getItem("user_email");

  const quizQuestions = [
    { label: "Store Name", name: "storeName" },
    { label: "Processing Time (ex. 1-2 business days)", name: "processingTime" },
    { label: "Shipping Time (ex. 5-7 business days)", name: "shippingTime" },
    { label: "Shipping Partner", name: "shippingPartner" },
    { label: "Return Policy URL", name: "returnPolicy" },
    { label: "Support Email", name: "supportEmail" },
    { label: "Business Location", name: "location" },
    { label: "Signature", name: "signature" },
  ];

  const defaultTemplates = {
    Orders: {
      "Where is my order?": ({ storeName, signature }) =>
        `Hi! Thank you for reaching out to ${storeName}.\n\nPlease allow us a few days to process your order. Once shipped, you’ll receive a tracking number.\n\nBest regards,\n${signature}`,
      "Estimated delivery date": ({ storeName, processingTime, shippingTime, signature }) =>
        `Hello! Thanks for contacting ${storeName}.\n\nOrders typically take ${processingTime} business days to process and ${shippingTime} business days for delivery.\n\nBest regards,\n${signature}`,
      "Why is my order taking long?": ({ storeName, signature }) =>
        `Thank you for your patience. We're currently checking the status of your order and will update you as soon as possible.\n\nBest regards,\n${signature}`,
    },
    Shipping: {
      "Change shipping address": ({ signature }) =>
        `Hi! If your order hasn’t been shipped yet, we’ll update your address. If already shipped, please contact your local courier.\n\nBest regards,\n${signature}`,
      "Cancel order": ({ signature }) =>
        `Thanks for your message. If your order hasn't shipped yet, we’ll cancel and refund it. Otherwise, you may return it once delivered.\n\nBest regards,\n${signature}`,
    },
    Refunds: {
      "Refund request": ({ signature }) =>
        `Thanks for reaching out. If your item has been delivered, we can offer a partial refund.\n\nPlease let us know if you accept.\n\nBest regards,\n${signature}`,
      "Order canceled after dispatch": ({ signature }) =>
        `We apologize. Your order was canceled due to a quality issue. A full refund is being processed.\n\nBest regards,\n${signature}`,
    },
    Returns: {
      "Return cost": ({ signature }) =>
        `Hi there! Returning an item typically costs around £20 depending on the size and weight.\n\nBest regards,\n${signature}`,
      "How to return": ({ returnPolicy, supportEmail, signature }) =>
        `You can view our return policy here: ${returnPolicy}. For help, email us at ${supportEmail}.\n\nBest regards,\n${signature}`,
    },
    Issues: {
      "Wrong item/color/size": ({ supportEmail, signature }) =>
        `We’re sorry you received the wrong item!\n\nPlease send us photos to ${supportEmail} so we can assist you with a replacement.\n\nBest regards,\n${signature}`,
      "Parcel damaged": ({ supportEmail, signature }) =>
        `We're very sorry about the damaged parcel.\n\nPlease send us photos at ${supportEmail}, and we’ll assist you immediately.\n\nBest regards,\n${signature}`,
    },
  };

  useEffect(() => {
    setTemplateCategories(defaultTemplates);
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    fetch("http://localhost:8000/store-info", {
      headers: { "x-user-email": userEmail },
    })
      .then((res) => res.json())
      .then((data) => {
        const info = { ...storeInfo, ...data };
        setStoreInfo(info);
        setEmailSettings(info);
        setQuizCompleted(Object.values(info).some((val) => val !== ""));
      });
  }, [userEmail]);

  const finishQuiz = async () => {
    await fetch("http://localhost:8000/store-info", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-email": userEmail },
      body: JSON.stringify(storeInfo),
    });
    setQuizCompleted(true);
    setEmailSettings(storeInfo);
  };

  const livePreview =
    customReplies[selectedTemplate] ||
    Object.entries(templateCategories)
      .flatMap(([cat, entries]) => Object.entries(entries))
      .find(([key]) => key === selectedTemplate)?.[1]?.(storeInfo) || "";

  const handleSaveReply = () => {
    setCustomReplies({ ...customReplies, [selectedTemplate]: livePreview });
    setSavedMessage("✅ Reply saved!");
    setTimeout(() => setSavedMessage(""), 2000);
  };

  const openEditTemplate = (key, category) => {
    setEditTemplateKey({ key, category });
    setTemplateNameInput(key);
    setTemplateCategoryInput(category);
    setShowTemplateModal(true);
  };

  const handleAddOrEditTemplate = () => {
    const updated = { ...templateCategories };
    const templateFunc = () => customReplies[templateNameInput] || "";

    if (editTemplateKey) {
      delete updated[editTemplateKey.category][editTemplateKey.key];
    }

    if (!updated[templateCategoryInput]) updated[templateCategoryInput] = {};
    updated[templateCategoryInput][templateNameInput] = templateFunc;

    setTemplateCategories(updated);
    setSelectedTemplate(templateNameInput);
    setShowTemplateModal(false);
  };

  const handleDeleteTemplate = () => {
    const updated = { ...templateCategories };
    delete updated[editTemplateKey.category][editTemplateKey.key];
    setTemplateCategories(updated);
    setShowTemplateModal(false);
  };

  const handleStoreInfoSave = async () => {
    await fetch("http://localhost:8000/store-info", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-user-email": userEmail },
      body: JSON.stringify(storeInfo),
    });
    setShowSettings(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Quiz */}
      {!quizCompleted ? (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">
            🧠 Setup Your Store — Step {currentStep + 1} of {quizQuestions.length}
          </h2>
          <label className="block mb-2 font-medium text-gray-700">
            {quizQuestions[currentStep].label}
          </label>
          <input
            name={quizQuestions[currentStep].name}
            value={storeInfo[quizQuestions[currentStep].name]}
            onChange={(e) =>
              setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
          />
          <div className="flex justify-between items-center">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 bg-gray-100 rounded"
            >
              Back
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-gray-100 text-[#10a37f] rounded"
              >
                Skip
              </button>
              <button
                onClick={
                  currentStep === quizQuestions.length - 1
                    ? finishQuiz
                    : () => setCurrentStep(currentStep + 1)
                }
                className="px-5 py-2 bg-[#10a37f] text-white font-medium rounded"
              >
                {currentStep === quizQuestions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Template UI */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">🤖 Email Automation</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-gray-100 rounded text-sm"
              >
                ⚙️ Edit Store Info
              </button>
              <button
                onClick={() => {
                  setQuizCompleted(false);
                  setCurrentStep(0);
                  setStoreInfo({});
                }}
                className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded"
              >
                🔄 Restart Quiz
              </button>
            </div>
          </div>

          {Object.entries(templateCategories).map(([category, templates]) => (
            <div key={category} className="mb-4">
              <h4 className="text-gray-600 text-sm font-semibold mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(templates).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSelectedTemplate(key)}
                    className={`px-4 py-2 rounded-full border ${selectedTemplate === key
                      ? "bg-[#10a37f] text-white"
                      : "bg-white text-gray-800 border-gray-200"
                      }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 text-sm text-gray-600 my-4"
          >
            <FiPlus /> Add New Template
          </button>

          <div className="bg-gray-50 border p-4 rounded-lg whitespace-pre-wrap font-mono text-sm mb-4">
            <h4 className="font-semibold mb-2">Live Preview</h4>
            <p>{livePreview}</p>
          </div>

          <textarea
            rows={6}
            value={customReplies[selectedTemplate] || livePreview}
            onChange={(e) =>
              setCustomReplies({ ...customReplies, [selectedTemplate]: e.target.value })
            }
            className="w-full border px-4 py-3 rounded-lg font-mono text-sm"
          />

          <div className="flex justify-between items-center mt-3">
            <span className="text-green-600 text-sm">{savedMessage}</span>
            <div className="flex gap-3">
              <button
                onClick={handleSaveReply}
                className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <FiSave /> Save
              </button>
              <button
                onClick={() =>
                  openEditTemplate(
                    selectedTemplate,
                    Object.keys(templateCategories).find((cat) =>
                      templateCategories[cat][selectedTemplate]
                    )
                  )
                }
                className="p-2 rounded hover:bg-gray-100"
              >
                <FiEdit2 />
              </button>
            </div>
          </div>
        </>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">🛠️ Edit Store Info</h3>
            {quizQuestions.map((q) => (
              <div key={q.name} className="mb-3">
                <label className="text-sm text-gray-700 font-medium block mb-1">{q.label}</label>
                <input
                  type="text"
                  value={storeInfo[q.name]}
                  onChange={(e) => setStoreInfo({ ...storeInfo, [q.name]: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            ))}
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={handleStoreInfoSave} className="bg-[#10a37f] text-white px-4 py-2 rounded">
                Save
              </button>
              <button onClick={() => setShowSettings(false)} className="text-gray-500 hover:underline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editTemplateKey ? "Edit Template" : "Add New Template"}
            </h3>
            <input
              type="text"
              value={templateNameInput}
              onChange={(e) => setTemplateNameInput(e.target.value)}
              placeholder="Template name"
              className="w-full border px-3 py-2 rounded mb-3"
            />
            <select
              value={templateCategoryInput}
              onChange={(e) => setTemplateCategoryInput(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              {Object.keys(templateCategories).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <div className="flex justify-between items-center">
              <button onClick={handleAddOrEditTemplate} className="bg-black text-white px-4 py-2 rounded">
                Save
              </button>
              {editTemplateKey && (
                <button onClick={handleDeleteTemplate} className="text-red-600 flex items-center gap-1">
                  <FiTrash2 /> Delete
                </button>
              )}
              <button onClick={() => setShowTemplateModal(false)} className="text-gray-500 hover:underline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAutomation;
