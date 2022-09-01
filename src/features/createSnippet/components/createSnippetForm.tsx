import React from 'react';
import { useRouter } from 'next/router';
import { LanguageName, langNames } from '@uiw/codemirror-extensions-langs';
import { useForm, useWatch, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ErrorMessage } from '@hookform/error-message';
import { DocumentAddIcon } from '@heroicons/react/outline';
import { createSnippetInput } from '@server/utils/schemas';
import { trpc } from '@utils/trpc';
import CodeEditor from '@features/createSnippet/components/codeEditor';
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
    defaultValues: {
      data: {
        language: 'javascript',
        code: '',
      },
    },
  });
  const language = useWatch({
    control,
    name: 'data.language',
  });
  const router = useRouter();
  const createMutation = trpc.useMutation(['snippet.add'], {
    async onSuccess(data) {
      router.push(`/snippets/${data.id}`);
      return data;
    },
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    createMutation.mutate(data);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 md:flex-row md:max-h-[calc(100vh-12rem)] lg:max-h-[calc(100vh-7rem)]">
        <div className="flex flex-col shadow-md md:w-3/5 bg-[#0d1117]">
          <Controller
            name="data.code"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CodeEditor
                editable
                code={value}
                placeholder="Code..."
                onChange={onChange}
                language={language}
                className="min-h-[20rem] text-base"
              />
            )}
          />
          <div className="text-center">
            <ErrorMessage errors={errors} name="data.code" />
          </div>
        </div>
        <div className="flex flex-col shadow-md md:w-2/5 p-4 bg-neutral">
          <div className="grow flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Title"
                className="input input-bordered w-full"
                {...register('data.title')}
              />
              <ErrorMessage errors={errors} name="data.title" />
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered w-full h-32 resize-none"
                {...register('data.description')}
              />
              <ErrorMessage errors={errors} name="data.description" />
              <label className="input-group">
                <span>Language</span>
                <select
                  className="select select-bordered capitalize grow"
                  {...register('data.language')}
                >
                  {langNames.map((lang) => (
                    <option key={lang} value={lang} className="capitalize">
                      {lang}
                    </option>
                  ))}
                </select>
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
            <button type="submit" className="btn btn-block btn-primary text-base">
              Submit
              <DocumentAddIcon className="h-5 w-5 ml-1" />
            </button>
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
