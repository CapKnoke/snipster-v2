import LoginButton from './loginButton';

export default function Header() {
  return (
    <div className="">
      <div className="flex justify-between items-center bg-gray-900 py-6 px-4 sm:px-6 bg-opacity-40 backdrop-blur-lg rounded drop-shadow-lg">
        <div className="flex justify-start lg:w-0 lg:flex-1">
          <a href="#">
            <span className="sr-only">Workflow</span>
            <img
              className="h-8 w-auto sm:h-10"
              src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
              alt=""
            />
          </a>
        </div>
        <LoginButton />
      </div>
    </div>
  );
}
