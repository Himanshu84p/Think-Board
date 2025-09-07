import { Button } from "@/components/ui/button";
import { Zap, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "How it Works", href: "#how-it-works" },
      { name: "Integrations", href: "#" },
      { name: "API", href: "#" },
    ],
    Resources: [
      { name: "Help Center", href: "#" },
      { name: "Templates", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Community", href: "#" },
      { name: "Tutorials", href: "#" },
    ],
    Company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Partners", href: "#" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "Security", href: "#" },
      { name: "Status", href: "#" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "Email", icon: Mail, href: "mailto:hello@thinkboard.com" },
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-10 h-10 bg-cta-gradient rounded-xl shadow-soft">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">
                  Think-Board
                </span>
              </div>

              <p className="text-muted-foreground max-w-md leading-relaxed">
                The collaborative whiteboard that brings teams together. Create,
                share, and innovate with the power of real-time collaboration.
              </p>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">
                  Stay Updated
                </h4>
                <div className="flex space-x-2 max-w-md">
                  <div className="flex-1 relative">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <Button variant="hero" size="sm">
                    Subscribe
                  </Button>
                </div>
              </div>

              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      className="p-2 rounded-lg bg-card-gradient hover:bg-primary-light hover:text-primary transition-all duration-300 group"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">
                  {category}
                </h4>
                <ul className="space-y-3">
                  {links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-muted-foreground">
            <span>© 2024 Think-Board. All rights reserved.</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                All systems operational
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="hero"
          size="lg"
          className="rounded-full shadow-glow animate-glow hidden md:flex"
        >
          Start Free
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
