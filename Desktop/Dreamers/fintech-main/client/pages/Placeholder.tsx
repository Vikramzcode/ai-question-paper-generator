import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function PlaceholderPage({
  title,
  description,
  icon,
}: PlaceholderProps) {
  const navigate = useNavigate();

  return (
    <main className="p-4 lg:p-8 lg:ml-64 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        {icon && <div className="text-6xl opacity-50 mx-auto">{icon}</div>}
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}
