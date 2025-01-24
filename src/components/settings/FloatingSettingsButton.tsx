import { Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const FloatingSettingsButton = () => {
  return (
    <Button
      asChild
      className="fixed bottom-20 right-4 md:bottom-8 rounded-full shadow-lg"
      size="icon"
    >
      <Link to="/settings" aria-label="Settings">
        <Settings className="h-5 w-5" />
      </Link>
    </Button>
  );
};

export default FloatingSettingsButton;