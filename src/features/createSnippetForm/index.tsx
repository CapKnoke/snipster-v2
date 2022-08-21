import CodeEditor from '@components/uiElements/codeEditor';
import { LanguageName, langNames } from '@uiw/codemirror-extensions-langs';
import { useForm, SubmitHandler, FormProvider, useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';

type FormValues = {
  title: string;
  code: string;
  description?: string;
  language: LanguageName;
  public: boolean;
};

const schema = z.object({
  title: z.string().min(1).max(32),
  description: z.string().max(140),
  code: z.string(),
  language: z.string(),
  public: z.boolean().default(true),
})

export default function CreateSnippetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });
  const onSubmit: SubmitHandler<FormValues> = (data) => {
    console.dir(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 md:flex-row">
      <div className="flex flex-col md:w-3/5">
        <CodeEditor editable />
      </div>
      <div className="flex flex-col md:w-2/5">
        <div className="flex-grow bg-gray-900 rounded p-4 flex flex-col gap-4 justify-between">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title"
              className="input input-bordered w-full"
              {...register('title')}
            />
            <ErrorMessage errors={errors} name="title" />
            <textarea
              placeholder="description"
              className="textarea textarea-bordered w-full h-32"
              {...register('description')}
            />
            <ErrorMessage errors={errors} name="description" />
            <label className="input-group">
              <span>Language</span>
              <select
                className="select select-bordered capitalize flex-grow"
                {...register('language')}
              >
                {langNames.map((lang) => {
                  return (
                    <option key={lang} value={lang} className="capitalize">
                      {lang}
                    </option>
                  );
                })}
              </select>
              <ErrorMessage errors={errors} name="language" />
            </label>
            <label className="input-group cursor-pointer w-fit">
              <span>Public</span>
              <input
                type="checkbox"
                defaultChecked
                className="toggle toggle-lg"
                {...register('public')}
              />
            </label>
          </div>
          <input type="submit" className="btn btn-block" />
        </div>
      </div>
    </form>
  );
}
