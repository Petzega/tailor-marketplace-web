import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
    return (
        <div className="min-h-[70vh] w-full flex items-center justify-center bg-white">
            <Spinner text="Preparando el catálogo..." />
        </div>
    );
}