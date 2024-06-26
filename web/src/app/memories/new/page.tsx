import NewMemoryForm from "@/components/NewMemoryForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NewMemories() {
  return (
    <div className="flex flex-1 p-16 flex-col gap-4">
      <Link href={"/"} className="flex items-center gap-1 text-sm text-gray-200 hover:text-gray-100">
        <ChevronLeft className="h-4 w-4" />
        Voltar à timeline
      </Link>

      <NewMemoryForm />
    </div>
  )
}