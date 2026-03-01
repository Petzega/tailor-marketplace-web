import { Loader2 } from "lucide-react";

export function Spinner({ text = "Cargando..." }: { text?: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 w-full h-full min-h-[200px]">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            <p className="text-sm font-medium text-gray-500 animate-pulse tracking-wide">
                {text}
            </p>
        </div>
    );
}