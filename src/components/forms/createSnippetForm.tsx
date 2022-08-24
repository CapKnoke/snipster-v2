import React from 'react';
import { LanguageName, langNames } from '@uiw/codemirror-extensions-langs';
import { useForm, useWatch, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { trpc } from '@utils/trpc';
import { createSnippetInput } from '@server/utils/schemas';
import CodeEditor from '@components/uiElements/codeEditor';
import ErrorToast from '@components/toasts/errorToast';
import SuccessToast from '@components/toasts/successToast';

export type FormValues = {
  data: {
    title: string;
    code: string;
    description?: string;
    language: LanguageName;
    public: boolean;
  };
};

export default function CreateSnippetForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(createSnippetInput),
  });
  const language = useWatch({
    control,
    name: 'data.language',
  });
  const createMutation = trpc.useMutation(['snippet.add']);
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    createMutation.mutate(data);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col md:flex-row bg-gray-900 rounded"
      >
        <div className="flex flex-col md:w-3/5">
          <Controller
            name="data.code"
            control={control}
            render={({ field: { onChange } }) => (
              <CodeEditor editable onChange={onChange} language={language} />
            )}
          />
          <div className="text-center">
            <ErrorMessage errors={errors} name="data.code" />
          </div>
        </div>
        <div className="flex flex-col md:w-2/5 p-4">
          <div className="flex-grow flex flex-col gap-4 justify-between">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
                {...register('data.title')}
              />
              <ErrorMessage errors={errors} name="data.title" />
              <textarea
                placeholder="description"
                className="textarea textarea-bordered w-full h-32"
                {...register('data.description')}
              />
              <ErrorMessage errors={errors} name="data.description" />
              <label className="input-group">
                <span>Language</span>
                <select
                  defaultValue="javascript"
                  className="select select-bordered capitalize flex-grow"
                  {...register('data.language')}
                >
                  {langNames.map((lang) => (
                    <option key={lang} value={lang} className="capitalize">
                      {lang}
                    </option>
                  ))}
                </select>
                <ErrorMessage errors={errors} name="data.language" />
              </label>
              <label className="input-group cursor-pointer w-fit">
                <span>Public</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="toggle toggle-lg"
                  {...register('data.public')}
                />
              </label>
            </div>
            <input type="submit" className="btn btn-block" />
          </div>
        </div>
      </form>
      <div className="toast toast-end bottom-20 lg:bottom-0">
        {createMutation.isError && <ErrorToast errorMessage={createMutation.error.message} />}
        {createMutation.isSuccess && (
          <SuccessToast
            successMessage={`Successfully created snippet with id '${createMutation.data.id}'`}
          />
        )}
      </div>
    </>
  );
}
