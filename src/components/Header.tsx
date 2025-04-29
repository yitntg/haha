import { FaRobot } from 'react-icons/fa'

const Header = () => {
  return (
    <header className="flex flex-col items-center py-8 px-4">
      <div className="flex items-center gap-3 mb-4">
        <FaRobot className="text-4xl text-primary-blue" />
        <h1 className="text-2xl font-semibold">我是 DeepSeek, 很高兴见到你!</h1>
      </div>
      <p className="text-gray-400 text-center">
        我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
      </p>
    </header>
  )
}

export default Header 