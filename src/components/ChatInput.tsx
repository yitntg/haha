import React from 'react'
import { BiBrain } from 'react-icons/bi'
import { FiGlobe, FiPaperclip, FiArrowUp } from 'react-icons/fi'

const ChatInput: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative bg-input-dark rounded-lg">
        <div className="flex items-center p-2">
          <button className="p-2 hover:bg-button-dark rounded-lg flex items-center gap-2 text-gray-400">
            <BiBrain className="text-xl" />
            <span>深度思考</span>
          </button>
          <button className="p-2 hover:bg-button-dark rounded-lg flex items-center gap-2 text-gray-400">
            <FiGlobe className="text-xl" />
            <span>联网搜索</span>
          </button>
        </div>
        <div className="flex items-center p-2 border-t border-gray-700">
          <textarea
            className="flex-1 bg-transparent outline-none resize-none px-2 h-10 leading-10"
            placeholder="给 DeepSeek 发送消息"
            rows={1}
          />
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-button-dark rounded-full text-gray-400">
              <FiPaperclip className="text-xl" />
            </button>
            <button className="p-2 bg-primary-blue hover:bg-blue-600 rounded-full text-white">
              <FiArrowUp className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatInput 