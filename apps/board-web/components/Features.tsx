import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Infinity,
  Zap,
  Image,
  Shield,
  Palette,
  MousePointer,
  Cloud,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Users,
      title: "Multiplayer Drawing",
      description:
        "See everyone's cursors and changes in real-time. Collaborate seamlessly with your entire team.",
      badge: "Real-time",
      gradient: "from-green-400 to-blue-500",
    },
    {
      icon: Infinity,
      title: "Infinite Canvas",
      description:
        "Never run out of space. Zoom, pan, and create without boundaries on our limitless canvas.",
      badge: "Unlimited",
      gradient: "from-purple-400 to-pink-500",
    },
    {
      icon: Zap,
      title: "Lightning Sync",
      description:
        "Changes appear instantly across all devices. Experience the fastest collaborative editing.",
      badge: "< 50ms",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      icon: Image,
      title: "Media Embeds",
      description:
        "Drop in images, videos, and files directly onto your board. Rich media support included.",
      badge: "Rich Media",
      gradient: "from-indigo-400 to-cyan-500",
    },
    {
      icon: Palette,
      title: "Creative Tools",
      description:
        "Professional drawing tools, shapes, sticky notes, and text editing. Everything you need to create.",
      badge: "Pro Tools",
      gradient: "from-pink-400 to-red-500",
    },
    {
      icon: Shield,
      title: "Team Management",
      description:
        "Invite team members, control permissions, and manage access with enterprise-grade security.",
      badge: "Enterprise",
      gradient: "from-teal-400 to-green-500",
    },
  ];

  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-br from-background via-primary/5 to-secondary/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-4 bg-primary-light/20 border-primary/30 text-primary"
          >
            <MousePointer className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Everything you need to
            <span className="text-gradient block">collaborate visually</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade tools designed for modern teams. From
            brainstorming to project planning, Think-Board adapts to your
            workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="card bg-white/50 backdrop-blur-sm group shadow-none hover:shadow-sm hover:scale-105 duration-400 hover:border-1 hover:border-secondary"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-soft`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card-gradient rounded-3xl p-12 shadow-card">
          <div className="flex items-center justify-center mb-4">
            <Cloud className="w-8 h-8 text-primary mr-3" />
            <Badge
              variant="outline"
              className="bg-primary-light/20 border-primary/30 text-primary"
            >
              No Installation Required
            </Badge>
          </div>
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to transform your team's collaboration?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of teams already using Think-Board to bring their
            best ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg">
              Start Your Free Board
            </Button>
            <Button variant="feature" size="lg">
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
