import { Basic } from "@/components/ui/date-picker";

export default function DemoOne() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Date Picker Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            A modern, accessible date picker built with Ark UI
          </p>
        </div>
        <Basic />
      </div>
    </div>
  );
}
