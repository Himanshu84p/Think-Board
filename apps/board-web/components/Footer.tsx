import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-t border-border/50">
      <div className="w-full flex justify-center items-center py-4">
        <span className="text-foreground text-sm">built with &nbsp;</span>
        <Heart className="inline text-primary" size={16} />
        <span className="text-foreground text-sm ">&nbsp; by himanshu</span>
      </div>
    </footer>
  );
};

export default Footer;
