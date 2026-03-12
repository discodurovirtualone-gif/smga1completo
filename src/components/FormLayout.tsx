import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormLayoutProps {
  title: string;
  children: React.ReactNode;
}

const FormLayout = ({ title, children }: FormLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormLayout;
