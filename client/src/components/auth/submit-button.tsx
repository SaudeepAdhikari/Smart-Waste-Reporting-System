interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: string;
}

export function SubmitButton({ isLoading, loadingText, children }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-md bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-600 dark:hover:bg-green-700"
    >
      {isLoading ? loadingText : children}
    </button>
  );
}
