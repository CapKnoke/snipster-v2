import { DocumentAddIcon } from "@heroicons/react/outline";

export default function CreateSnippetFormSkeleton() {
  return (
    <>
      <form
        className="flex flex-col md:flex-row rounded-md"
      >
        <div className="flex flex-col md:w-3/5">
          <div className="grow rounded-t-md md:rounded-t-none md:rounded-l-md bg-[#0d1117]" />
        </div>
        <div className="flex flex-col md:w-2/5 p-4 bg-gray-900">
          <div className="grow flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full input-disabled"
              />
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered w-full h-32 textarea-disabled"
              />
              <label className="input-group">
                <span>Language</span>
                <select
                  className="select select-bordered capitalize grow select-disabled"
                />
              </label>
              <label className="input-group cursor-pointer w-fit">
                <span>Public</span>
                <input
                  type="checkbox"
                  disabled
                  className="toggle toggle-lg di"
                />
              </label>
            </div>
            <button type="submit" className="btn btn-block btn-primary text-base btn-disabled" >
              Submit
              <DocumentAddIcon className="h-5 w-5 ml-1" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}