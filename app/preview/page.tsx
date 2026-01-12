import { Suspense } from "react";
import PreviewClient from "./PreviewClient";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="p-10 text-center text-gray-400">
        Loading preview...
      </div>
    }>
      <PreviewClient />
    </Suspense>
  );
}
